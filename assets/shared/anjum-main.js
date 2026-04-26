/* =============================================
   MAS LAW FIRM — Shared JavaScript
   Animations, Mobile Menu, Scroll Reveal
   ============================================= */

(function markRevealCapable() {
  document.documentElement.classList.add('anjum-reveal-enabled');
  window.setTimeout(function() {
    if (!document.documentElement.classList.contains('anjum-reveal-initialized')) {
      document.documentElement.classList.remove('anjum-reveal-enabled');
      Array.prototype.forEach.call(document.querySelectorAll('.anjum-reveal'), function(el) {
        el.classList.add('is-visible');
      });
    }
  }, 3000);
})();

document.addEventListener('DOMContentLoaded', function() {
  var reducedMotionQuery = window.matchMedia ?
    window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var prefersReducedMotion = !!(reducedMotionQuery && reducedMotionQuery.matches);
  var CONTACT_PHONE_DISPLAY = '+92 332 7771392';
  var CONTACT_PHONE_TEL = '+923327771392';
  var CONTACT_PHONE_WHATSAPP = '923327771392';
  var WHATSAPP_URL = 'https://wa.me/923327771392?text=Hello%2C%20I%20would%20like%20to%20discuss%20a%20tax%20matter%20with%20a%20tax%20lawyer.';

  window.MAS_CONTACT_CONFIG = window.MAS_CONTACT_CONFIG || {};
  window.MAS_CONTACT_CONFIG.CONTACT_PHONE_DISPLAY = CONTACT_PHONE_DISPLAY;
  window.MAS_CONTACT_CONFIG.CONTACT_PHONE_WHATSAPP = CONTACT_PHONE_WHATSAPP;
  window.MAS_CONTACT_CONFIG.WHATSAPP_URL = WHATSAPP_URL;

  function normalizePath(path) {
    if (!path) return '/';
    var normalized = path.replace(window.location.origin, '');
    if (normalized.charAt(0) !== '/') normalized = '/' + normalized;
    normalized = normalized.replace(/\/index\.html$/, '/');
    normalized = normalized.replace(/\/+$/, '/');
    return normalized || '/';
  }

  function getFocusableElements(container) {
    if (!container) return [];
    return Array.prototype.slice.call(
      container.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter(function(el) {
      return !el.hasAttribute('hidden') && el.offsetParent !== null;
    });
  }

  function enhanceRevealTargets() {
    var selector = [
      '.page-content .section-header',
      '.page-content .card',
      '.page-content .contact-info-card',
      '.page-content .process-step',
      '.page-content .doc-list',
      '.page-content .doc-list > li',
      '.page-content .doc-item',
      '.page-content .stat-item',
      '.page-content .anjum-infographic',
      '.page-content .table-wrap',
      '.page-content .contact-form-wrap',
      '.page-content .contact-form',
      '.page-content form.contact-form',
      '.page-content .cta-content',
      '.cta-section',
      '.cta-section .cta-content',
      '.site-footer .footer-brand',
      '.site-footer .footer-links',
      '.site-footer .footer-bottom'
    ].join(',');

    document.querySelectorAll(selector).forEach(function(el) {
      if (
        !el.classList.contains('anjum-reveal') &&
        !el.closest('.anjum-reveal') &&
        !el.querySelector('.anjum-reveal')
      ) {
        el.classList.add('anjum-reveal');
      }
    });

    document.querySelectorAll('.anjum-reveal .anjum-reveal').forEach(function(el) {
      el.classList.remove(
        'anjum-reveal',
        'anjum-reveal-delay-1',
        'anjum-reveal-delay-2',
        'anjum-reveal-delay-3',
        'anjum-reveal-delay-4',
        'anjum-reveal-delay-5',
        'anjum-reveal-delay-6',
        'is-visible'
      );
      el.style.removeProperty('--anjum-reveal-delay');
    });
  }

  function applyRevealStaggering() {
    var groups = document.querySelectorAll([
      '.grid',
      '.services-grid',
      '.process-steps',
      '.doc-list',
      '.stats-row',
      '.footer-grid',
      '.cta-buttons'
    ].join(','));

    groups.forEach(function(group) {
      var items = Array.prototype.slice.call(group.children).filter(function(el) {
        return el.classList && el.classList.contains('anjum-reveal');
      });

      items.forEach(function(el, index) {
        var hasDelayClass = /\banjum-reveal-delay-\d\b/.test(el.className || '');
        if (hasDelayClass || el.style.getPropertyValue('--anjum-reveal-delay')) return;
        el.style.setProperty('--anjum-reveal-delay', Math.min(index, 5) * 70 + 'ms');
      });
    });
  }

  function focusScrollTarget(target) {
    if (!target) return;

    var restoreTabIndex = false;
    if (!target.hasAttribute('tabindex')) {
      target.setAttribute('tabindex', '-1');
      restoreTabIndex = true;
    }

    target.focus({ preventScroll: true });

    if (restoreTabIndex) {
      target.addEventListener('blur', function handleBlur() {
        target.removeAttribute('tabindex');
        target.removeEventListener('blur', handleBlur);
      });
    }
  }

  function ensureRelTokens(link, tokens) {
    var rel = (link.getAttribute('rel') || '').split(/\s+/).filter(Boolean);
    tokens.forEach(function(token) {
      if (rel.indexOf(token) === -1) rel.push(token);
    });
    link.setAttribute('rel', rel.join(' '));
  }

  function normalizeContactLinks() {
    document.querySelectorAll('a[href^="tel:"]').forEach(function(link) {
      link.setAttribute('href', 'tel:' + CONTACT_PHONE_TEL);
    });

    document.querySelectorAll('a[href*="wa.me/"]').forEach(function(link) {
      link.setAttribute('href', WHATSAPP_URL);
      link.setAttribute('target', '_blank');
      ensureRelTokens(link, ['noopener', 'noreferrer']);
      link.setAttribute('aria-label', 'Chat with tax lawyer on WhatsApp');
    });
  }

  /* ---- 1. Scroll Progress Bar ---- */
  (function initScrollProgress() {
    var bar = document.getElementById('scroll-progress');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'scroll-progress';
      document.body.prepend(bar);
    }
    function updateProgress() {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = pct + '%';
    }
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  })();

/* ---- 2. Header Scroll Effect ---- */
(function initHeaderScroll() {
  var header = document.querySelector('.site-header');
  if (!header) return;

  function syncHeaderHeight() {
    document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
  }

  function updateHeader() {
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  if (prefersReducedMotion) {
    header.classList.add('scrolled');
  }

  syncHeaderHeight();
  window.addEventListener('resize', syncHeaderHeight);
})();

  enhanceRevealTargets();
  applyRevealStaggering();
  normalizeContactLinks();

  /* ---- 3. Scroll Reveal (Intersection Observer) ---- */
  (function initScrollReveal() {
    var reveals = Array.prototype.slice.call(document.querySelectorAll('.anjum-reveal'));
    var observer = null;
    var ticking = false;
    var root = document.documentElement;

    function revealElement(el) {
      if (!el || el.classList.contains('is-visible')) return;
      el.classList.add('is-visible');
      if (observer) observer.unobserve(el);
    }

    function revealAll() {
      reveals.forEach(revealElement);
      root.classList.add('anjum-reveal-initialized');
      root.classList.remove('anjum-reveal-enabled');
    }

    function getRevealMargin() {
      if (window.matchMedia && window.matchMedia('(max-width: 640px)').matches) {
        return Math.max(120, Math.round(window.innerHeight * 0.18));
      }
      if (window.matchMedia && window.matchMedia('(max-width: 1024px)').matches) {
        return Math.max(120, Math.round(window.innerHeight * 0.14));
      }
      return Math.max(80, Math.round(window.innerHeight * 0.10));
    }

    function isNearViewport(el) {
      if (!el || el.classList.contains('is-visible')) return false;
      var rect = el.getBoundingClientRect();
      var margin = getRevealMargin();
      return rect.width > 0 &&
        rect.height > 0 &&
        rect.top <= window.innerHeight + margin &&
        rect.bottom >= -margin;
    }

    function revealNearViewport() {
      ticking = false;
      reveals.forEach(function(el) {
        if (isNearViewport(el)) revealElement(el);
      });
    }

    function scheduleRevealCheck() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(revealNearViewport);
    }

    if (!reveals.length) return;
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealAll();
      return;
    }

    root.classList.add('anjum-reveal-initialized');

    observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          revealElement(entry.target);
        }
      });
    }, { threshold: 0.01, rootMargin: '0px 0px 12% 0px' });

    reveals.forEach(function(el) {
      if (isNearViewport(el)) {
        revealElement(el);
      } else {
        observer.observe(el);
      }
    });

    window.addEventListener('scroll', scheduleRevealCheck, { passive: true });
    window.addEventListener('resize', scheduleRevealCheck);
    window.addEventListener('orientationchange', function() {
      window.setTimeout(scheduleRevealCheck, 250);
    });
    window.addEventListener('load', scheduleRevealCheck);
    window.addEventListener('pageshow', scheduleRevealCheck);
    window.setTimeout(scheduleRevealCheck, 700);
    window.setTimeout(scheduleRevealCheck, 1800);

    if (reducedMotionQuery) {
      var handleMotionPreferenceChange = function(event) {
        if (event.matches) {
          prefersReducedMotion = true;
          revealAll();
        }
      };
      if (reducedMotionQuery.addEventListener) {
        reducedMotionQuery.addEventListener('change', handleMotionPreferenceChange);
      } else if (reducedMotionQuery.addListener) {
        reducedMotionQuery.addListener(handleMotionPreferenceChange);
      }
    }
  })();

  /* ---- 4. Counter Animation ---- */
  (function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;
    if (!('IntersectionObserver' in window)) {
      counters.forEach(function(el) {
        el.textContent = parseInt(el.getAttribute('data-count'), 10) + (el.getAttribute('data-suffix') || '');
      });
      return;
    }
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-count'), 10);
          var suffix = el.getAttribute('data-suffix') || '';
          var duration = 1800;
          var start = performance.now();
          function update(now) {
            var elapsed = now - start;
            var progress = Math.min(elapsed / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 4);
            var current = Math.round(eased * target);
            el.textContent = current + suffix;
            if (progress < 1) requestAnimationFrame(update);
          }
          if (prefersReducedMotion) {
            el.textContent = target + suffix;
          } else {
            requestAnimationFrame(update);
          }
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function(el) { observer.observe(el); });
  })();

  /* ---- 4A. Active Navigation ---- */
  (function initActiveNavigation() {
    var currentPath = normalizePath(window.location.pathname);
    var guidelinePaths = [
      '/become_tax_filer/',
      '/difference_between_firm_company/',
      '/weboc_registration/',
      '/chamber_of_commerce_registration/',
      '/NTN_registration/'
    ];
    var links = document.querySelectorAll('.primary-nav a[href], .breadcrumbs a[href]');

    links.forEach(function(link) {
      var href = link.getAttribute('href');
      if (!href || href === '#') return;

      var linkPath = normalizePath(href);
      var isCurrent = linkPath === currentPath;

      if (!isCurrent && linkPath !== '/' && currentPath.indexOf(linkPath) === 0) {
        isCurrent = link.closest('.primary-nav') &&
          link.closest('li') &&
          !link.closest('.dropdown-menu');
      }

      if (!isCurrent && link.closest('.primary-nav') &&
          link.textContent.trim() === 'Guidelines' &&
          guidelinePaths.indexOf(currentPath) !== -1) {
        isCurrent = true;
      }

      if (isCurrent) {
        link.classList.add('active');
        if (link.closest('.primary-nav')) {
          link.setAttribute('aria-current', 'page');
          var parentListItem = link.closest('li');
          while (parentListItem) {
            parentListItem.classList.add('is-current');
            parentListItem = parentListItem.parentElement ?
              parentListItem.parentElement.closest('li') : null;
          }
        }
      }
    });
  })();

  /* ---- 4B. External Link Safety ---- */
  (function initExternalLinkSafety() {
    document.querySelectorAll('a[href^="http"]').forEach(function(link) {
      if (link.hostname && link.hostname !== window.location.hostname) {
        var rel = (link.getAttribute('rel') || '').split(/\s+/).filter(Boolean);
        ['noopener', 'noreferrer'].forEach(function(token) {
          if (rel.indexOf(token) === -1) rel.push(token);
        });
        link.setAttribute('rel', rel.join(' '));
      }
    });
  })();

/* ---- 5. Desktop Nested Dropdowns ---- */
(function initDesktopDropdownIntent() {
  if (!window.matchMedia || !window.matchMedia('(min-width: 1101px)').matches) return;

  var nestedItems = document.querySelectorAll('.primary-nav .dropdown-menu > li.has-dropdown');

  nestedItems.forEach(function(item) {
    var closeTimer = null;

    function openMenu() {
      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }
      item.classList.add('submenu-open');
    }

    function closeMenu() {
      closeTimer = window.setTimeout(function() {
        item.classList.remove('submenu-open');
        closeTimer = null;
      }, 180);
    }

    item.addEventListener('mouseenter', openMenu);
    item.addEventListener('mouseleave', closeMenu);
    item.addEventListener('focusin', openMenu);
    item.addEventListener('focusout', function() {
      window.setTimeout(function() {
        if (!item.contains(document.activeElement)) {
          item.classList.remove('submenu-open');
        }
      }, 0);
    });
  });
})();

/* ---- 5A. Accessible Desktop Dropdowns ---- */
(function initDesktopDropdownAccessibility() {
  var nav = document.querySelector('.primary-nav');
  if (!nav) return;

  var dropdownItems = nav.querySelectorAll('li.has-dropdown');
  var coarsePointer = window.matchMedia ?
    window.matchMedia('(hover: none), (pointer: coarse)') : { matches: false };

  function closeItem(item) {
    if (!item) return;
    item.classList.remove('is-open');
    var trigger = Array.prototype.find.call(item.children, function(child) {
      return child.tagName === 'A';
    });
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  }

  function closeAll(except) {
    dropdownItems.forEach(function(item) {
      if (item !== except && !item.contains(except)) closeItem(item);
    });
  }

  dropdownItems.forEach(function(item) {
    var trigger = Array.prototype.find.call(item.children, function(child) {
      return child.tagName === 'A';
    });
    var menu = Array.prototype.find.call(item.children, function(child) {
      return child.classList && child.classList.contains('dropdown-menu');
    });
    if (!trigger || !menu) return;

    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');

    function openItem() {
      closeAll(item);
      item.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');

      var rect = menu.getBoundingClientRect();
      if (rect.right > window.innerWidth - 12) item.classList.add('open-left');
      if (rect.left < 12) item.classList.remove('open-left');
    }

    item.addEventListener('mouseenter', openItem);
    item.addEventListener('focusin', openItem);
    item.addEventListener('mouseleave', function() { closeItem(item); });
    item.addEventListener('focusout', function() {
      window.setTimeout(function() {
        if (!item.contains(document.activeElement)) closeItem(item);
      }, 0);
    });

    trigger.addEventListener('click', function(event) {
      if (!coarsePointer.matches) return;
      if (!item.classList.contains('is-open')) {
        event.preventDefault();
        openItem();
      }
    });
  });

  document.addEventListener('click', function(event) {
    if (!nav.contains(event.target)) closeAll(null);
  });

  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') closeAll(null);
  });
})();

/* ---- 5. Mobile Menu ---- */
(function initMobileMenu() {
  var hamburger = document.querySelector('.hamburger');
  var panel = document.querySelector('.mobile-menu-panel');
  var overlay = document.querySelector('.mobile-overlay');
  var closeBtn = document.querySelector('.mobile-menu-close');
  var mobileNav = document.querySelector('.mobile-nav');
  var desktopNav = document.querySelector('.primary-nav ul.menu');
  var lastFocusedElement = null;
  var panelId = 'mobile-menu-panel';
  var currentPath = normalizePath(window.location.pathname);
  var desktopBreakpoint = window.matchMedia ? window.matchMedia('(min-width: 1101px)') : null;
  var touchStartX = 0;
  var touchStartY = 0;
  var touchEndX = 0;
  var touchEndY = 0;
  var swipeThreshold = 50;
  var submenuCount = 0;

  if (!hamburger || !panel) return;

  hamburger.setAttribute('type', 'button');
  hamburger.setAttribute('aria-label', 'Open menu');
  panel.id = panelId;
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-label', 'Site menu');
  panel.setAttribute('aria-hidden', 'true');
  if ('inert' in panel) panel.inert = true;
  hamburger.setAttribute('aria-controls', panelId);
  hamburger.setAttribute('aria-expanded', 'false');
  if (overlay) overlay.setAttribute('aria-hidden', 'true');
  if (closeBtn) {
    closeBtn.setAttribute('type', 'button');
    closeBtn.textContent = '\u00d7';
  }

  function syncSubmenuHeight(submenuEl) {
    if (!submenuEl || submenuEl.hidden) return;
    submenuEl.style.setProperty('--mobile-submenu-height', submenuEl.scrollHeight + 'px');
  }

  function syncOpenAncestorSubmenus(submenuEl) {
    var parent = submenuEl && submenuEl.parentElement ?
      submenuEl.parentElement.closest('.mobile-submenu.open') : null;

    while (parent) {
      syncSubmenuHeight(parent);
      parent = parent.parentElement ? parent.parentElement.closest('.mobile-submenu.open') : null;
    }
  }

  function setSubmenuState(itemWrapper, toggle, submenuEl, isOpen) {
    if (!itemWrapper || !toggle || !submenuEl) return;
    itemWrapper.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    submenuEl.setAttribute('aria-hidden', isOpen ? 'false' : 'true');

    if (isOpen) {
      submenuEl.hidden = false;
      syncSubmenuHeight(submenuEl);
      window.requestAnimationFrame(function() {
        submenuEl.classList.add('open');
        syncSubmenuHeight(submenuEl);
        syncOpenAncestorSubmenus(submenuEl);
      });
      return;
    }

    submenuEl.classList.remove('open');

    if (prefersReducedMotion || !submenuEl.isConnected || submenuEl.hidden) {
      submenuEl.hidden = true;
      submenuEl.style.removeProperty('--mobile-submenu-height');
      syncOpenAncestorSubmenus(submenuEl);
      return;
    }

    window.setTimeout(function() {
      if (!submenuEl.classList.contains('open')) {
        submenuEl.hidden = true;
        submenuEl.style.removeProperty('--mobile-submenu-height');
        syncOpenAncestorSubmenus(submenuEl);
      }
    }, 320);
  }

  /* Populate mobile nav from desktop menu */
  function buildMobileNavItem(sourceItem, depth, ancestorPaths) {
    var directLink = Array.prototype.find.call(sourceItem.children, function(child) {
      return child.tagName === 'A';
    });
    var submenu = Array.prototype.find.call(sourceItem.children, function(child) {
      return child.classList && child.classList.contains('dropdown-menu');
    });
    var href = directLink ? (directLink.getAttribute('href') || '#') : '#';
    var text = directLink ? directLink.textContent.trim() : '';
    var hasLink = !!directLink && href !== '#';
    var linkPath = hasLink ? normalizePath(href) : '';
    var isDuplicateAncestor = hasLink && ancestorPaths.indexOf(linkPath) !== -1;
    var isCurrent = hasLink && linkPath === currentPath && !isDuplicateAncestor;
    var containsCurrent = isCurrent;
    var itemWrapper = document.createElement('div');
    var row = document.createElement('div');
    var linkOrLabel;

    if (!directLink && !submenu) return null;

    itemWrapper.className = 'mobile-nav-item';
    itemWrapper.style.setProperty('--mobile-nav-level', depth);
    row.className = 'mobile-nav-row';

    if (hasLink) {
      linkOrLabel = directLink.cloneNode(true);
      linkOrLabel.className = 'mobile-nav-link';
      linkOrLabel.removeAttribute('aria-current');
      if (isCurrent) {
        linkOrLabel.classList.add('is-current');
        linkOrLabel.setAttribute('aria-current', 'page');
      }
      linkOrLabel.addEventListener('click', closeMenu);
    } else {
      linkOrLabel = document.createElement('span');
      linkOrLabel.className = 'mobile-nav-label';
      linkOrLabel.textContent = text || sourceItem.textContent.trim();
    }

    row.appendChild(linkOrLabel);

    if (submenu) {
      var toggle = document.createElement('button');
      var mobileSub = document.createElement('div');
      var submenuId = 'mobile-submenu-' + submenuCount++;
      var nextAncestorPaths = ancestorPaths.slice();

      itemWrapper.classList.add('has-children');

      toggle.type = 'button';
      toggle.className = 'mobile-nav-toggle';
      toggle.setAttribute('aria-controls', submenuId);
      toggle.setAttribute('aria-label', 'Toggle ' + (text || 'submenu'));
      toggle.innerHTML = '<span class="chevron" aria-hidden="true"><i class="fa fa-chevron-down" aria-hidden="true"></i></span>';

      mobileSub.className = 'mobile-submenu';
      mobileSub.id = submenuId;
      mobileSub.setAttribute('role', 'group');
      mobileSub.setAttribute('aria-label', (text || 'Submenu') + ' links');

      if (hasLink) nextAncestorPaths.push(linkPath);

      Array.prototype.forEach.call(submenu.children, function(subItem) {
        var childResult = buildMobileNavItem(subItem, depth + 1, nextAncestorPaths);
        if (!childResult) return;
        if (childResult.containsCurrent) containsCurrent = true;
        mobileSub.appendChild(childResult.element);
      });

      toggle.addEventListener('click', function() {
        var shouldOpen = toggle.getAttribute('aria-expanded') !== 'true';
        setSubmenuState(itemWrapper, toggle, mobileSub, shouldOpen);
      });

      row.appendChild(toggle);
      itemWrapper.appendChild(row);
      itemWrapper.appendChild(mobileSub);
      setSubmenuState(itemWrapper, toggle, mobileSub, containsCurrent);
    } else {
      itemWrapper.appendChild(row);
    }

    if (containsCurrent) itemWrapper.classList.add('has-current');

    return {
      element: itemWrapper,
      containsCurrent: containsCurrent
    };
  }

  function populateMobileNav() {
    if (!mobileNav || !desktopNav) return;

    submenuCount = 0;
    mobileNav.innerHTML = '';

    Array.prototype.forEach.call(desktopNav.children, function(item) {
      var mobileItem = buildMobileNavItem(item, 0, []);
      if (mobileItem) {
        mobileNav.appendChild(mobileItem.element);
      }
    });
  }

  populateMobileNav();
  if (mobileNav) {
    mobileNav.querySelectorAll('.mobile-submenu.open').forEach(syncSubmenuHeight);
  }

  function setMenuState(isOpen) {
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    panel.classList.toggle('open', isOpen);
    panel.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    if ('inert' in panel) panel.inert = !isOpen;
    document.body.classList.toggle('menu-open', isOpen);

    if (overlay) {
      overlay.classList.toggle('active', isOpen);
      overlay.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    }
  }

  function trapFocus(event) {
    if (!panel.classList.contains('open') || event.key !== 'Tab') return;
    var focusable = getFocusableElements(panel);
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function openMenu() {
    lastFocusedElement = document.activeElement;
    setMenuState(true);
    panel.scrollTop = 0;
    var focusable = getFocusableElements(panel);
    if (focusable.length) focusable[0].focus();
  }

  function closeMenu() {
    setMenuState(false);
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  function closeMenuForDesktop() {
    if (desktopBreakpoint && desktopBreakpoint.matches && panel.classList.contains('open')) {
      closeMenu();
    }
  }

  hamburger.addEventListener('click', function() {
    if (panel.classList.contains('open')) closeMenu();
    else openMenu();
  });

  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (overlay) overlay.addEventListener('click', closeMenu);

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && panel.classList.contains('open')) closeMenu();
    trapFocus(e);
  });

  if (panel && !prefersReducedMotion) {
    panel.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    panel.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      if (!panel.classList.contains('open')) return;
      var diffX = touchEndX - touchStartX;
      var diffY = touchEndY - touchStartY;
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > swipeThreshold) {
        if (diffX > 0 && touchStartX < 100) {
          closeMenu();
        }
      }
    }
  }

  window.addEventListener('resize', closeMenuForDesktop);
  window.addEventListener('orientationchange', closeMenuForDesktop);
})();

/* ---- 5A. Back to Top Button ---- */
(function initBackToTop() {
  var btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '<i class="fa fa-chevron-up" aria-hidden="true"></i>';
  btn.style.cssText = 'position:fixed;bottom:90px;right:20px;width:44px;height:44px;border-radius:50%;background:var(--navy);color:#fff;border:none;cursor:pointer;opacity:0;visibility:hidden;transition:all 0.3s ease;z-index:850;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 4px 12px rgba(10,37,64,0.3);';
  document.body.appendChild(btn);

  function toggleBackToTop() {
    if (window.scrollY > 300) {
      btn.style.opacity = '1';
      btn.style.visibility = 'visible';
    } else {
      btn.style.opacity = '0';
      btn.style.visibility = 'hidden';
    }
  }

  window.addEventListener('scroll', toggleBackToTop, { passive: true });
  toggleBackToTop();

  btn.addEventListener('click', function() {
    if (prefersReducedMotion) {
      window.scrollTo(0, 0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  btn.addEventListener('mouseenter', function() {
    btn.style.background = 'var(--navy-light)';
    btn.style.transform = 'translateY(-2px)';
  });

  btn.addEventListener('mouseleave', function() {
    btn.style.background = 'var(--navy)';
    btn.style.transform = 'translateY(0)';
  });
})();

  /* ---- 6. Placeholder hash links ---- */
  (function initPlaceholderHashLinks() {
    document.querySelectorAll('.primary-nav a[href="#"], .breadcrumbs a[href="#"]').forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
      });
    });
  })();

/* ---- 7. Smooth scroll for anchor links ---- */
(function initSmoothScroll() {
  var headerHeight = document.querySelector('.site-header') ?
    document.querySelector('.site-header').offsetHeight : 72;

  document.querySelectorAll('a[href^="#"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') {
        e.preventDefault();
        return;
      }

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        var offsetPosition = targetPosition - headerHeight - 20;

        if (prefersReducedMotion) {
          window.scrollTo(0, offsetPosition);
          focusScrollTarget(target);
        } else {
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          window.setTimeout(function() {
            focusScrollTarget(target);
          }, 400);
        }
      }
    });
  });
})();

  /* ---- 8. Shared Form Enhancements ---- */
  (function initForms() {
    var forms = document.querySelectorAll('form[action*="formspree.io"]');
    if (!forms.length) return;

    function ensureFieldError(field) {
      var describedBy = field.getAttribute('aria-describedby') || '';
      var errorId = field.id + '-error';
      var existing = document.getElementById(errorId);

      if (!existing) {
        existing = document.createElement('div');
        existing.id = errorId;
        existing.className = 'form-error';
        field.insertAdjacentElement('afterend', existing);
      }

      if (describedBy.indexOf(errorId) === -1) {
        field.setAttribute('aria-describedby', (describedBy + ' ' + errorId).trim());
      }

      return existing;
    }

    function setFieldState(field, message) {
      var errorNode = ensureFieldError(field);
      field.classList.remove('is-invalid', 'is-valid');
      field.removeAttribute('aria-invalid');
      errorNode.textContent = '';
      errorNode.classList.remove('is-visible');

      if (message) {
        field.classList.add('is-invalid');
        field.setAttribute('aria-invalid', 'true');
        errorNode.textContent = message;
        errorNode.classList.add('is-visible');
        return false;
      }

      if (field.value.trim()) {
        field.classList.add('is-valid');
      }

      return true;
    }

    function validateField(field) {
      var value = field.value.trim();
      var type = (field.getAttribute('type') || '').toLowerCase();

      if (field.hasAttribute('required') && !value) {
        return setFieldState(field, 'This field is required.');
      }

      if (type === 'email' && value) {
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
          return setFieldState(field, 'Enter a valid email address.');
        }
      }

      if (type === 'tel' && value) {
        var phonePattern = /^[+0-9()\-\s]{7,20}$/;
        if (!phonePattern.test(value)) {
          return setFieldState(field, 'Enter a valid phone number.');
        }
      }

      return setFieldState(field, '');
    }

forms.forEach(function(form, index) {
    var submitButton = form.querySelector('[type="submit"]');
    var fields = form.querySelectorAll('input, textarea, select');
    var status = document.createElement('div');

    if (!form.id) {
      form.id = 'shared-form-' + (index + 1);
    }

    form.setAttribute('novalidate', 'novalidate');
    status.className = 'form-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    form.appendChild(status);

    fields.forEach(function(field, fieldIndex) {
      if (!field.id) {
        field.id = form.id + '-field-' + (fieldIndex + 1);
      }

      ensureFieldError(field);
      field.addEventListener('blur', function() {
        validateField(field);
      });
      field.addEventListener('input', function() {
        if (field.classList.contains('is-invalid')) {
          validateField(field);
        }
      });
    });

    form.addEventListener('submit', function(event) {
      event.preventDefault();

      var firstInvalid = null;
      var formIsValid = true;

      status.className = 'form-status';
      status.textContent = '';

      fields.forEach(function(field) {
        var fieldValid = validateField(field);
        if (!fieldValid && !firstInvalid) firstInvalid = field;
        formIsValid = formIsValid && fieldValid;
      });

      if (!formIsValid) {
        status.classList.add('is-visible', 'is-error');
        status.textContent = 'Please correct the highlighted fields and try again.';
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      if (!submitButton) return;

      if (submitButton.disabled) return;
      submitButton.disabled = true;
      submitButton.setAttribute('aria-disabled', 'true');
      submitButton.setAttribute('aria-busy', 'true');
      form.setAttribute('aria-busy', 'true');
      var originalLabel = submitButton.innerHTML;
      submitButton.innerHTML = 'Sending...';

      if (!window.fetch || !window.FormData) {
        form.submit();
        return;
      }

      var payload;
      try {
        payload = new FormData(form);
      } catch (error) {
        form.submit();
        return;
      }

      fetch(form.action, {
        method: form.method || 'POST',
        body: payload,
        headers: {
          'Accept': 'application/json'
        }
      }).then(function(response) {
        if (!response.ok) {
          throw new Error('Unable to send form');
        }
        form.reset();
        fields.forEach(function(field) {
          setFieldState(field, '');
        });
        status.classList.add('is-visible', 'is-success');
        status.textContent = 'Your message has been sent successfully. We will get back to you soon.';
      }).catch(function() {
        status.classList.add('is-visible', 'is-error');
        status.textContent = 'We could not send your message right now. Please call, WhatsApp, or try again in a moment.';
      }).finally(function() {
        submitButton.disabled = false;
        submitButton.removeAttribute('aria-disabled');
        submitButton.removeAttribute('aria-busy');
        form.removeAttribute('aria-busy');
        submitButton.innerHTML = originalLabel;
      });
    });
  });
})();

  /* ---- 9. Page hero entrance ---- */
  (function initPageEntrance() {
    var hero = document.querySelector('.hero, .page-hero');
    if (!hero) return;

    var items = hero.querySelectorAll(
      '.breadcrumbs, .eyebrow, h1, .hero-title, .hero-subtitle, .hero-sub, .cta-group, .hero-cards, .hero-stats'
    );
    if (!items.length) return;

    if (prefersReducedMotion) {
      hero.classList.add('is-visible');
      return;
    }

    hero.classList.add('anjum-page-entrance');
    items.forEach(function(item, index) {
      item.classList.add('anjum-page-entrance-item');
      item.style.setProperty('--anjum-entrance-delay', Math.min(index, 5) * 90 + 'ms');
    });

    window.requestAnimationFrame(function() {
      hero.classList.add('is-visible');
    });
  })();

});
