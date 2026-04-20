/* =============================================
   MAS LAW FIRM — Shared JavaScript
   Animations, Mobile Menu, Scroll Reveal
   ============================================= */

document.addEventListener('DOMContentLoaded', function() {
  var prefersReducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
})();

  /* ---- 3. Scroll Reveal (Intersection Observer) ---- */
  (function initScrollReveal() {
    var reveals = document.querySelectorAll('.anjum-reveal');
    if (!reveals.length) return;
    if (prefersReducedMotion) {
      reveals.forEach(function(el) { el.classList.add('is-visible'); });
      return;
    }
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function(el) { observer.observe(el); });
  })();

  /* ---- 4. Counter Animation ---- */
  (function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;
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
  var desktopBreakpoint = window.matchMedia ? window.matchMedia('(min-width: 1025px)') : null;
  var touchStartX = 0;
  var touchStartY = 0;
  var touchEndX = 0;
  var touchEndY = 0;
  var swipeThreshold = 50;

  if (!hamburger || !panel) return;

  panel.id = panelId;
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-label', 'Site menu');
  panel.setAttribute('aria-hidden', 'true');
  hamburger.setAttribute('aria-controls', panelId);
  hamburger.setAttribute('aria-expanded', 'false');

  /* Populate mobile nav from desktop menu */
  function populateMobileNav() {
    if (!mobileNav || !desktopNav) return;

    mobileNav.innerHTML = '';
    Array.prototype.forEach.call(desktopNav.children, function(item, index) {
      var directLink = Array.prototype.find.call(item.children, function(child) {
        return child.tagName === 'A';
      });
      var submenu = Array.prototype.find.call(item.children, function(child) {
        return child.classList && child.classList.contains('dropdown-menu');
      });

      if (!directLink) return;

      var href = directLink.getAttribute('href') || '#';
      var text = directLink.textContent.trim();

      if (submenu) {
        var itemWrapper = document.createElement('div');
        var row = document.createElement('div');
        var linkOrLabel;
        var toggle = document.createElement('button');
        var mobileSub = document.createElement('div');
        var submenuId = 'mobile-submenu-' + index;

        itemWrapper.className = 'mobile-nav-item';
        row.className = 'mobile-nav-row';

        if (href && href !== '#') {
          linkOrLabel = directLink.cloneNode(true);
          linkOrLabel.className = 'mobile-nav-link';
          linkOrLabel.addEventListener('click', closeMenu);
        } else {
          linkOrLabel = document.createElement('span');
          linkOrLabel.className = 'mobile-nav-label';
          linkOrLabel.textContent = text;
        }

        toggle.type = 'button';
        toggle.className = 'mobile-nav-toggle';
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-controls', submenuId);
        toggle.setAttribute('aria-label', 'Toggle ' + text + ' submenu');
        toggle.innerHTML = '<span class="chevron"><i class="fa fa-chevron-down" aria-hidden="true"></i></span>';

        mobileSub.className = 'mobile-submenu';
        mobileSub.id = submenuId;

        submenu.querySelectorAll('a[href]').forEach(function(subLink) {
          var subClone = subLink.cloneNode(true);
          var subPath = normalizePath(subClone.getAttribute('href'));
          if (subPath === normalizePath(window.location.pathname)) {
            subClone.classList.add('is-current');
            subClone.setAttribute('aria-current', 'page');
          }
          subClone.addEventListener('click', closeMenu);
          mobileSub.appendChild(subClone);
        });

        toggle.addEventListener('click', function() {
          var isOpen = toggle.getAttribute('aria-expanded') === 'true';

          mobileNav.querySelectorAll('.mobile-nav-toggle[aria-expanded="true"]').forEach(function(openToggle) {
            openToggle.setAttribute('aria-expanded', 'false');
          });
          mobileNav.querySelectorAll('.mobile-submenu.open').forEach(function(openSubmenu) {
            openSubmenu.classList.remove('open');
          });

          if (!isOpen) {
            toggle.setAttribute('aria-expanded', 'true');
            mobileSub.classList.add('open');
          }
        });

        row.appendChild(linkOrLabel);
        row.appendChild(toggle);
        itemWrapper.appendChild(row);
        itemWrapper.appendChild(mobileSub);
        mobileNav.appendChild(itemWrapper);
      } else {
        var standaloneLink = directLink.cloneNode(true);
        standaloneLink.className = 'mobile-nav-link';

        if (normalizePath(href) === normalizePath(window.location.pathname)) {
          standaloneLink.classList.add('is-current');
          standaloneLink.setAttribute('aria-current', 'page');
        }

        standaloneLink.addEventListener('click', closeMenu);
        mobileNav.appendChild(standaloneLink);
      }
    });
  }

  populateMobileNav();

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
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    var focusable = getFocusableElements(panel);
    if (focusable.length) focusable[0].focus();
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
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
  btn.style.cssText = 'position:fixed;bottom:90px;right:20px;width:44px;height:44px;border-radius:50%;background:var(--navy);color:#fff;border:none;cursor:pointer;opacity:0;visibility:hidden;transition:all 0.3s ease;z-index:9998;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 4px 12px rgba(10,37,64,0.3);';
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
    var formKey = form.action + '-submitted';

    if (!form.id) {
      form.id = 'shared-form-' + (index + 1);
    }

    if (sessionStorage.getItem(formKey)) {
      sessionStorage.removeItem(formKey);
      status.className = 'form-status is-visible is-success';
      status.textContent = 'Your message was already sent. If you need to send another message, please refresh the page.';
      status.setAttribute('role', 'status');
      status.setAttribute('aria-live', 'polite');
      form.appendChild(status);
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.setAttribute('aria-disabled', 'true');
      }
      return;
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
      var originalLabel = submitButton.innerHTML;
      submitButton.innerHTML = 'Sending...';

      sessionStorage.setItem(formKey, 'true');

      fetch(form.action, {
        method: form.method || 'POST',
        body: new FormData(form),
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
        sessionStorage.removeItem(formKey);
        status.classList.add('is-visible', 'is-error');
        status.textContent = 'We could not send your message right now. Please try again in a moment.';
      }).finally(function() {
        submitButton.disabled = false;
        submitButton.removeAttribute('aria-disabled');
        submitButton.innerHTML = originalLabel;
      });
    });
  });
})();

  /* ---- 7. Animate hero on load ---- */
  (function initHeroAnimation() {
    var hero = document.querySelector('.hero');
    if (!hero) return;
    if (prefersReducedMotion) return;
    var items = hero.querySelectorAll('.eyebrow, h1, .hero-sub, .cta-group, .hero-cards, .hero-stats');
    items.forEach(function(item, i) {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      item.style.transition = 'opacity 600ms cubic-bezier(0.16,1,0.3,1), transform 600ms cubic-bezier(0.16,1,0.3,1)';
      setTimeout(function() {
        item.style.opacity = '';
        item.style.transform = '';
      }, 100 + i * 100);
    });
  })();

});
