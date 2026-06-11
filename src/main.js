/*
 * Streamline Digital Imaging
 * Premium Frontend Interaction Script (Aligned with faunarobotics.com)
 */

import './style.css';
import storeData from './assets/stores.json';

document.addEventListener('DOMContentLoaded', () => {
  
  // Register GSAP ScrollTrigger
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // ==========================================
  // 1. COPYRIGHT YEAR SYNC
  // ==========================================
  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ==========================================
  // 2. SMART COLLAPSING NAVBAR
  // ==========================================
  const navbar = document.getElementById('main-nav');
  const navLogo = document.getElementById('brand-logo');
  const navMenu = document.getElementById('nav-menu');
  const navLinksList = document.getElementById('navbar-links-list');

  // Handle scroll trigger for dynamic navbar styling
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Scrolled class background and logo scaling
    if (scrollTop > 60) {
      navbar.classList.add('nav-scrolled');
      navLogo.classList.add('logo-scrolled');
    } else {
      navbar.classList.remove('nav-scrolled');
      navLogo.classList.remove('logo-scrolled');
    }
  }, { passive: true });

  // Mobile menu toggle
  const menuToggle = document.getElementById('menu-toggle-btn');
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('is--active');
      navMenu.classList.toggle('is--open');
    });

    const mobileLinks = navMenu.querySelectorAll('.navbar-links a, .btn');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('is--active');
        navMenu.classList.remove('is--open');
      });
    });
  }

  // ==========================================
  // 3. GSAP SCROLL & TEXT ENHANCEMENTS
  // ==========================================
  if (typeof gsap !== 'undefined') {
    // 3A. Hero Title Scroll Float
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) {
      const childNodes = Array.from(heroTitle.childNodes);
      heroTitle.innerHTML = '';

      childNodes.forEach((node, index) => {
        if (node.nodeType === Node.TEXT_NODE) {
          // Collapse multiple whitespaces and newlines into a single space
          let text = node.textContent.replace(/\s+/g, ' ');
          
          // Ignore whitespace-only nodes at absolute start or end of header
          if (text === ' ' || text === '') {
            if (index > 0 && index < childNodes.length - 1) {
              const span = document.createElement('span');
              span.className = 'hero-title-char';
              span.textContent = '\u00A0';
              heroTitle.appendChild(span);
            }
            return;
          }
          
          text.split('').forEach(char => {
            const span = document.createElement('span');
            span.className = 'hero-title-char';
            span.textContent = char === ' ' ? '\u00A0' : char;
            heroTitle.appendChild(span);
          });
        } else if (node.nodeName === 'BR') {
          heroTitle.appendChild(document.createElement('br'));
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const wrapper = node.cloneNode(false); // shallow clone outer tag
          let text = node.textContent.replace(/\s+/g, ' ');
          text.split('').forEach(char => {
            const span = document.createElement('span');
            span.className = 'hero-title-char';
            span.textContent = char === ' ' ? '\u00A0' : char;
            wrapper.appendChild(span);
          });
          heroTitle.appendChild(wrapper);
        }
      });

      const heroSubtitle = document.querySelector('.hero-subtitle');
      const titleChars = heroTitle.querySelectorAll('.hero-title-char');
      const heroTimeline = gsap.timeline();

      // CMYK Registration Alignment load-in animation
      heroTimeline.fromTo(
        titleChars,
        {
          willChange: 'opacity, transform',
          opacity: 0,
          y: -20,
          '--c-x': -18,
          '--c-y': -10,
          '--m-x': 18,
          '--m-y': 10,
          '--y-x': -10,
          '--y-y': 18
        },
        {
          opacity: 1,
          y: 0,
          '--c-x': 0,
          '--c-y': 0,
          '--m-x': 0,
          '--m-y': 0,
          '--y-x': 0,
          '--y-y': 0,
          stagger: 0.04,
          duration: 0.9,
          ease: 'back.out(2.2)'
        }
      );

      if (heroSubtitle) {
        heroTimeline.fromTo(
          heroSubtitle,
          {
            opacity: 0,
            y: 16
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out'
          },
          '>-0.4'
        );
      }

      // 3A1. Subtle ambient floating effect (independent of text shadow)
      gsap.to(titleChars, {
        y: '+=4',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        duration: 3.5,
        stagger: {
          each: 0.05,
          from: 'center'
        },
        delay: 1.5
      });

      // 3A2. Interactive CMYK Split Hover Effect on individual characters
      titleChars.forEach(char => {
        char.addEventListener('mouseenter', () => {
          gsap.to(char, {
            '--c-x': -5,
            '--c-y': -3,
            '--m-x': 5,
            '--m-y': 3,
            '--y-x': -3,
            '--y-y': 4,
            duration: 0.25,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        });

        char.addEventListener('mouseleave', () => {
          gsap.to(char, {
            '--c-x': 0,
            '--c-y': 0,
            '--m-x': 0,
            '--m-y': 0,
            '--y-x': 0,
            '--y-y': 0,
            duration: 0.6,
            ease: 'elastic.out(1.2, 0.4)',
            overwrite: 'auto'
          });
        });
      });
    }


    // 3B. Hero Asset Card Slide/Fade-in (no scale animation here to prevent ScrollTrigger scale conflict)
    gsap.from('#hero-asset-card', {
      opacity: 0,
      y: 60,
      duration: 1.5,
      ease: 'power4.out',
      delay: 0.3
    });

    // Hero Asset Card Scroll Expansion (Smooth one-time scale transition when mostly in view)
    ScrollTrigger.create({
      trigger: '#hero-asset-card',
      start: 'top 60%', // Triggers scale when top of the video is 60% down the viewport
      end: 'bottom 40%', // Reverts scale when bottom of the video leaves above 40% of the viewport
      invalidateOnRefresh: true,
      onEnter: () => {
        gsap.to('.home-hero__asset', {
          scale: 1.0,
          rotate: '0deg',
          duration: 1.05, // Slower, premium scale transition
          ease: 'power3.out',
          overwrite: 'auto'
        });
      },
      onLeave: () => {
        gsap.to('.home-hero__asset', {
          scale: 0.85,
          rotate: '-0.2deg',
          duration: 0.75, // Slower exit transition
          ease: 'power2.out',
          overwrite: 'auto'
        });
      },
      onEnterBack: () => {
        gsap.to('.home-hero__asset', {
          scale: 1.0,
          rotate: '0deg',
          duration: 1.05,
          ease: 'power3.out',
          overwrite: 'auto'
        });
      },
      onLeaveBack: () => {
        gsap.to('.home-hero__asset', {
          scale: 0.85,
          rotate: '0.2deg',
          duration: 0.75,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }
    });

    // Hero Focus Blur Scroll Trigger (Brought in slightly later when the video is more in the main view)
    const heroSection = document.querySelector('.hero-section-overhaul');
    ScrollTrigger.create({
      trigger: '#hero-asset-card',
      start: 'top 48%', // Triggers blur when video is more centered/focused in main view
      end: 'bottom 52%', // Clears blur when video starts leaving viewport
      invalidateOnRefresh: true,
      onEnter: () => {
        if (heroSection) heroSection.classList.add('video-focused');
        document.body.classList.add('video-focused-active');
      },
      onLeave: () => {
        if (heroSection) heroSection.classList.remove('video-focused');
        document.body.classList.remove('video-focused-active');
      },
      onEnterBack: () => {
        if (heroSection) heroSection.classList.add('video-focused');
        document.body.classList.add('video-focused-active');
      },
      onLeaveBack: () => {
        if (heroSection) heroSection.classList.remove('video-focused');
        document.body.classList.remove('video-focused-active');
      }
    });
    // 3C. Bento Grid Cards Scroll Trigger Reveal
    gsap.from('.scroll-reveal-card', {
      scrollTrigger: {
        trigger: '.bento-grid-overhaul',
        start: 'top 80%'
      },
      y: 60,
      opacity: 0,
      scale: 0.96,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power2.out',
      clearProps: 'all'
    });

    // 3D. Stats Count-up Scroll Trigger
    const counters = document.querySelectorAll('.count-value');
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.target, 10);
      gsap.to(counter, {
        scrollTrigger: {
          trigger: '#stats-counter-trigger',
          start: 'top 85%'
        },
        innerText: target,
        duration: 2.2,
        snap: { innerText: 1 },
        ease: 'power1.out',
        onUpdate: function () {
          // Add a + sign to team store counter
          if (target === 148) {
            counter.textContent = Math.ceil(this.targets()[0].innerText) + '+';
          }
        }
      });
    });

    // ==========================================
    // 3E. ABOUT OVERHAUL INTERACTIVE ACTIONS
    // ==========================================

    // A. RUBBER STAMP APPROVAL LOGIC
    const btnApprove = document.getElementById('btn-approve-production');
    const stamp = document.getElementById('production-rubber-stamp');
    const jobStatusText = document.getElementById('job-status-text');

    if (btnApprove && stamp) {
      btnApprove.addEventListener('click', () => {
        // Slam down the rubber stamp
        stamp.classList.add('is-stamped');
        
        // Change job status text
        if (jobStatusText) {
          jobStatusText.textContent = 'RUNNING (APPROVED)';
          jobStatusText.style.color = '#3E7090';
        }

        // Play visual button feedback (scale spring)
        gsap.fromTo(btnApprove, { scale: 0.95 }, { scale: 1, duration: 0.4, ease: 'elastic.out(1.2, 0.4)' });

        // Throw print confetti!
        createConfettiBurst();
      });
    }

    function createConfettiBurst() {
      // Create a nice burst of CMYK colored dot splats inside the clipboard wrapper
      const wrapper = document.querySelector('.clipboard-wrapper');
      if (!wrapper) return;

      const colors = ['#3E7090', '#B7A57A', '#E63946', '#1A1816']; // CMYK equivalent
      for (let i = 0; i < 30; i++) {
        const dot = document.createElement('div');
        dot.style.position = 'absolute';
        dot.style.width = `${gsap.utils.random(6, 12)}px`;
        dot.style.height = dot.style.width;
        dot.style.borderRadius = '50%';
        dot.style.backgroundColor = gsap.utils.random(colors);
        dot.style.left = '50%';
        dot.style.top = '70%';
        dot.style.pointerEvents = 'none';
        dot.style.zIndex = '20';
        wrapper.appendChild(dot);

        gsap.to(dot, {
          x: gsap.utils.random(-150, 150),
          y: gsap.utils.random(-250, -50),
          opacity: 0,
          scale: 0.2,
          duration: gsap.utils.random(0.8, 1.5),
          ease: 'power2.out',
          onComplete: () => dot.remove()
        });
      }
    }

    // E. HERO CARD PERSPECTIVE TILT
    const heroCard = document.getElementById('hero-asset-card');
    if (heroCard) {
      const asset = heroCard.querySelector('.home-hero__asset');
      if (asset) {
        // Set transform-style on parent to allow 3D depth
        heroCard.style.perspective = '1200px';
        asset.style.transformStyle = 'preserve-3d';
        
        heroCard.addEventListener('mousemove', (e) => {
          const rect = heroCard.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          
          // Tilt max 1.5 degrees (subtle, clean motion)
          const tiltX = (y / (rect.height / 2)) * -1.5;
          const tiltY = (x / (rect.width / 2)) * 1.5;
          
          gsap.to(asset, {
            rotateX: tiltX,
            rotateY: tiltY,
            duration: 0.3,
            ease: 'power2.out'
          });
        });
        
        heroCard.addEventListener('mouseleave', () => {
          gsap.to(asset, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.6,
            ease: 'power3.out'
          });
        });
      }
    }

    // F. GLOBAL BUTTON CLICK CONFETTI & ELASTIC BOUNCE
    function createGlobalConfettiBurst(element) {
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const parent = element.parentElement || document.body;
      const colors = ['#3E7090', '#B7A57A', '#E63946', '#1A1816']; // CMYK theme equivalent
      
      // We need absolute parent positioning, otherwise append to body
      const isStickyOrAbsolute = window.getComputedStyle(parent).position !== 'static';
      const container = isStickyOrAbsolute ? parent : document.body;
      const containerRect = container.getBoundingClientRect();
      
      const leftOffset = rect.left - containerRect.left + rect.width / 2;
      const topOffset = rect.top - containerRect.top + rect.height / 2;

      for (let i = 0; i < 16; i++) {
        const dot = document.createElement('div');
        dot.style.position = 'absolute';
        dot.style.width = `${gsap.utils.random(5, 9)}px`;
        dot.style.height = dot.style.width;
        dot.style.borderRadius = '50%';
        dot.style.backgroundColor = gsap.utils.random(colors);
        dot.style.left = `${leftOffset}px`;
        dot.style.top = `${topOffset}px`;
        dot.style.pointerEvents = 'none';
        dot.style.zIndex = '2000';
        container.appendChild(dot);

        gsap.to(dot, {
          x: gsap.utils.random(-80, 80),
          y: gsap.utils.random(-100, 100),
          opacity: 0,
          scale: 0.2,
          duration: gsap.utils.random(0.5, 1.0),
          ease: 'power2.out',
          onComplete: () => dot.remove()
        });
      }
    }

    const ctaButtons = document.querySelectorAll('#navbar-cta-btn, .order-form button[type="submit"]');
    ctaButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        createGlobalConfettiBurst(btn);
        gsap.fromTo(btn, { scale: 0.96 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
      });
    });

    // Delegate chip/swatch filter pops (clicks bubble up or bind dynamically)
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('filter-chip') || e.target.classList.contains('option-selector-btn')) {
        createGlobalConfettiBurst(e.target);
      }
    });
  }

  // ==========================================
  // 4. BENTO: DRAGGABLE BEZIER VECTOR EDITOR
  // ==========================================
  const svgEditor = document.getElementById('bezier-editor-svg');
  const path = document.getElementById('bezier-path');
  const handleLine1 = document.getElementById('handle-line-1');
  const handleLine2 = document.getElementById('handle-line-2');
  const ctrlP1 = document.getElementById('control-p1');
  const ctrlP2 = document.getElementById('control-p2');

  if (svgEditor && path && ctrlP1 && ctrlP2) {
    let activePoint = null;

    const startX = 40;
    const startY = 160;
    const endX = 260;
    const endY = 160;

    let p1 = { x: 80, y: 40 };
    let p2 = { x: 220, y: 40 };

    function getMouseCoords(e) {
      const rect = svgEditor.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (300 / rect.width);
      const y = (e.clientY - rect.top) * (200 / rect.height);
      return {
        x: Math.max(0, Math.min(300, x)),
        y: Math.max(0, Math.min(200, y))
      };
    }

    function updatePath() {
      // Update bezier curve path
      path.setAttribute('d', `M ${startX} ${startY} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${endX} ${endY}`);
      
      // Update control handles line overlays
      handleLine1.setAttribute('x2', p1.x);
      handleLine1.setAttribute('y2', p1.y);
      handleLine2.setAttribute('x2', p2.x);
      handleLine2.setAttribute('y2', p2.y);
    }

    const startDrag = (point) => (e) => {
      e.preventDefault();
      activePoint = point;
    };

    ctrlP1.addEventListener('mousedown', startDrag('p1'));
    ctrlP2.addEventListener('mousedown', startDrag('p2'));
    ctrlP1.addEventListener('touchstart', startDrag('p1'), { passive: false });
    ctrlP2.addEventListener('touchstart', startDrag('p2'), { passive: false });

    window.addEventListener('mousemove', (e) => {
      if (!activePoint) return;
      
      const coords = getMouseCoords(e);
      if (activePoint === 'p1') {
        p1 = coords;
        ctrlP1.setAttribute('cx', p1.x);
        ctrlP1.setAttribute('cy', p1.y);
      } else {
        p2 = coords;
        ctrlP2.setAttribute('cx', p2.x);
        ctrlP2.setAttribute('cy', p2.y);
      }
      updatePath();
    });

    window.addEventListener('touchmove', (e) => {
      if (!activePoint) return;
      const touch = e.touches[0];
      const coords = getMouseCoords(touch);
      if (activePoint === 'p1') {
        p1 = coords;
        ctrlP1.setAttribute('cx', p1.x);
        ctrlP1.setAttribute('cy', p1.y);
      } else {
        p2 = coords;
        ctrlP2.setAttribute('cx', p2.x);
        ctrlP2.setAttribute('cy', p2.y);
      }
      updatePath();
    }, { passive: false });

    const endDrag = () => {
      activePoint = null;
    };

    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchend', endDrag);
  }

  // ==========================================
  // 5. BENTO: SCREENPRINT SQUEEGEE CANVAS
  // ==========================================
  const canvas = document.getElementById('squeegee-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let squeegeeY = 20;
    let maxClearedY = 20;

    // Load custom logo or draw placeholder vectors
    function drawSimulation() {
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // 1. Draw T-Shirt Fabric background inside container boundary
      ctx.fillStyle = '#B7A57A'; // Husky Gold shirt
      ctx.fillRect(0, 0, w, h);

      // 2. Draw vibrant print logo underneath screen mesh
      ctx.save();
      ctx.fillStyle = '#3E7090'; // Husky Purple printed color
      ctx.font = '800 2.25rem Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('STREAMLINE PRINT', w / 2, h / 2 - 10);
      ctx.font = '600 0.875rem Inter, sans-serif';
      ctx.fillStyle = '#1A1816';
      ctx.fillText('SNOHOMISH LOCAL • EST. 2009', w / 2, h / 2 + 25);
      ctx.restore();

      // 3. Draw screen mesh overlay only on uncleared segments
      if (maxClearedY < h) {
        ctx.fillStyle = 'rgba(40, 42, 48, 0.85)'; // Grey screen emulsion
        ctx.fillRect(0, maxClearedY, w, h - maxClearedY);
        
        // Draw silk grid patterns on emulsion
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i < w; i += 8) {
          ctx.beginPath();
          ctx.moveTo(i, maxClearedY);
          ctx.lineTo(i, h);
          ctx.stroke();
        }
      }

      // 4. Draw Squeegee tool blade & handle bar
      ctx.save();
      // Rubber blade shadow
      ctx.fillStyle = '#1A1816';
      ctx.fillRect(30, squeegeeY, w - 60, 8);
      // Wooden block handle
      ctx.fillStyle = '#C89D7C'; // Warm wood color
      ctx.fillRect(40, squeegeeY - 14, w - 80, 14);
      // Wooden handle accent lines
      ctx.fillStyle = '#A0785C';
      ctx.fillRect(40, squeegeeY - 3, w - 80, 2);
      ctx.restore();
    }

    // Canvas listeners
    function getCanvasCoords(e) {
      const rect = canvas.getBoundingClientRect();
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const y = (clientY - rect.top) * (canvas.height / rect.height);
      return Math.max(10, Math.min(canvas.height - 10, y));
    }

    canvas.addEventListener('mousedown', (e) => {
      isDrawing = true;
      squeegeeY = getCanvasCoords(e);
      drawSimulation();
    });

    canvas.addEventListener('touchstart', (e) => {
      isDrawing = true;
      squeegeeY = getCanvasCoords(e);
      drawSimulation();
    }, { passive: true });

    window.addEventListener('mousemove', (e) => {
      if (!isDrawing) return;
      const y = getCanvasCoords(e);
      squeegeeY = y;
      if (y > maxClearedY) {
        maxClearedY = y;
      }
      drawSimulation();
    });

    window.addEventListener('touchmove', (e) => {
      if (!isDrawing) return;
      const y = getCanvasCoords(e);
      squeegeeY = y;
      if (y > maxClearedY) {
        maxClearedY = y;
      }
      drawSimulation();
    }, { passive: true });

    const stopPrinting = () => {
      if (isDrawing) {
        isDrawing = false;
        // If completed printing, trigger auto-reset trigger after 2.5s
        if (maxClearedY >= canvas.height - 15) {
          setTimeout(() => {
            if (typeof gsap !== 'undefined') {
              gsap.to({ val: maxClearedY }, {
                val: 20,
                duration: 1.5,
                ease: 'power2.inOut',
                onUpdate: function () {
                  maxClearedY = this.targets()[0].val;
                  squeegeeY = maxClearedY;
                  drawSimulation();
                }
              });
            } else {
              maxClearedY = 20;
              squeegeeY = 20;
              drawSimulation();
            }
          }, 2500);
        }
      }
    };

    window.addEventListener('mouseup', stopPrinting);
    window.addEventListener('touchend', stopPrinting);

    // Initial drawing
    drawSimulation();
  }

  // ==========================================
  // 6. ELASTIC USE-CASE CARDS (GSAP HOVER ROW)
  // ==========================================
  const useCases = document.querySelectorAll('.home-use__case');
  if (useCases.length > 0 && window.innerWidth >= 1280 && typeof gsap !== 'undefined') {
    
    // Hide descriptions initially in JS (replicates Webflow setup)
    useCases.forEach((caseEl, i) => {
      const desc = caseEl.querySelector('.use-case-desc');
      if (desc) {
        gsap.set(desc, { opacity: i === 0 ? 1 : 0 });
      }
    });

    useCases.forEach((caseEl, index) => {
      caseEl.addEventListener('mouseenter', () => {
        useCases.forEach(c => c.classList.remove('is--active'));
        caseEl.classList.add('is--active');

        useCases.forEach((sibling, i) => {
          let targetWidth = '16%';
          let targetX = 0;
          
          if (i === index) {
            // Expand card width
            targetWidth = index === 3 ? '38%' : '30%';
          } else if (i < index) {
            // Translate siblings preceding left
            targetX = -35;
          } else {
            // Translate siblings succeeding right
            targetX = 35;
          }

          // Smooth width/translation timeline
          gsap.to(sibling, {
            width: targetWidth,
            x: targetX,
            duration: 0.55,
            ease: 'power3.out'
          });

          // Smooth description reveal
          const desc = sibling.querySelector('.use-case-desc');
          if (desc) {
            gsap.to(desc, {
              opacity: i === index ? 1 : 0,
              duration: 0.3
            });
          }
        });
      });

      caseEl.addEventListener('mouseleave', () => {
        // Reset all cards back to defaults on mouse leave
        useCases.forEach((sibling, i) => {
          sibling.classList.remove('is--active');
          let defaultWidth = '25%';
          if (i === 0) defaultWidth = '14.172%';
          if (i === 1) defaultWidth = '25.872%';
          if (i === 2) defaultWidth = '25.218%';
          if (i === 3) defaultWidth = '34.738%';

          gsap.to(sibling, {
            width: defaultWidth,
            x: 0,
            duration: 0.55,
            ease: 'power3.out'
          });

          const desc = sibling.querySelector('.use-case-desc');
          if (desc) {
            gsap.to(desc, {
              opacity: 0,
              duration: 0.3
            });
          }
        });

        // Set card 1 back to active default state
        const firstCard = useCases[0];
        firstCard.classList.add('is--active');
        
        let w1 = '30%';
        let w2 = '20%';
        let w3 = '20%';
        let w4 = '30%';
        
        gsap.to(firstCard, { width: w1, x: 0, duration: 0.55, ease: 'power3.out' });
        gsap.to(useCases[1], { width: w2, x: 10, duration: 0.55, ease: 'power3.out' });
        gsap.to(useCases[2], { width: w3, x: 10, duration: 0.55, ease: 'power3.out' });
        gsap.to(useCases[3], { width: w4, x: 10, duration: 0.55, ease: 'power3.out' });
        
        const desc1 = firstCard.querySelector('.use-case-desc');
        if (desc1) {
          gsap.to(desc1, { opacity: 1, duration: 0.3 });
        }
      });
    });

    // Run defaults on load
    const firstCard = useCases[0];
    let w1 = '30%';
    let w2 = '20%';
    let w3 = '20%';
    let w4 = '30%';
    gsap.to(firstCard, { width: w1, duration: 0 });
    gsap.to(useCases[1], { width: w2, x: 10, duration: 0 });
    gsap.to(useCases[2], { width: w3, x: 10, duration: 0 });
    gsap.to(useCases[3], { width: w4, x: 10, duration: 0 });
  }

  // ==========================================
  // ==========================================
  // 7. UGC SLIDER AUTOPLAY LOOP & DRAG
  // ==========================================
  const dragWrapper = document.getElementById('carousel-wrapper-drag');
  const track = document.getElementById('ugc-carousel-track');
  const customCursor = document.getElementById('custom-video-cursor');

  if (dragWrapper && track && customCursor) {
    // Duplicate children for seamless infinite scroll loop
    track.innerHTML += track.innerHTML;

    // Custom cursor hover translation
    dragWrapper.addEventListener('mousemove', (e) => {
      customCursor.style.left = e.clientX + 'px';
      customCursor.style.top = e.clientY + 'px';
    });

    // Helper to get current translateX from matrix (returns float)
    function getCurrentTranslateX(element) {
      const style = window.getComputedStyle(element);
      const matrix = style.transform || style.webkitTransform;
      if (matrix && matrix !== 'none') {
        const values = matrix.split('(')[1].split(')')[0].split(',');
        return parseFloat(values[4]);
      }
      return 0;
    }

    // Dragging variables
    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;

    const startDrag = (clientX) => {
      isDragging = true;
      // Get current translation (could be halfway through the CSS marquee animation)
      prevTranslate = getCurrentTranslateX(track);
      startX = clientX;
      track.style.transition = 'none';
      track.classList.add('is-dragging');
      track.style.transform = `translateX(${prevTranslate}px)`;
    };

    const moveDrag = (clientX) => {
      if (!isDragging) return;
      const diffX = clientX - startX;
      currentTranslate = prevTranslate + diffX;
      
      const trackWidth = track.scrollWidth / 2;
      // Wrap around to maintain loop
      if (currentTranslate > 0) {
        currentTranslate -= trackWidth;
        startX += trackWidth;
        prevTranslate -= trackWidth;
      } else if (currentTranslate < -trackWidth) {
        currentTranslate += trackWidth;
        startX -= trackWidth;
        prevTranslate += trackWidth;
      }

      track.style.transform = `translateX(${currentTranslate}px)`;
    };

    const endDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      track.style.transform = '';
      track.classList.remove('is-dragging');
    };

    // Mouse events
    track.addEventListener('mousedown', (e) => startDrag(e.clientX));
    window.addEventListener('mousemove', (e) => moveDrag(e.clientX));
    window.addEventListener('mouseup', endDrag);

    // Touch events
    track.addEventListener('touchstart', (e) => startDrag(e.touches[0].clientX), { passive: true });
    window.addEventListener('touchmove', (e) => moveDrag(e.touches[0].clientX), { passive: true });
    window.addEventListener('touchend', endDrag);
  }

  // ==========================================
  // 8. STICKER VISUALIZER 3D HOVER TILT
  // ==========================================
  const perspectiveContainer = document.querySelector('.sticker-visual-box-perspective');
  const stickerCard = document.getElementById('sticker-3d-card');
  const sheen = document.getElementById('sticker-sheen-overlay');

  if (perspectiveContainer && stickerCard) {
    
    perspectiveContainer.addEventListener('mousemove', (e) => {
      const rect = perspectiveContainer.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position inside container
      const y = e.clientY - rect.top;  // y position inside container
      
      const cardWidth = rect.width;
      const cardHeight = rect.height;
      
      // Compute coordinates normalized between -0.5 and +0.5
      const normX = (x / cardWidth) - 0.5;
      const normY = (y / cardHeight) - 0.5;
      
      // Calculate 3D rotations (max 15 degrees)
      const rotateX = -normY * 20;
      const rotateY = normX * 20;
      
      stickerCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      
      // Move reflection sheen overlay
      if (sheen) {
        sheen.style.opacity = '1';
        sheen.style.transform = `translateX(${normX * 80}px) translateY(${normY * 80}px)`;
      }
    });

    perspectiveContainer.addEventListener('mouseleave', () => {
      // Smooth reset back to flat
      stickerCard.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
      stickerCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
      
      if (sheen) {
        sheen.style.opacity = '0';
      }
      
      // Reset transition delay after reset finishes
      setTimeout(() => {
        stickerCard.style.transition = 'none';
      }, 500);
    });
    
    perspectiveContainer.addEventListener('mouseenter', () => {
      stickerCard.style.transition = 'none';
    });
  }

  // ==========================================
  // 9. DYNAMIC STICKER BUY CALCULATOR
  // ==========================================
  const qtyInput = document.getElementById('sticker-quantity');
  const sizeButtons = document.querySelectorAll('#size-selector-container .option-selector-btn');
  const finishButtons = document.querySelectorAll('#finish-selector-container .option-selector-btn');
  const finishBadge = document.getElementById('preview-finish-badge');
  const priceDisplay = document.getElementById('sticker-calc-total');
  const perPieceDisplay = document.getElementById('sticker-calc-per-piece');
  const artFileInput = document.getElementById('sticker-art-file');
  const fileNameDisplay = document.getElementById('file-name-display');
  const previewImage = document.getElementById('sticker-preview-image');
  const calcForm = document.getElementById('sticker-calc-form');
  const cutSelect = document.getElementById('sticker-cut');
  const artHelpCheckbox = document.getElementById('sticker-art-help');

  let activeSize = '3in';
  let activeFinish = 'gloss';

  // Sizing buttons event listener
  sizeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      sizeButtons.forEach(b => b.classList.remove('is--selected'));
      btn.classList.add('is--selected');
      activeSize = btn.dataset.size;
      updateStickerPrice();
    });
  });

  // Finish buttons event listener
  finishButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      finishButtons.forEach(b => b.classList.remove('is--selected'));
      btn.classList.add('is--selected');
      activeFinish = btn.dataset.finish;
      if (finishBadge) {
        finishBadge.textContent = btn.textContent;
      }
      updateStickerPrice();
    });
  });

  // Quantity dropdown event listener
  if (qtyInput) {
    qtyInput.addEventListener('change', () => {
      updateStickerPrice();
    });
  }

  // Cut dropdown event listener
  if (cutSelect) {
    cutSelect.addEventListener('change', () => {
      updateStickerPrice();
    });
  }

  // Art help checkbox event listener
  if (artHelpCheckbox) {
    artHelpCheckbox.addEventListener('change', () => {
      updateStickerPrice();
    });
  }

  // File uploading & dynamic preview
  if (artFileInput) {
    artFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        if (fileNameDisplay) {
          fileNameDisplay.textContent = `Attached: ${file.name}`;
          fileNameDisplay.style.display = 'block';
        }
        
        // Premium touch: read file as image preview inside sticker visualizer
        const reader = new FileReader();
        reader.onload = (event) => {
          if (previewImage) {
            previewImage.src = event.target.result;
            previewImage.style.objectFit = 'cover';
            previewImage.style.borderRadius = '50%';
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Sticker Pricing Formula Logic (using the exact backend prices from the old site)
  function updateStickerPrice() {
    const qtyOption = qtyInput?.selectedOptions?.[0];
    const qtyPrice = Number(qtyOption?.dataset.price || 165);
    const qtyVal = Number(qtyInput?.value || 250);

    const activeSizeBtn = document.querySelector('#size-selector-container .option-selector-btn.is--selected');
    const sizePrice = Number(activeSizeBtn?.dataset.price || 0);

    const activeFinishBtn = document.querySelector('#finish-selector-container .option-selector-btn.is--selected');
    const finishPrice = Number(activeFinishBtn?.dataset.price || 0);

    const cutOption = cutSelect?.selectedOptions?.[0];
    const cutPrice = Number(cutOption?.dataset.price || 0);

    const artPrice = artHelpCheckbox?.checked ? 35 : 0;

    const finalPrice = qtyPrice + sizePrice + finishPrice + cutPrice + artPrice;
    const perPiece = finalPrice / qtyVal;

    if (priceDisplay) priceDisplay.textContent = `$${finalPrice.toFixed(2)}`;
    if (perPieceDisplay) perPieceDisplay.textContent = `($${perPiece.toFixed(2)} each)`;
  }

  updateStickerPrice();

  function activateOrderTab(tab) {
    const buttons = document.querySelectorAll('[data-tab]');
    const panels = document.querySelectorAll('.order-form');
    const sidecards = document.querySelectorAll('.order-sidecard, .estimate-card');

    buttons.forEach((button) => {
      const isActive = button.dataset.tab === tab;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-selected', String(isActive));
    });

    panels.forEach((panel) => {
      const isActive = panel.dataset.panel === tab;
      panel.classList.toggle('active', isActive);
      panel.hidden = !isActive;
    });

    sidecards.forEach((card) => {
      const isActive = card.dataset.panel === tab;
      card.hidden = !isActive;
    });
  }

  function setupOrderTabs() {
    document.querySelectorAll('[data-tab]').forEach((button) => {
      button.addEventListener('click', () => activateOrderTab(button.dataset.tab));
    });

    document.querySelectorAll('[data-switch-tab]').forEach((button) => {
      button.addEventListener('click', () => {
        activateOrderTab(button.dataset.switchTab);
      });
    });

    document.querySelectorAll('[data-open-order]').forEach((trigger) => {
      trigger.addEventListener('click', (event) => {
        const tab = trigger.dataset.openOrder || 'custom';
        event.preventDefault();
        activateOrderTab(tab);
        document.querySelector('.order-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    activateOrderTab('custom');
  }

  setupOrderTabs();

  const fileInputs = document.querySelectorAll('[data-dropzone] input[data-file-input]');
  fileInputs.forEach((input) => {
    const preview = input.closest('[data-dropzone]')?.nextElementSibling;
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!preview) return;

      if (!file) {
        preview.hidden = true;
        preview.innerHTML = '';
        return;
      }

      preview.hidden = false;
      preview.innerHTML = `<strong>Attached:</strong> ${file.name}`;

      if (file.type.startsWith('image/')) {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.style.maxWidth = '100%';
        img.style.marginTop = '0.75rem';
        img.style.borderRadius = '0.75rem';
        preview.appendChild(img);
      }
    });
  });

  if (calcForm) {
    calcForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const attachedFile = artFileInput.files[0];
      const fileName = attachedFile ? attachedFile.name : 'No file attached';
      
      const sizeText = document.querySelector('#size-selector-container .option-selector-btn.is--selected')?.textContent || activeSize;
      const finishText = document.querySelector('#finish-selector-container .option-selector-btn.is--selected')?.textContent || activeFinish;
      const cutText = cutSelect?.selectedOptions?.[0]?.textContent || 'Contour Cut';
      
      alert(`🎉 Sticker Project Submitted!\n\nDetails:\n• Size: ${sizeText}\n• Finish: ${finishText}\n• Cut Style: ${cutText}\n• Quantity: ${qtyInput.value}\n• File: ${fileName}\n\nOur Snohomish shop team will email you a digital mockup proof & official invoice within 2 hours.`);
      
      calcForm.reset();
      if (qtyInput) qtyInput.value = "250";
      if (fileNameDisplay) {
        fileNameDisplay.textContent = '';
        fileNameDisplay.style.display = 'none';
      }
      if (previewImage) {
        previewImage.src = '/assets/sticker_mockup.png';
        previewImage.style.objectFit = 'contain';
        previewImage.style.borderRadius = '0';
      }
      updateStickerPrice();
    });
  }

  const customOrderForm = document.getElementById('custom-order-form');
  if (customOrderForm) {
    customOrderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(customOrderForm);
      const projectName = formData.get('project') || 'No project name';
      const contact = formData.get('name') || 'No contact name';
      const email = formData.get('email') || 'No email';
      const projectType = formData.get('project-type') || 'Not specified';
      const quantity = formData.get('quantity') || 'Not specified';
      
      alert(`🎉 Custom Order Submitted!\n\nDetails:\n• Project: ${projectName}\n• Contact: ${contact}\n• Email: ${email}\n• Project type: ${projectType}\n• Estimated quantity: ${quantity}\n\nOur Snohomish shop team will review the request and follow up with questions, proof details, and pricing.`);
      
      customOrderForm.reset();
      const filePreview = customOrderForm.querySelector('[data-file-preview]');
      if (filePreview) {
        filePreview.hidden = true;
        filePreview.innerHTML = '';
      }
    });
  }

  // ==========================================
  // 9.5. DYNAMIC TEAM STORES FINDER
  // ==========================================
  const storeSearchInput = document.getElementById('store-search-input');
  const storeGroupFilter = document.getElementById('store-group-filter');
  const storeDirectoryContainer = document.getElementById('store-directory-container');
  const featuredStoresStrip = document.getElementById('featured-stores-strip');
  const emptyStoresMessage = document.getElementById('empty-stores-message');

  const storeState = {
    query: "",
    group: "all",
  };

  function initials(name) {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }

  function hostLabel(url) {
    try {
      const path = new URL(url).pathname.replace(/^\/|\/shop\/home$/g, "");
      return path || "Open store";
    } catch {
      return "Open store";
    }
  }

  function renderFilter() {
    if (!storeGroupFilter) return;

    const buttons = [
      { id: "all", label: "All Stores" },
      ...storeData.groups.map((group) => ({ id: group.group, label: group.group })),
    ];

    storeGroupFilter.innerHTML = buttons.map((button) => `
      <button class="filter-chip ${button.id === storeState.group ? "active" : ""}" type="button" data-group="${button.id}">
        ${button.label}
      </button>
    `).join("");

    storeGroupFilter.querySelectorAll("[data-group]").forEach((button) => {
      button.addEventListener("click", () => {
        storeState.group = button.dataset.group;
        renderStores();
        renderFilter();
      });
    });
  }

  function createStoreCard(item) {
    const card = document.createElement("a");
    card.className = "store-card";
    card.href = item.url;
    card.target = "_blank";
    card.rel = "noreferrer";
    card.innerHTML = `
      <span class="store-logo">
        <img src="${item.logo}" alt="" loading="lazy">
        <span class="store-initials">${initials(item.name)}</span>
      </span>
      <span class="store-info">
        <span class="store-name">${item.name}</span>
        <span class="store-url">${hostLabel(item.url)}</span>
      </span>
    `;
    const image = card.querySelector("img");
    image.addEventListener("error", () => card.classList.add("logo-error"), { once: true });
    return card;
  }

  function groupMatches(group) {
    if (storeState.group !== "all" && group.group !== storeState.group) return [];
    const tokens = storeState.query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!tokens.length) return group.items;
    return group.items.filter((item) => {
      const haystack = [item.name, group.group, item.url].join(" ").toLowerCase();
      return tokens.every((token) => haystack.includes(token));
    });
  }

  function renderStores() {
    if (!storeDirectoryContainer) return;

    storeDirectoryContainer.innerHTML = "";
    let visibleCount = 0;

    storeData.groups.forEach((group, index) => {
      const matches = groupMatches(group);
      if (!matches.length) return;
      visibleCount += matches.length;

      const details = document.createElement("details");
      details.className = "store-group";
      details.open = index < 3 || Boolean(storeState.query);

      const summary = document.createElement("summary");
      summary.innerHTML = `
        <div class="group-summary-header">
          <span class="group-dot"></span>
          <span class="store-group-name">${group.group}</span>
          <span class="store-group-count">${matches.length} linked ${matches.length === 1 ? "store" : "stores"}</span>
        </div>
        <svg class="group-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      `;

      const grid = document.createElement("div");
      grid.className = "store-grid";
      matches.forEach((item) => grid.append(createStoreCard(item)));

      details.append(summary, grid);
      storeDirectoryContainer.append(details);
    });

    if (emptyStoresMessage) emptyStoresMessage.hidden = visibleCount > 0;
  }

  function renderFeaturedStores() {
    if (!featuredStoresStrip) return;

    const featured = storeData.featured && storeData.featured.length
      ? storeData.featured
      : storeData.groups.flatMap(g => g.items).slice(0, 16);
    featuredStoresStrip.innerHTML = "";
    featured.forEach((item) => {
      const link = document.createElement("a");
      link.className = "featured-store";
      link.href = item.url;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.title = item.name;
      link.innerHTML = `<img src="${item.logo}" alt="${item.name} logo" loading="lazy">`;
      
      const image = link.querySelector("img");
      image.addEventListener("error", () => link.style.display = "none", { once: true });
      
      featuredStoresStrip.append(link);
    });
  }

  function setupStores() {
    document.querySelectorAll("[data-store-count]").forEach((el) => {
      const totalStores = storeData.groups.reduce((acc, g) => acc + g.items.length, 0);
      el.textContent = totalStores;
    });
    renderFeaturedStores();
    renderFilter();
    renderStores();

    if (storeSearchInput) {
      storeSearchInput.addEventListener("input", () => {
        storeState.query = storeSearchInput.value;
        renderStores();
      });
    }
  }

  setupStores();

  // ==========================================
  // COMPARE BEFORE & AFTER SLIDER
  // ==========================================
  function setupProofSlider() {
    const sliders = document.querySelectorAll("[data-proof-slider]");
    sliders.forEach((input) => {
      const wrap = input.closest("[data-proof-slider-wrap]");
      const update = () => {
        if (wrap) wrap.style.setProperty("--split", `${input.value}%`);
      };
      input.addEventListener("input", update);
      update();
    });
  }
  setupProofSlider();

  // ==========================================
  // CONTACT FORM SUBMISSION
  // ==========================================
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
        timestamp: new Date().toISOString()
      };

      try {
        // Log the message data for now (you can integrate with email service later)
        console.log('Contact form submitted:', data);

        // Show success message
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Message Sent!';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';

        // Reset form
        contactForm.reset();

        // Reset button after 3 seconds
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
        }, 3000);

        // For production, send to backend or email service
        // Example: POST to /api/contact
        /*
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        */
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('Error sending message. Please try again or call us directly at 360-243-3949');
      }
    });
  }

});
