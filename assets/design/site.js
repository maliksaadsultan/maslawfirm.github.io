/* Progressive enhancement: static content and native navigation work without JS. */
(() => {
  'use strict';
  const nav = document.querySelector('.main-nav');
  const mobile = document.querySelector('.mobile-toggle');
  const disclosures = [...document.querySelectorAll('.nav-disclosure')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  function closeNavigation(restore = false) {
    disclosures.forEach(d => d.open = false);
    nav.classList.remove('is-open');
    mobile.setAttribute('aria-expanded', 'false');
    if (restore && getComputedStyle(mobile).display !== 'none') mobile.focus();
  }
  mobile.addEventListener('click', () => {
    const open = mobile.getAttribute('aria-expanded') !== 'true';
    nav.classList.toggle('is-open', open);
    mobile.setAttribute('aria-expanded', String(open));
    if (!open) disclosures.forEach(d => d.open = false);
  });
  disclosures.forEach(detail => {
    detail.addEventListener('toggle', () => {
      if (detail.open) disclosures.forEach(other => { if (other !== detail) other.open = false; });
    });
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const open = disclosures.find(d => d.open);
    if (open) { open.open = false; open.querySelector('summary').focus(); }
    else if (nav.classList.contains('is-open')) closeNavigation(true);
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) closeNavigation();
  });
  document.addEventListener('focusin', event => {
    if (!event.target.closest('.site-header')) closeNavigation();
  });
  matchMedia('(min-width: 901px)').addEventListener('change', () => closeNavigation());
  // Native fallback: if the deferred script fails, the directory remains linked.
  document.documentElement.classList.add('enhanced');
  window.masNavReady = true;
  document.querySelectorAll('.contents').forEach(detail => {
    if (matchMedia('(max-width: 700px)').matches) detail.open = false;
    detail.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      if (matchMedia('(max-width: 700px)').matches) detail.open = false;
    }));
  });
  document.querySelectorAll('form[data-enquiry]').forEach(form => {
    const status = form.querySelector('.form-status');
    const submit = form.querySelector('[type="submit"]');
    form.addEventListener('input', () => form.querySelector('.wa-prepared')?.remove());
    form.addEventListener('change', () => form.querySelector('.wa-prepared')?.remove());
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      if (submit.disabled) return;
      submit.disabled = true;
      submit.textContent = 'Sending enquiry…';
      status.removeAttribute('data-error');
      status.textContent = 'Sending your enquiry securely to Formspree…';
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      try {
        const response = await fetch(form.action, {
          method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' }, signal: controller.signal
        });
        if (!response.ok) throw new Error('Submission failed');
        status.textContent = 'Your enquiry was submitted successfully. You can also call us if your matter is time-sensitive.';
        form.reset();
        form.querySelector('.wa-prepared')?.remove();
      } catch {
        status.setAttribute('data-error', '');
        status.textContent = 'Your enquiry could not be confirmed. Your details are still here. Please try again, email mastaxfirm@gmail.com or prepare the enquiry on WhatsApp below.';
      } finally {
        clearTimeout(timeout); submit.disabled = false; submit.textContent = 'Send enquiry';
      }
    });
    form.querySelector('.whatsapp-request').addEventListener('click', () => {
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const message = [
        'Hello MAS Law Firm, I would like to discuss a matter.',
        `Name: ${data.get('name') || ''}`,
        `Email: ${data.get('email') || ''}`,
        `Phone: ${data.get('phone') || ''}`,
        `Service: ${data.get('service') || ''}`,
        `Message: ${data.get('message') || ''}`
      ].join('\n');
      let link = form.querySelector('.wa-prepared');
      if (!link) {
        link = document.createElement('a'); link.className = 'wa-prepared';
        link.target = '_blank'; link.rel = 'noopener noreferrer'; form.append(link);
      }
      link.href = 'https://wa.me/923327771392?text=' + encodeURIComponent(message);
      link.textContent = 'Open WhatsApp with your prepared enquiry';
      status.removeAttribute('data-error');
      status.textContent = 'Your enquiry is prepared. Open WhatsApp below, review the message and choose Send there.';
      link.focus();
    });
  });

  // Finite editorial choreography. Underlying content is always visible.
  // No scroll loop, persistent animation styles, or third-party runtime.
  if ('IntersectionObserver' in window && 'animate' in Element.prototype) {
    const active = new Map();
    const recipes = new Map();
    const compact = matchMedia('(max-width: 700px)');
    const ease = 'cubic-bezier(.16,1,.3,1)';
    function play(el, frames, duration = 650, delay = 0) {
      if (reduced.matches || document.hidden || el.contains(document.activeElement)) return;
      const animation = el.animate(frames, {
        duration: compact.matches ? duration * .78 : duration,
        delay, easing: ease, fill: 'backwards'
      });
      active.set(animation, el);
      const release = () => active.delete(animation);
      animation.onfinish = release;
      animation.oncancel = release;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        observer.unobserve(el);
        const recipe = recipes.get(el);
        recipes.delete(el);
        if (reduced.matches || !recipe) return;
        // A deep link or keyboard action must never wait for an entrance.
        let anchor;
        try { anchor = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1))); }
        catch { /* An invalid URL fragment must not interrupt enhancement. */ }
        if (anchor && (el === anchor || el.contains(anchor) || anchor.contains(el))) return;
        const distance = compact.matches ? 9 : 17;
        if (recipe.kind === 'image') {
          const img = el.querySelector('img');
          if (img) play(img, [
            { opacity: .72, transform: `scale(${compact.matches ? 1.025 : 1.055})` },
            { opacity: 1, transform: 'scale(1)' }
          ], 950);
          const caption = el.parentElement.querySelector('figcaption');
          if (caption) play(caption, [
            { opacity: .5, transform: 'translateY(5px)' },
            { opacity: 1, transform: 'translateY(0)' }
          ], 500, 90);
        } else if (recipe.kind === 'marker') {
          play(el, [
            { opacity: .55, transform: 'scale(.85)' },
            { opacity: 1, transform: 'scale(1)' }
          ], 550);
        } else {
          const horizontal = recipe.kind === 'row';
          play(el, [
            { opacity: .45, transform: horizontal ? `translateX(-${distance}px)` : `translateY(${distance}px)` },
            { opacity: 1, transform: 'translate(0, 0)' }
          ], recipe.kind === 'title' ? 750 : 620, compact.matches ? 0 : recipe.delay);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -40px 0px' });
    function register(selector, kind, stagger = 0) {
      document.querySelectorAll(selector).forEach((el, index) => {
        if (el.closest('.preserved-overview, .reference-figure, .review-note') || recipes.has(el)) return;
        recipes.set(el, { kind, delay: Math.min(index * stagger, 180) });
        observer.observe(el);
      });
    }
    register('.interior-heading h1, .intro-story h2, .expertise-heading h2, .approach-title h2, .section-intro h2, .full-directory > h2, .article-content h2, .contact-details h2, .office-hours > h2, .consultation h2', 'title');
    register('.interior-heading > div, .consult-inner > .button', 'detail', 90);
    register('.family', 'detail', 65);
    register('.expertise-row', 'row', 45);
    register('.approach-steps > li', 'detail', 70);
    register('.full-directory .directory-group h3, .contact-details dl > div', 'detail', 55);
    register('.image-viewport', 'image');
    register('.process-step .step-number', 'marker');
    function cancelMotion(predicate = () => true) {
      active.forEach((el, animation) => { if (predicate(el)) animation.cancel(); });
    }
    reduced.addEventListener('change', event => {
      if (event.matches) cancelMotion();
    });
    // Cancel a reveal when a person starts interacting with its content.
    document.addEventListener('focusin', event => cancelMotion(el => el === event.target || el.contains(event.target) || event.target.contains(el)));
    document.addEventListener('pointerdown', event => cancelMotion(el => el === event.target || el.contains(event.target)), { passive: true });
    window.addEventListener('hashchange', () => cancelMotion());
    window.addEventListener('beforeprint', () => cancelMotion());
    document.addEventListener('visibilitychange', () => { if (document.hidden) cancelMotion(); });
  }
})();
