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
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  }, { passive: true });

  /* --------------------------------------------------------------------------
     2. MOBILE MENU DRAWER
     -------------------------------------------------------------------------- */
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* --------------------------------------------------------------------------
     3. SMOOTH CURSOR GLOW FOLLOWER (GPU COMPOSITED & IDLE PAUSED)
     -------------------------------------------------------------------------- */
  const cursorGlow = document.querySelector('.cursor-glow');
  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
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
     4. 3D BENTO CARD TILT EFFECT (REQUESTANIMATIONFRAME THROTTLED)
     -------------------------------------------------------------------------- */
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
      displayUrl: 'aemiraza.github.io/Aura-Dental-Studio',
      badge: 'Luxury Healthcare'
    },
    estates: {
      title: 'Vanguard Luxury Estates — Cinematic Real Estate',
      url: 'https://aemiraza.github.io/Vanguard-Luxury-Estates/',
      displayUrl: 'aemiraza.github.io/Vanguard-Luxury-Estates',
      badge: 'Ultra-Luxury Real Estate'
    },
    plumbing: {
      title: 'HydroShield 24/7 — Emergency Plumbing Service',
      url: 'https://aemiraza.github.io/HydroShield-Emergency-Plumbing/',
      displayUrl: 'aemiraza.github.io/HydroShield-Emergency-Plumbing',
      badge: 'Emergency Services'
    },
    cleaning: {
      title: 'Sparkle & Shine — Modern Eco-Cleaning SaaS',
      url: 'https://aemiraza.github.io/Sparkle-Shine-Eco-Cleaning-Co/',
      displayUrl: 'aemiraza.github.io/Sparkle-Shine-Eco-Cleaning-Co',
      badge: 'Eco-Living SaaS'
    }
  };

  window.openProjectPreview = function (projectKey) {
    const data = demoProjects[projectKey];
    if (!data || !previewModal) return;

    previewTitle.textContent = data.title;
    previewUrlDisplay.textContent = data.displayUrl;
    previewExternalLink.href = data.url;
    previewIframe.src = data.url;

    // Default to desktop view
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

  // Device Toggle Buttons (Desktop, Tablet, Mobile)
  function setDeviceMode(mode) {
    deviceBtns.forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-mode') === mode);
    });

    if (viewportFrame) {
      viewportFrame.className = 'viewport-frame-wrapper';
      viewportFrame.classList.add(`mode-${mode}`);
    }
  }

  deviceBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-mode');
      setDeviceMode(mode);
    });
  });

  // Global ESC key listener
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProjectPreview();
      closeBookingModal();
    }
  });

  /* --------------------------------------------------------------------------
     8. STRATEGY CALL BOOKING MODAL & CALENDAR SLOTS
     -------------------------------------------------------------------------- */
  const bookingModal = document.getElementById('booking-modal');
  const bookingCloseBtn = document.getElementById('booking-close-btn');
  const timeSlotBtns = document.querySelectorAll('.time-slot-btn');

  window.openBookingModal = function () {
    if (!bookingModal) return;
    bookingModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  function closeBookingModal() {
    if (!bookingModal) return;
    bookingModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (bookingCloseBtn) {
    bookingCloseBtn.addEventListener('click', closeBookingModal);
  }

  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) {
        closeBookingModal();
      }
    });
  }

  timeSlotBtns.forEach((slot) => {
    slot.addEventListener('click', () => {
      timeSlotBtns.forEach((s) => s.classList.remove('active'));
      slot.classList.add('active');
    });
  });

  const confirmCallBtn = document.getElementById('confirm-call-btn');
  if (confirmCallBtn) {
    confirmCallBtn.addEventListener('click', () => {
      const activeSlot = document.querySelector('.time-slot-btn.active');
      const selectedTime = activeSlot ? activeSlot.innerText : 'Tomorrow 2:00 PM';
      const bookingEmailInput = document.getElementById('booking-email');
      const clientEmail = bookingEmailInput ? bookingEmailInput.value.trim() : '';

      confirmCallBtn.innerHTML = `<span>Booking Confirmed! 🚀</span>`;
      confirmCallBtn.style.background = '#10b981';

      // Dispatch booking notice to aemiansari76@gmail.com
      fetch('https://formsubmit.co/ajax/aemiansari76@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          type: 'Strategy Call Booking',
          slot: selectedTime,
          client_email: clientEmail || 'Not specified',
          _subject: `New Strategy Call Booked: ${selectedTime} (${clientEmail || 'Direct'})`
        })
      }).catch(() => {});

      showToast(`Strategy call locked for ${selectedTime}! Dispatched to aemiansari76@gmail.com`);

      setTimeout(() => {
        closeBookingModal();
        confirmCallBtn.innerHTML = `<span>Confirm Strategy Call &rarr;</span>`;
        confirmCallBtn.style.background = '';
      }, 1500);
    });
  }

  /* --------------------------------------------------------------------------
     9. INTERACTIVE LEAD CAPTURE FORM CONTROLLER (SENDS TO aemiansari76@gmail.com)
     -------------------------------------------------------------------------- */
  const leadForm = document.getElementById('lead-capture-form');
  const formSuccess = document.getElementById('form-success-overlay');
  const resetFormBtn = document.getElementById('reset-form-btn');

  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('lead-name');
      const emailInput = document.getElementById('lead-email');
      const websiteInput = document.getElementById('lead-website');
      const detailsInput = document.getElementById('lead-details');
      const selectedBudget = document.querySelector('input[name="project-budget"]:checked');
      const submitBtn = document.getElementById('lead-submit-btn');

      if (!nameInput.value.trim() || !emailInput.value.trim()) {
        showToast('Please fill in your name and email address.');
        return;
      }

      // Loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="loading-spinner"></span> <span>Dispatching to Razi...</span>`;

      const payload = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        website: websiteInput ? websiteInput.value.trim() : 'N/A',
        budget: selectedBudget ? selectedBudget.value : 'growth ($3,000 - $6,000)',
        message: detailsInput ? detailsInput.value.trim() : 'No extra notes',
        _subject: `New Lead Inquiry from ${nameInput.value.trim()} (${emailInput.value.trim()})`,
        _template: 'table'
      };

      // Dispatch to owner's Gmail: aemiansari76@gmail.com
      fetch('https://formsubmit.co/ajax/aemiansari76@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      .then((res) => res.json())
      .then(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>🚀 Launch Project Inquiry</span>`;
        if (formSuccess) formSuccess.classList.add('visible');
        showToast('Inquiry sent to aemiansari76@gmail.com! Razi will reply within 35 minutes.');
      })
      .catch(() => {
        // Fallback: direct mailto trigger so no lead is ever lost
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>🚀 Launch Project Inquiry</span>`;
        if (formSuccess) formSuccess.classList.add('visible');

        const mailSubject = encodeURIComponent(`Project Inquiry: ${payload.name}`);
        const mailBody = encodeURIComponent(
          `Name: ${payload.name}\nEmail: ${payload.email}\nWebsite: ${payload.website}\nBudget: ${payload.budget}\n\nProject Goals:\n${payload.message}`
        );
        window.open(`mailto:aemiansari76@gmail.com?subject=${mailSubject}&body=${mailBody}`, '_blank');
        showToast('Opening email client for aemiansari76@gmail.com...');
      });
    });
  }

  if (resetFormBtn && formSuccess && leadForm) {
    resetFormBtn.addEventListener('click', () => {
      formSuccess.classList.remove('visible');
      leadForm.reset();
    });
  }

  /* --------------------------------------------------------------------------
     10. TOAST NOTIFICATION UTILITY
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
    }, 3200);
  }

  window.showToast = showToast;

  /* --------------------------------------------------------------------------
     11. ONE-CLICK EMAIL COPY SHORTCUT (COPIES aemiansari76@gmail.com)
     -------------------------------------------------------------------------- */
  const copyEmailBtns = document.querySelectorAll('.copy-email-trigger');
  copyEmailBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'aemiansari76@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Copied aemiansari76@gmail.com to clipboard!');
      }).catch(() => {
        showToast('aemiansari76@gmail.com');
      });
    });
  });

  /* --------------------------------------------------------------------------
     12. REAL-TIME LOCAL TIME CLOCK IN FOOTER
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
