/**
 * RAZI WEB STUDIO — 2026 MAIN CONTROLLER & INTERACTION ENGINE
 * Hyper-Modern Micro-Interactions, 3D Tilt, Live Modals & Lead Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* --------------------------------------------------------------------------
     1. SCROLL DETECTION FOR STICKY HEADER
     -------------------------------------------------------------------------- */
  const siteHeader = document.getElementById('site-header');
  if (siteHeader) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  /* --------------------------------------------------------------------------
     2. MOBILE MENU DRAWER
     -------------------------------------------------------------------------- */
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* --------------------------------------------------------------------------
     3. SMOOTH CURSOR GLOW FOLLOWER (DESKTOP POINTER ONLY)
     -------------------------------------------------------------------------- */
  const cursorGlow = document.querySelector('.cursor-glow');
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (cursorGlow && hasFinePointer) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    let isMoving = false;

    function updateCursor() {
      const dx = mouseX - currentX;
      const dy = mouseY - currentY;
      currentX += dx * 0.15;
      currentY += dy * 0.15;
      cursorGlow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

      if (Math.abs(dx) > 0.4 || Math.abs(dy) > 0.4) {
        requestAnimationFrame(updateCursor);
      } else {
        isMoving = false;
      }
    }

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isMoving) {
        isMoving = true;
        requestAnimationFrame(updateCursor);
      }
    }, { passive: true });
  }

  /* --------------------------------------------------------------------------
     4. 3D BENTO CARD TILT EFFECT (DESKTOP HOVER POINTER ONLY)
     -------------------------------------------------------------------------- */
  if (hasFinePointer) {
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach((card) => {
      let tiltRaf = null;

      card.addEventListener('mousemove', (e) => {
        if (tiltRaf) return;
        const clientX = e.clientX;
        const clientY = e.clientY;

        tiltRaf = requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const x = clientX - rect.left;
          const y = clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const rotateX = ((y - centerY) / centerY) * -6;
          const rotateY = ((x - centerX) / centerX) * 6;

          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
          tiltRaf = null;
        });
      }, { passive: true });

      card.addEventListener('mouseleave', () => {
        if (tiltRaf) {
          cancelAnimationFrame(tiltRaf);
          tiltRaf = null;
        }
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }

  /* --------------------------------------------------------------------------
     5. SCROLL-TRIGGERED REVEAL OBSERVER
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal-init');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('revealed'));
  }

  /* --------------------------------------------------------------------------
     6. CORE SERVICES: AI FUNNEL SIMULATOR MINI-DEMO
     -------------------------------------------------------------------------- */
  const funnelTabs = document.querySelectorAll('.funnel-tab-btn');
  const funnelDisplay = document.getElementById('funnel-output-display');

  const funnelData = {
    clinic: `> [INCOMING TRAFFIC: COSMETIC DENTAL INQUIRY]\n> AI Step 1: Scans patient photo preference (Veneers vs Aligners)\n> AI Step 2: Pre-qualifies financing ($5k - $15k case value)\n> AI Step 3: Books 3D Virtual Consult directly to Dr.'s calendar\n> [RESULT: 72% booked rate within 90 seconds]`,
    estate: `> [INCOMING TRAFFIC: ULTRA-HNW REAL ESTATE INVESTOR]\n> AI Step 1: Identifies portfolio range ($5M - $25M)\n> AI Step 2: Unlocks Private Off-Market Penthouse Deck\n> AI Step 3: Routes encrypted VIP WhatsApp chat to Principal Broker\n> [RESULT: Direct concierge connection in 14 seconds]`,
    emergency: `> [INCOMING TRAFFIC: BURST PIPE RESIDENTIAL PANIC]\n> AI Step 1: Detects zip code & severity level in 1 tap\n> AI Step 2: Calculates nearest van dispatch ETA (14 min)\n> AI Step 3: Locks in emergency dispatch with guaranteed fixed arrival\n> [RESULT: Zero lost phone inquiries, 94% job win rate]`,
    cleaning: `> [INCOMING TRAFFIC: LUXURY HOME CLEANING LEAD]\n> AI Step 1: Dynamic slider estimates exact price for 2,400 sq ft\n> AI Step 2: Applies 15% recurring bi-weekly subscription coupon\n> AI Step 3: Secure card hold & instant cleaner team assignment\n> [RESULT: 38% conversion directly to recurring subscription]`
  };

  funnelTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      funnelTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const key = tab.getAttribute('data-target');
      if (funnelDisplay && funnelData[key]) {
        funnelDisplay.style.opacity = '0.4';
        setTimeout(() => {
          funnelDisplay.innerText = funnelData[key];
          funnelDisplay.style.opacity = '1';
        }, 150);
      }
    });
  });

  /* --------------------------------------------------------------------------
     7. LIVE PROJECT MODAL DRAWER WITH DEVICE VIEWPORT TOGGLES
     -------------------------------------------------------------------------- */
  const previewModal = document.getElementById('preview-modal');
  const previewIframe = document.getElementById('preview-iframe');
  const previewTitle = document.getElementById('preview-project-title');
  const previewUrlDisplay = document.getElementById('preview-url-display');
  const previewExternalLink = document.getElementById('preview-external-link');
  const viewportFrame = document.getElementById('viewport-frame');
  const deviceBtns = document.querySelectorAll('.device-btn');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  const demoProjects = {
    dental: {
      title: 'Aura Dental Studio — Luxury Minimalist Dental',
      url: 'https://aemiraza.github.io/Aura-Dental-Studio/',
      displayUrl: 'aemiraza.github.io/Aura-Dental-Studio'
    },
    estates: {
      title: 'Vanguard Luxury Estates — Cinematic Real Estate',
      url: 'https://aemiraza.github.io/Vanguard-Luxury-Estates/',
      displayUrl: 'aemiraza.github.io/Vanguard-Luxury-Estates'
    },
    plumbing: {
      title: 'HydroShield 24/7 — Emergency Plumbing Service',
      url: 'https://aemiraza.github.io/HydroShield-Emergency-Plumbing/',
      displayUrl: 'aemiraza.github.io/HydroShield-Emergency-Plumbing'
    },
    cleaning: {
      title: 'Sparkle & Shine — Modern Eco-Cleaning SaaS',
      url: 'https://aemiraza.github.io/Sparkle-Shine-Eco-Cleaning-Co/',
      displayUrl: 'aemiraza.github.io/Sparkle-Shine-Eco-Cleaning-Co'
    }
  };

  function setDeviceMode(mode) {
    deviceBtns.forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-mode') === mode);
    });

    if (viewportFrame) {
      viewportFrame.className = 'viewport-frame-wrapper';
      viewportFrame.classList.add(`mode-${mode}`);
    }
  }

  window.openProjectPreview = function (projectKey) {
    const data = demoProjects[projectKey];
    if (!data || !previewModal) return;

    previewTitle.textContent = data.title;
    previewUrlDisplay.textContent = data.displayUrl;
    previewExternalLink.href = data.url;
    previewIframe.src = data.url;

    setDeviceMode('desktop');
    previewModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  function closeProjectPreview() {
    if (!previewModal) return;
    previewModal.classList.remove('open');
    previewIframe.src = 'about:blank';
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectPreview);
  }

  if (previewModal) {
    previewModal.addEventListener('click', (e) => {
      if (e.target === previewModal) {
        closeProjectPreview();
      }
    });
  }

  deviceBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-mode');
      setDeviceMode(mode);
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProjectPreview();
    }
  });

  /* --------------------------------------------------------------------------
     8. LEAD CAPTURE FORM VALIDATION, SPINNER & SUBMISSION CONTROLLER
     -------------------------------------------------------------------------- */
  const leadForm = document.getElementById('lead-capture-form');
  const successBanner = document.getElementById('form-success-banner');
  const errorBanner = document.getElementById('form-error-banner');
  const errorSummary = document.getElementById('form-error-summary');
  const submitBtn = document.getElementById('lead-submit-btn');

  if (leadForm && submitBtn) {
    const nameInput = document.getElementById('lead-name');
    const businessInput = document.getElementById('lead-business');
    const emailInput = document.getElementById('lead-email');
    const budgetSelect = document.getElementById('lead-budget');
    const detailsInput = document.getElementById('lead-details');

    const fields = [
      {
        el: nameInput,
        label: 'Name',
        validate: (val) => val.trim().length > 0
      },
      {
        el: businessInput,
        label: 'Business Name',
        validate: (val) => val.trim().length > 0
      },
      {
        el: emailInput,
        label: 'Email',
        validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val.trim())
      },
      {
        el: budgetSelect,
        label: 'Project Budget',
        validate: (val) => val.trim().length > 0
      },
      {
        el: detailsInput,
        label: 'Message',
        validate: (val) => val.trim().length > 0
      }
    ];

    function setFieldError(fieldEl, hasError) {
      if (!fieldEl) return;
      const group = fieldEl.closest('.form-group');
      if (group) {
        group.classList.toggle('has-error', hasError);
      }
      fieldEl.setAttribute('aria-invalid', String(hasError));
    }

    fields.forEach(({ el }) => {
      if (!el) return;
      const eventName = el.tagName === 'SELECT' ? 'change' : 'input';
      el.addEventListener(eventName, () => {
        setFieldError(el, false);
        if (errorBanner && !leadForm.querySelector('.form-group.has-error')) {
          errorBanner.hidden = true;
        }
      });
    });

    leadForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (successBanner) successBanner.hidden = true;

      const invalidFields = [];
      fields.forEach((field) => {
        if (!field.el) return;
        const isValid = field.validate(field.el.value);
        setFieldError(field.el, !isValid);
        if (!isValid) {
          invalidFields.push(field);
        }
      });

      if (invalidFields.length > 0) {
        if (errorBanner && errorSummary) {
          const names = invalidFields.map((f) => f.label).join(', ');
          errorSummary.textContent = `Missing or invalid: ${names}.`;
          errorBanner.hidden = false;
        }
        invalidFields[0].el.focus();
        return;
      }

      if (errorBanner) errorBanner.hidden = true;

      // Loading state with visible ring spinner
      const originalBtnMarkup = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="loading-spinner" aria-hidden="true"></span><span>Sending Inquiry...</span>`;

      const payload = {
        name: nameInput.value.trim(),
        business_name: businessInput.value.trim(),
        email: emailInput.value.trim(),
        budget: budgetSelect.value,
        message: detailsInput.value.trim(),
        _subject: `New Project Inquiry from ${nameInput.value.trim()} — ${businessInput.value.trim()}`,
        _template: 'table'
      };

      const rawAction = (leadForm.getAttribute('action') || '').trim();
      const hasCustomFormspree =
        rawAction.startsWith('https://') && !rawAction.includes('YOUR_FORM_ID');

      const endpoint = hasCustomFormspree
        ? rawAction
        : 'https://formsubmit.co/ajax/aemiansari76@gmail.com';

      const minSpinnerWait = new Promise((resolve) => setTimeout(resolve, 650));
      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timeoutId = controller ? setTimeout(() => controller.abort(), 3500) : null;

      try {
        const request = fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload),
          signal: controller ? controller.signal : undefined
        })
          .catch(() => null)
          .finally(() => {
            if (timeoutId) clearTimeout(timeoutId);
          });

        await Promise.all([request, minSpinnerWait]);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnMarkup;
      }

      leadForm.reset();
      if (successBanner) {
        successBanner.hidden = false;
        successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      showToast('Message received — Razi will get back to you within 24 hours');
    });
  }

  /* --------------------------------------------------------------------------
     9. TOAST NOTIFICATION UTILITY
     -------------------------------------------------------------------------- */
  function showToast(message) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3400);
  }

  window.showToast = showToast;

  /* --------------------------------------------------------------------------
     10. ONE-CLICK EMAIL COPY SHORTCUT (COPIES aemiansari76@gmail.com)
     -------------------------------------------------------------------------- */
  const copyEmailBtns = document.querySelectorAll('.copy-email-trigger');
  copyEmailBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'aemiansari76@gmail.com';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(() => {
          showToast('Copied aemiansari76@gmail.com to clipboard!');
        }).catch(() => {
          showToast(email);
        });
      } else {
        showToast(email);
      }
    });
  });

  /* --------------------------------------------------------------------------
     11. REAL-TIME LOCAL TIME CLOCK IN FOOTER
     -------------------------------------------------------------------------- */
  function updateLocalClock() {
    const timeDisplay = document.getElementById('live-local-time');
    if (timeDisplay) {
      const now = new Date();
      const options = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      const formatted = new Intl.DateTimeFormat('en-US', options).format(now);
      timeDisplay.textContent = `${formatted} • Worldwide Delivery`;
    }
  }

  setInterval(updateLocalClock, 1000);
  updateLocalClock();
});
