/**
 * RAZI WEB STUDIO — 2026 HIGH-PERFORMANCE 3D CANVAS & AMBIENT VISUAL SYSTEMS
 * Fully Optimized for 60-120 FPS & Touch-Friendly Mobile Scaling:
 * - IntersectionObserver auto-pause when out of view
 * - Zero context shadowBlur overhead
 * - DPR-safe explicit matrix reset via setTransform
 * - Touch-scroll friendly hero 3D mesh (never blocks vertical page scroll)
 * - Tab visibility auto-sleep
 */

(function () {
  'use strict';

  let isPageVisible = !document.hidden;
  document.addEventListener('visibilitychange', () => {
    isPageVisible = !document.hidden;
  });

  /* --------------------------------------------------------------------------
     1. AMBIENT BACKGROUND NEURAL PARTICLES (LIGHTWEIGHT & OPTIMIZED)
     -------------------------------------------------------------------------- */
  const bgCanvas = document.getElementById('ambient-canvas');
  if (bgCanvas) {
    const ctx = bgCanvas.getContext('2d', { alpha: true });
    let width = window.innerWidth;
    let height = window.innerHeight;
    let isMobile = window.innerWidth < 768;
    let particles = [];
    let mouse = { x: -1000, y: -1000 };

    function getTargetParticleCount() {
      return isMobile ? 16 : 34;
    }

    function resizeBg() {
      isMobile = window.innerWidth < 768;
      width = bgCanvas.width = window.innerWidth;
      height = bgCanvas.height = window.innerHeight;
    }

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * (width || window.innerWidth);
        this.y = Math.random() * (height || window.innerHeight);
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.radius = Math.random() * 1.8 + 0.8;
        this.color = Math.random() > 0.5 ? 'rgba(168, 85, 247, ' : 'rgba(0, 240, 255, ';
        this.alpha = Math.random() * 0.4 + 0.2;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        if (!isMobile) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          if (Math.abs(dx) < 120 && Math.abs(dy) < 120) {
            const distSq = dx * dx + dy * dy;
            if (distSq < 14400 && distSq > 0.01) {
              const dist = Math.sqrt(distSq);
              this.x -= (dx / dist) * 1.1;
              this.y -= (dy / dist) * 1.1;
            }
          }
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.alpha + ')';
        ctx.fill();
      }
    }

    function syncParticleCount() {
      const target = getTargetParticleCount();
      while (particles.length < target) particles.push(new Particle());
      if (particles.length > target) particles.length = target;
    }

    function initBg() {
      resizeBg();
      particles = [];
      syncParticleCount();
    }

    const maxDist = 120;
    const maxDistSq = maxDist * maxDist;

    function animateBg() {
      if (!isPageVisible) {
        requestAnimationFrame(animateBg);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      if (!isMobile) {
        for (let i = 0; i < particles.length; i++) {
          const p1 = particles[i];
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            if (Math.abs(dx) > maxDist) continue;
            const dy = p1.y - p2.y;
            if (Math.abs(dy) > maxDist) continue;

            const distSq = dx * dx + dy * dy;
            if (distSq < maxDistSq) {
              const alpha = (1 - Math.sqrt(distSq) / maxDist) * 0.14;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
              ctx.lineWidth = 0.75;
              ctx.stroke();
            }
          }
        }
      }

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }

      requestAnimationFrame(animateBg);
    }

    let bgResizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(bgResizeTimer);
      bgResizeTimer = setTimeout(() => {
        resizeBg();
        syncParticleCount();
      }, 150);
    }, { passive: true });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });

    initBg();
    requestAnimationFrame(animateBg);
  }

  /* --------------------------------------------------------------------------
     2. HERO INTERACTIVE HOLOGRAPHIC 3D SPHERE (RESPONSIVE & TOUCH-SCROLL SAFE)
     -------------------------------------------------------------------------- */
  const heroCanvas = document.getElementById('hero-interactive-canvas');
  if (heroCanvas) {
    const ctx = heroCanvas.getContext('2d', { alpha: true });
    let size = 320;
    let cx = 160;
    let cy = 160;
    let sphereRadius = 102;
    let points = [];
    const rings = 12;
    const pointsPerRing = 18;
    let heroAnimId = null;
    let isHeroVisible = true;

    // Rotation state
    let rotX = 0.35;
    let rotY = 0.45;
    let rotZ = 0.1;
    let velX = 0.003;
    let velY = 0.006;
    let isDragging = false;
    let isTouchScrolling = false;
    let touchStartX = 0;
    let touchStartY = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;

    function resizeHero() {
      const stageEl = heroCanvas.parentElement;
      const stageRect = stageEl ? stageEl.getBoundingClientRect() : heroCanvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const viewportCap = Math.max(200, window.innerWidth - 36);
      const rawWidth = stageRect.width > 0 ? stageRect.width : Math.min(360, viewportCap);
      size = Math.round(Math.max(200, Math.min(rawWidth, viewportCap, 480)));

      heroCanvas.width = Math.round(size * dpr);
      heroCanvas.height = Math.round(size * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cx = size / 2;
      cy = size / 2;
      sphereRadius = size * 0.32;
    }

    function initPoints() {
      points = [];
      for (let i = 0; i < rings; i++) {
        const phi = Math.acos(-1 + (2 * i) / rings);
        for (let j = 0; j < pointsPerRing; j++) {
          const theta = (2 * Math.PI * j) / pointsPerRing;
          const x = sphereRadius * Math.sin(phi) * Math.cos(theta);
          const y = sphereRadius * Math.sin(phi) * Math.sin(theta);
          const z = sphereRadius * Math.cos(phi);
          const isCyan = (i + j) % 3 === 0;
          points.push({ x, y, z, isCyan });
        }
      }
    }

    function rotatePoint(p, rx, ry, rz) {
      const cosY = Math.cos(ry), sinY = Math.sin(ry);
      const cosX = Math.cos(rx), sinX = Math.sin(rx);
      const cosZ = Math.cos(rz), sinZ = Math.sin(rz);

      const x1 = p.x * cosY + p.z * sinY;
      const z1 = -p.x * sinY + p.z * cosY;

      const y2 = p.y * cosX - z1 * sinX;
      const z2 = p.y * sinX + z1 * cosX;

      const x3 = x1 * cosZ - y2 * sinZ;
      const y3 = x1 * sinZ + y2 * cosZ;

      return { x: x3, y: y3, z: z2 };
    }

    let time = 0;

    function renderSphere() {
      if (!isHeroVisible || !isPageVisible) {
        heroAnimId = null;
        return;
      }

      ctx.clearRect(0, 0, size, size);
      time += 0.02;

      if (!isDragging) {
        rotX += velX;
        rotY += velY;
        velX *= 0.98;
        velY *= 0.98;
        if (Math.abs(velX) < 0.002) velX = 0.003;
        if (Math.abs(velY) < 0.003) velY = 0.006;
      }

      // Central core scaled proportionally with sphereRadius
      const pulseScale = Math.max(0.65, size / 380);
      const corePulse = (Math.sin(time * 2) * 7 + 22) * pulseScale;
      const coreGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, corePulse * 1.8);
      coreGrad.addColorStop(0, 'rgba(0, 240, 255, 0.85)');
      coreGrad.addColorStop(0.45, 'rgba(168, 85, 247, 0.4)');
      coreGrad.addColorStop(1, 'rgba(14, 14, 22, 0)');

      ctx.beginPath();
      ctx.arc(cx, cy, corePulse * 1.8, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      // Project 3D points
      const fov = Math.max(300, size * 1.15);
      const transformed = new Array(points.length);
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const rotated = rotatePoint(p, rotX, rotY, rotZ);
        const scale = fov / (fov + rotated.z);
        transformed[i] = {
          projX: cx + rotated.x * scale,
          projY: cy + rotated.y * scale,
          z: rotated.z,
          scale,
          isCyan: p.isCyan
        };
      }

      // Connect rings
      for (let i = 0; i < rings; i++) {
        ctx.beginPath();
        for (let j = 0; j < pointsPerRing; j++) {
          const idx = i * pointsPerRing + j;
          const nextIdx = i * pointsPerRing + ((j + 1) % pointsPerRing);
          const p1 = transformed[idx];
          const p2 = transformed[nextIdx];

          if (p1 && p2) {
            const alpha = Math.max(0.08, (p1.z + sphereRadius) / (sphereRadius * 2.2));
            ctx.strokeStyle = i % 2 === 0
              ? `rgba(168, 85, 247, ${alpha * 0.4})`
              : `rgba(0, 240, 255, ${alpha * 0.35})`;
            ctx.lineWidth = 0.85;
            ctx.moveTo(p1.projX, p1.projY);
            ctx.lineTo(p2.projX, p2.projY);
          }
        }
        ctx.stroke();
      }

      // Node points
      for (let i = 0; i < transformed.length; i++) {
        const p = transformed[i];
        const alpha = Math.max(0.12, (p.z + sphereRadius) / (sphereRadius * 2));
        const nodeRadius = (p.isCyan ? 2.4 : 1.8) * p.scale;

        if (p.z > sphereRadius * 0.3) {
          ctx.beginPath();
          ctx.arc(p.projX, p.projY, nodeRadius * 2, 0, Math.PI * 2);
          ctx.fillStyle = p.isCyan ? 'rgba(0, 240, 255, 0.15)' : 'rgba(168, 85, 247, 0.15)';
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(p.projX, p.projY, nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = p.isCyan
          ? `rgba(0, 240, 255, ${alpha * 0.95})`
          : `rgba(168, 85, 247, ${alpha * 0.9})`;
        ctx.fill();
      }

      // Orbiting decorative ring
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotY * 0.6);
      ctx.scale(1, 0.28);
      ctx.beginPath();
      ctx.arc(0, 0, sphereRadius * 1.32, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([8, 12]);
      ctx.stroke();
      ctx.restore();

      heroAnimId = requestAnimationFrame(renderSphere);
    }

    // Auto-pause when offscreen
    if ('IntersectionObserver' in window) {
      const heroObserver = new IntersectionObserver((entries) => {
        isHeroVisible = entries[0].isIntersecting;
        if (isHeroVisible && !heroAnimId) {
          heroAnimId = requestAnimationFrame(renderSphere);
        }
      }, { threshold: 0.05 });
      heroObserver.observe(heroCanvas);
    }

    // Desktop mouse drag
    heroCanvas.addEventListener('mousedown', (e) => {
      isDragging = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging || isTouchScrolling) return;
      const dx = e.clientX - lastMouseX;
      const dy = e.clientY - lastMouseY;
      rotY += dx * 0.008;
      rotX += dy * 0.008;
      velY = dx * 0.004;
      velX = dy * 0.004;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    }, { passive: true });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Mobile touch drag: yield immediately to vertical page scrolling
    heroCanvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        isTouchScrolling = false;
        touchStartX = lastMouseX = e.touches[0].clientX;
        touchStartY = lastMouseY = e.touches[0].clientY;
      }
    }, { passive: true });

    heroCanvas.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const curX = e.touches[0].clientX;
      const curY = e.touches[0].clientY;

      if (!isTouchScrolling) {
        const totalDx = Math.abs(curX - touchStartX);
        const totalDy = Math.abs(curY - touchStartY);
        if (totalDy > 8 && totalDy > totalDx * 1.2) {
          isTouchScrolling = true;
          isDragging = false;
          return;
        }
      }

      const dx = curX - lastMouseX;
      rotY += dx * 0.009;
      velY = dx * 0.004;
      lastMouseX = curX;
      lastMouseY = curY;
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
      isTouchScrolling = false;
    }, { passive: true });

    let heroResizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(heroResizeTimer);
      heroResizeTimer = setTimeout(() => {
        resizeHero();
        initPoints();
      }, 100);
    }, { passive: true });

    resizeHero();
    initPoints();
    heroAnimId = requestAnimationFrame(renderSphere);
  }
})();
