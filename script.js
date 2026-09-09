/* ==========================================================================
   Apology Letter — interaction script
   Organized into small, independent sections. Nothing here needs to
   change if you only want to edit the letter text (that's in index.html)
   or the colors (that's in style.css).
   ========================================================================== */

(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     1. BACKGROUND PARTICLES
     Purely decorative. Skipped entirely for reduced-motion users
     (also hidden via CSS as a second safety net).
     ------------------------------------------------------------------ */
  function createParticles() {
    if (prefersReducedMotion) return;

    const host = document.getElementById('particles');
    if (!host) return;

    const COUNT = 16;
    const frag = document.createDocumentFragment();

    for (let i = 0; i < COUNT; i++) {
      const p = document.createElement('span');
      p.className = 'particle';
      p.style.left = `${Math.random() * 100}%`;
      p.style.animationDuration = `${14 + Math.random() * 14}s`;
      p.style.animationDelay = `${Math.random() * 18}s`;
      p.style.width = p.style.height = `${2 + Math.random() * 3}px`;
      frag.appendChild(p);
    }
    host.appendChild(frag);
  }

  /* ------------------------------------------------------------------
     2. AUDIO
     EDIT ME — to add your own music/sound effects, drop files into
     /assets and uncomment the matching <source> tag in index.html.
     If no source is present, playback quietly no-ops.
     ------------------------------------------------------------------ */
  const bgMusic  = document.getElementById('bgMusic');
  const sfxOpen  = document.getElementById('sfxOpen');
  const sfxClick = document.getElementById('sfxClick');

  function hasSource(audioEl) {
    return !!(audioEl && audioEl.querySelector('source'));
  }

  function playSfx(audioEl) {
    if (!hasSource(audioEl)) return;
    try {
      audioEl.currentTime = 0;
      audioEl.volume = 0.5;
      audioEl.play().catch(() => {});
    } catch (e) { /* fail silently — sound is optional */ }
  }

  const musicToggle = document.getElementById('musicToggle');

  musicToggle.addEventListener('click', () => {
    if (!hasSource(bgMusic)) {
      // No music file configured yet — gently acknowledge the click
      // without pretending anything played.
      musicToggle.classList.remove('is-disabled');
      void musicToggle.offsetWidth; // restart animation on repeat clicks
      musicToggle.classList.add('is-disabled');
      return;
    }

    const isPlaying = musicToggle.getAttribute('aria-pressed') === 'true';

    if (isPlaying) {
      bgMusic.pause();
      musicToggle.setAttribute('aria-pressed', 'false');
      musicToggle.setAttribute('aria-label', 'Play background music');
    } else {
      bgMusic.volume = 0.35;
      bgMusic.play().catch(() => {});
      musicToggle.setAttribute('aria-pressed', 'true');
      musicToggle.setAttribute('aria-label', 'Pause background music');
    }
  });

  /* ------------------------------------------------------------------
     3. ENVELOPE → LETTER TRANSITION
     ------------------------------------------------------------------ */
  const envelopeScene = document.getElementById('envelopeScene');
  const envelope      = document.getElementById('envelope');
  const letterScene   = document.getElementById('letterScene');
  const letter        = document.getElementById('letter');

  let hasOpened = false;

  // Timings mirror the CSS transition durations; both are shortened
  // together when the user prefers reduced motion.
  const T = prefersReducedMotion
    ? { flapOpen: 50, sceneFade: 50, letterReveal: 50 }
    : { flapOpen: 900, sceneFade: 700, letterReveal: 500 };

  function openEnvelope() {
    if (hasOpened) return;
    hasOpened = true;

    playSfx(sfxOpen);
    envelope.classList.add('is-open');
    envelope.setAttribute('aria-label', 'Letter opening');

    // Let the flap/paper animation play, then lift the whole
    // envelope away and cross-fade into the letter scene.
    window.setTimeout(() => {
      envelope.classList.add('is-leaving');
      envelopeScene.classList.add('is-fading');

      window.setTimeout(() => {
        envelopeScene.style.display = 'none';
        letterScene.classList.add('is-visible');
        letterScene.setAttribute('aria-hidden', 'false');

        // trigger the letter card's own reveal animation
        requestAnimationFrame(() => {
          letter.classList.add('is-revealed');
        });

        window.scrollTo({ top: 0, behavior: 'auto' });
        initScrollReveal();
        updateProgress();
      }, T.sceneFade);
    }, T.flapOpen);
  }

  envelope.addEventListener('click', openEnvelope);

  /* ------------------------------------------------------------------
     4. SCROLL REVEAL for letter paragraphs
     ------------------------------------------------------------------ */
  let revealObserver = null;

  function initScrollReveal() {
    if (revealObserver) return; // only set up once

    const targets = letter.querySelectorAll(
      '.letter__p, .letter__signoff, .letter__final'
    );

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      targets.forEach(el => el.classList.add('is-in-view'));
      return;
    }

    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35, rootMargin: '0px 0px -10% 0px' });

    targets.forEach(el => revealObserver.observe(el));
  }

  /* ------------------------------------------------------------------
     5. READING PROGRESS INDICATOR
     ------------------------------------------------------------------ */
  const progressFill  = document.getElementById('progressFill');
  const progressLabel = document.getElementById('progressLabel');

  function updateProgress() {
    if (!letterScene.classList.contains('is-visible')) return;

    const scrollTop    = window.scrollY;
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const pct          = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;

    progressFill.style.width = `${pct}%`;
    progressLabel.textContent = `Reading my letter \u00B7 ${Math.round(pct)}%`;
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);

  /* ------------------------------------------------------------------
     6. CLOSE LETTER
     Returns quietly to the envelope scene. No prompts, no pressure —
     just resets the experience in case she wants to re-read it later.
     ------------------------------------------------------------------ */
  const closeBtn = document.getElementById('closeLetter');

  closeBtn.addEventListener('click', () => {
    playSfx(sfxClick);

    letterScene.classList.remove('is-visible');
    letterScene.setAttribute('aria-hidden', 'true');

    envelopeScene.style.display = 'flex';
    // Force reflow so the fade-in transition plays
    void envelopeScene.offsetWidth;
    envelopeScene.classList.remove('is-fading');
  });

  /* ------------------------------------------------------------------
     INIT
     ------------------------------------------------------------------ */
  createParticles();
})();
