(function() {
    'use strict';

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        initCursor();
        initStarfield();
        initDecor();
        initScrollReveals();
        initPageTransitions();
        initParallax();
    }

    /* ---------------------------------------------------------
       STARFIELD — procedural stars with scroll parallax
    --------------------------------------------------------- */
    function initStarfield() {
        const container = document.createElement('div');
        container.className = 'starfield';
        document.body.prepend(container);

        const LAYERS = [
            { count: 80, sizeMin: 0.5, sizeMax: 1.2, opacity: 0.4, speed: 0.02 },
            { count: 50, sizeMin: 1, sizeMax: 2, opacity: 0.6, speed: 0.05 },
            { count: 20, sizeMin: 1.5, sizeMax: 3, opacity: 0.8, speed: 0.1 },
        ];

        const layerEls = [];

        LAYERS.forEach((cfg, i) => {
            const layer = document.createElement('div');
            layer.className = 'star-layer';
            layer.dataset.speed = cfg.speed;

            for (let j = 0; j < cfg.count; j++) {
                const star = document.createElement('div');
                star.className = 'star';
                const size = cfg.sizeMin + Math.random() * (cfg.sizeMax - cfg.sizeMin);
                const x = Math.random() * 100;
                const y = Math.random() * 100;
                star.style.cssText = `
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}%;
                    top: ${y}%;
                    opacity: ${cfg.opacity * (0.5 + Math.random() * 0.5)};
                `;
                if (size > 1.8) {
                    star.style.boxShadow = `0 0 ${size * 2}px rgba(255,255,255,0.3)`;
                }
                layer.appendChild(star);
            }

            container.appendChild(layer);
            layerEls.push(layer);
        });

        // Parallax on scroll
        const scrollTarget = document.querySelector('.snap-container') || window;
        const getScrollY = () => {
            if (scrollTarget === window) return window.scrollY;
            return scrollTarget.scrollTop;
        };

        function updateStars() {
            const scrollY = getScrollY();
            layerEls.forEach(layer => {
                const speed = parseFloat(layer.dataset.speed);
                layer.style.transform = `translateY(${scrollY * speed * -1}px)`;
            });
            requestAnimationFrame(updateStars);
        }
        requestAnimationFrame(updateStars);

        // Also add subtle twinkle to a few stars
        const allStars = container.querySelectorAll('.star');
        const twinkleCount = Math.min(15, allStars.length);
        for (let i = 0; i < twinkleCount; i++) {
            const star = allStars[Math.floor(Math.random() * allStars.length)];
            star.style.animation = `twinkle ${2 + Math.random() * 3}s ease-in-out infinite ${Math.random() * 3}s`;
        }
    }

    /* ---------------------------------------------------------
       SPACE DECOR — drifting planets + clickable rockets
       Mirrors the starfield pattern: a fixed .spacedecor layer
       (z-index 0, behind content) with procedurally placed sprites.
       Excluded on the 3D pages (voo360/* and any model-viewer page).
    --------------------------------------------------------- */
    function initDecor() {
        // Skip the 3D pages. Path check is primary because voo360_2.html
        // has no <model-viewer>; the element check covers modelos_3d/*.
        if (location.pathname.includes('/voo360/')) return;
        if (document.querySelector('model-viewer')) return;

        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const small  = window.innerWidth < 768 || (navigator.deviceMemory || 8) <= 4;

        const layer = document.createElement('div');
        layer.className = 'spacedecor';
        layer.setAttribute('aria-hidden', 'true');
        document.body.prepend(layer);

        const rand = (min, max) => min + Math.random() * (max - min);

        /* =====================================================
           ORBITING SOLAR SYSTEM (full-viewport, centered on the sun)
           Pure-CSS revolve: each .orbit is a concentric ring that
           rotates around the system centre; a .decor-planet pinned to
           its top edge therefore revolves around the sun. The planet
           counter-rotates (same period/phase) so it stays upright and
           its moons/ring orbit sanely.
           Structure (transform-collision safe — one transform/element):
             .solar-system        -> centred anchor (no animation)
               .sun               -> glowing core
               .orbit             -> revolve rotate  (--r,--period,--phase)
                 .decor-planet    -> counter-spin rotate (keeps upright)
                   .planet-body   -> gradient sphere (no transform)
                   .planet-ring   -> Saturn ring (static tilt)
                   .moon-orbit    -> own rotate; .moon child (opacity cue)
           Sizes/radii are in vmin so the whole system scales with the
           viewport — no JS resize listener needed.
        ===================================================== */
        const PLANETS = [
            { name: 'mercury', size: 1.7, r: 9,  period: 14,  moons: 0, ring: false },
            { name: 'venus',   size: 2.4, r: 13, period: 20,  moons: 0, ring: false },
            { name: 'earth',   size: 2.6, r: 17, period: 26,  moons: 1, ring: false },
            { name: 'mars',    size: 2.0, r: 21, period: 34,  moons: 0, ring: false },
            { name: 'jupiter', size: 5.6, r: 30, period: 52,  moons: 2, ring: false },
            { name: 'saturn',  size: 4.9, r: 38, period: 70,  moons: 1, ring: true  },
            { name: 'uranus',  size: 3.6, r: 44, period: 90,  moons: 0, ring: false },
            { name: 'neptune', size: 3.5, r: 49, period: 110, moons: 1, ring: false },
        ];

        const sys = document.createElement('div');
        sys.className = 'solar-system';

        const sun = document.createElement('div');
        sun.className = 'sun';
        sys.appendChild(sun);

        PLANETS.forEach((p) => {
            const orbit = document.createElement('div');
            orbit.className = 'orbit';
            // --r/--period/--phase inherit down to the planet (custom props
            // cascade), so the planet's counter-spin stays in sync for free.
            orbit.style.cssText =
                '--r:' + p.r + 'vmin;' +
                '--period:' + p.period + 's;' +
                '--phase:-' + rand(0, p.period).toFixed(1) + 's;';

            const planet = document.createElement('div');
            planet.className = 'decor-planet planet--' + p.name;
            planet.style.cssText = '--psize:' + p.size + 'vmin;';

            const body = document.createElement('div');
            body.className = 'planet-body';
            planet.appendChild(body);

            // Saturn ring (static child; skip on small to save nodes).
            if (p.ring && !small) {
                const ring = document.createElement('div');
                ring.className = 'planet-ring';
                planet.appendChild(ring);
            }

            // Orbiting moons (desktop only — keeps the mobile node budget low).
            if (!small) {
                for (let m = 0; m < p.moons; m++) {
                    const morbit = document.createElement('div');
                    morbit.className = 'moon-orbit'
                        + (p.name === 'earth' ? '' : ' moon-orbit--small')
                        + (m % 2 === 1 ? ' reverse' : '');
                    const gap = 0.40 + m * 0.16;            // orbit inset fraction
                    const dur = rand(7, 12) + m * 2;        // seconds
                    morbit.style.setProperty('--orbit', gap.toFixed(2));
                    morbit.style.animationDuration = dur.toFixed(1) + 's';
                    morbit.style.animationDelay = '-' + rand(0, dur).toFixed(1) + 's';

                    const moon = document.createElement('div');
                    moon.className = 'moon';
                    if ((p.name === 'jupiter' || p.name === 'saturn') && m === 1) {
                        moon.classList.add('accent');
                    }
                    moon.style.animationDuration = dur.toFixed(1) + 's';
                    moon.style.animationDelay = morbit.style.animationDelay;

                    morbit.appendChild(moon);
                    planet.appendChild(morbit);
                }
            }

            orbit.appendChild(planet);
            sys.appendChild(orbit);
        });

        layer.appendChild(sys);

        /* =====================================================
           ROCKETS — constant cross-viewport flight + click boost
           Structure (transform-collision safe):
             .decor-rocket  -> wrapper: cross-screen travel transform
               .rocket-craft-> bob/sway transform
                 svg        -> static nose rotation (--nose), no anim
                   .rocket-flame / .rocket-trail -> opacity/scaleY only
        ===================================================== */
        const rocketCount = small ? 1 : 2;
        const rockets = [];

        const ROCKET_SVG =
            '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
            '<path class="rocket-trail" d="M11 19h2l-.6 4h-.8z" fill="var(--accent, #00a84f)" opacity="0.2"/>' +
            '<path d="M12 1.4c3.2 2.4 4.9 6 4.9 10.3 0 2.1-.5 4-1.3 5.6H8.4C7.6 15.7 7.1 13.8 7.1 11.7 7.1 7.4 8.8 3.8 12 1.4z" fill="#f0ede8"/>' +
            '<circle cx="12" cy="9.1" r="2" fill="var(--accent, #00a84f)"/>' +
            '<path d="M8.4 14.4 5.3 18.1c-.3.4 0 .9.5.8l3-.7zM15.6 14.4l3.1 3.7c.3.4 0 .9-.5.8l-3-.7z" fill="var(--accent, #00a84f)"/>' +
            '<path class="rocket-flame" d="M10.2 18h3.6c-.3 2-1.1 3.4-1.8 4.4-.7-1-1.5-2.4-1.8-4.4z" fill="#ffb547"/>' +
            '</svg>';

        for (let i = 0; i < rocketCount; i++) {
            // Randomized lane that fully crosses the viewport.
            const leftToRight = Math.random() < 0.5;
            const xFrom = leftToRight ? -14 : 114;   // start just off one edge (vw)
            const xTo   = leftToRight ? 114 : -14;   // exit opposite edge (vw)
            const yFrom = rand(12, 82);              // entry height (vh)
            const yTo   = yFrom + rand(-30, 30);     // gentle vertical drift (vh)

            // Nose angle: SVG points up, so rotate by atan2(dy,dx)+90deg
            // using viewport pixel deltas so the nose matches real travel.
            const dx = (xTo - xFrom) / 100 * window.innerWidth;
            const dy = (yTo - yFrom) / 100 * window.innerHeight;
            const nose = Math.round(Math.atan2(dy, dx) * 180 / Math.PI + 90);

            const rocket = document.createElement('div'); // travel layer
            rocket.className = 'decor-rocket';
            rocket.style.cssText =
                '--tx-from:' + xFrom + 'vw;--ty-from:' + yFrom.toFixed(1) + 'vh;' +
                '--tx-to:' + xTo + 'vw;--ty-to:' + yTo.toFixed(1) + 'vh;' +
                '--dur:' + rand(20, 34).toFixed(1) + 's;' +
                '--nose:' + nose + 'deg;' +
                'animation-delay:-' + rand(0, 30).toFixed(1) + 's;';

            const craft = document.createElement('div'); // bob/sway layer
            craft.className = 'rocket-craft';
            craft.style.animationDelay = '-' + rand(0, 3).toFixed(2) + 's'; // desync bob
            craft.innerHTML = ROCKET_SVG;                 // svg: static nose rotation

            rocket.appendChild(craft);
            layer.appendChild(rocket);
            rockets.push(rocket);
        }

        // Interactivity is gated behind reduced-motion (calm static scene otherwise).
        // Planets/moons/rings are non-interactive and need no gating; the global
        // reduced-motion rule freezes their keyframes for free.
        if (reduce) return;

        // Click / tap = speed BOOST on top of constant flight (touch-friendly).
        rockets.forEach(rocket => {
            rocket.style.pointerEvents = 'auto';
            rocket.style.cursor = 'pointer';
            rocket.addEventListener('click', () => {
                if (rocket.classList.contains('boosting')) return;
                rocket.classList.add('boosting');
                // Clear the boost after roughly one sped-up lap.
                setTimeout(() => rocket.classList.remove('boosting'), 9000);
            });
        });
    }

    /* ---------------------------------------------------------
       CUSTOM CURSOR + PARTICLE TRAIL
    --------------------------------------------------------- */
    function initCursor() {
        if (window.matchMedia('(pointer: coarse)').matches) return;

        const cursor = document.createElement('div');
        cursor.className = 'space-cursor';
        document.body.appendChild(cursor);

        const trail = [];
        const TRAIL_COUNT = 7;
        for (let i = 0; i < TRAIL_COUNT; i++) {
            const dot = document.createElement('div');
            dot.className = 'space-cursor-trail';
            dot.style.setProperty('--i', i);
            document.body.appendChild(dot);
            trail.push({ el: dot, x: 0, y: 0 });
        }

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animate() {
            cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;

            let prevX = mouseX;
            let prevY = mouseY;
            for (let i = 0; i < trail.length; i++) {
                const t = trail[i];
                const speed = 0.3 - i * 0.025;
                t.x += (prevX - t.x) * speed;
                t.y += (prevY - t.y) * speed;
                t.el.style.transform = `translate(${t.x}px, ${t.y}px) scale(${1 - i * 0.12})`;
                prevX = t.x;
                prevY = t.y;
            }
            requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);

        document.querySelectorAll('a, button, [role="button"], .nav-dot, .btn-explore').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }

    /* ---------------------------------------------------------
       SCROLL-TRIGGERED REVEALS (for sub-pages)
    --------------------------------------------------------- */
    function initScrollReveals() {
        const reveals = document.querySelectorAll('[data-reveal]');
        if (!reveals.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const delay = parseFloat(el.dataset.revealDelay) || 0;
                    setTimeout(() => el.classList.add('revealed'), delay * 1000);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

        reveals.forEach(el => observer.observe(el));
    }

    /* ---------------------------------------------------------
       PAGE TRANSITIONS
    --------------------------------------------------------- */
    function initPageTransitions() {
        const overlay = document.createElement('div');
        overlay.className = 'page-transition-overlay';
        document.body.appendChild(overlay);

        // Always force visible state on load
        function forceVisible() {
            overlay.classList.remove('active');
            document.body.classList.remove('page-leaving', 'page-entering');
            document.body.classList.add('page-visible');
        }

        // Fade in on initial load
        document.body.classList.add('page-entering');
        requestAnimationFrame(() => {
            requestAnimationFrame(() => forceVisible());
        });

        // Handle back/forward (bfcache restore)
        window.addEventListener('pageshow', (e) => {
            if (e.persisted) forceVisible();
        });

        // Fallback: if page becomes visible again (e.g. back button without bfcache)
        window.addEventListener('popstate', () => forceVisible());

        // Intercept internal links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]');
            if (!link) return;
            const href = link.getAttribute('href');
            if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) return;
            if (link.getAttribute('target') === '_blank') return;

            e.preventDefault();
            document.body.classList.add('page-leaving');
            overlay.classList.add('active');
            setTimeout(() => { window.location.href = href; }, 450);
        });
    }

    /* ---------------------------------------------------------
       PARALLAX (mouse-driven depth for hero elements)
    --------------------------------------------------------- */
    function initParallax() {
        const els = document.querySelectorAll('[data-parallax]');
        if (!els.length) return;

        document.addEventListener('mousemove', (e) => {
            const cx = (e.clientX / window.innerWidth - 0.5) * 2;
            const cy = (e.clientY / window.innerHeight - 0.5) * 2;

            els.forEach(el => {
                const depth = parseFloat(el.dataset.parallax) || 1;
                el.style.transform = `translate(${cx * depth * 6}px, ${cy * depth * 6}px)`;
            });
        });
    }

})();
