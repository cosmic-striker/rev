/**
 * Resolution: Media Collective Platform - Interactive & API Engine
 * Resolution Yellow Branding, Web Audio Synth, 3D Optical Simulator, 
 * Dynamic Lightbox with Navigation, Reel Player, Event RSVPs, 3D Card Tilt,
 * Magnetic CTA Buttons, Scroll Progress, and REST API Integrations.
 */

let currentLightboxKey = 'res-01';
let workKeys = ['res-01', 'res-02', 'res-03', 'res-04'];

let worksData = {
  'res-01': {
    title: 'The Monsoon Sessions',
    code: '#RES-2026-01',
    discipline: 'Narrative Cinema',
    format: '2.39:1 Cinemascope • 4K DCI Raw',
    camera: 'ARRI Alexa Mini LF // Cooke Anamorphic /i Full Frame Plus',
    synopsis: 'Shot across forty-eight uninterrupted hours of active coastal storm surge on Marina Beach, Chennai. An intimate visual study of solitary deep-sea fishermen negotiating shifting tides and generational silence.',
    crew: 'Cinematographer: Karthik Selvan • Sound Recordist: Meera Nair • Colorist: Tarini Prasad',
    laurels: ['Official Selection - International Student Film Festival Rotterdam', 'Best Cinematography - National Youth Cine Awards 2025'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCauDdK5hnvfrSjCiqT3PjJVqYfMsbpjO208zaULDFBHGpkPzAR-tKhkKEfJsobDuAKc985_JHaPulo5hfKBzbAJop9yqvTlpZf6lohSwOCAHSYHEdnwnhEYqiK59n7gaDL2v44T6_1Jv3zgd0WuztPaZL_qpQdDzCnH_oNrL7vR30As6D4QS6U0OQBdk543p3r3rpvSmZU00Lt8zzpxWAuqNGXX1w6CIBq-VDhF73FRd1o5ttew6TrqQ'
  },
  'res-02': {
    title: 'Architecture of Shadows',
    code: '#RES-2026-02',
    discipline: '35mm Photo / Exhibition Still',
    format: '4:5 Medium Format • 120mm Ilford HP5 Plus',
    camera: 'Hasselblad 500 C/M // Carl Zeiss Planar 80mm f/2.8',
    synopsis: 'A brutalist photographic exploration dissecting geometric interplay between sunlight, concrete textures, and structural stillness inside university stairwells.',
    crew: 'Lead Artist: Devika Menon • Darkroom Technician: Arjun Varman',
    laurels: ['Curator’s Choice - Chennai Contemporary Arts Biennale 2025'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_FdflklbMyJ_DhPJwYTqT0Yu91PaOUpGUtUIOPrCJbd2UvAvWJovx5lpjvOvpZNm8Amd5aIZ07SX6VDP5O-hpR3KACSmv-uYfuNxT6YhZz4tW0Gn4ibcA5oGAkJ3slCkt_T2lKZEkwWU2hyBlBqjrTRu7jXaWJaX1JMx4oVMXerI4f7658LHVtrTMoeoWAos5ansS1I_rRoSut2x0U6WW3rQH_utdXDEshIuSbbiQX1_71wbokvoMAg'
  },
  'res-03': {
    title: 'Metropolis at Midnight',
    code: '#RES-2026-03',
    discipline: 'Soundscapes & Documentary Still',
    format: '16:10 Wide • Multi-Track Ambisonic 7.1.4',
    camera: 'Sony FX3 // CineAlta 35mm T2.0 + Sound Devices 833 Ambisonic Array',
    synopsis: 'A long-exposure nocturnal auditory and visual mapping of Chennai urban transit routes after midnight, capturing neon light bleed and locomotive acoustics.',
    crew: 'Resolution Night Photographers Guild • Sound Design: Zubin Mehta',
    laurels: ['Featured in Sonic Frontiers Magazine, January 2026'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjEpi2_RMDsm1mkk4ORsIuCi4RtEQ4qGJT--v16RxWiSIifYNw56lbFUXQM_uTNMXDucEYYiLa17ScTeyUghFK4UZe029Kp_2iK1L9E0Afo95aCKhb4uiS6BHs2yr5w0dCXi1vlKtna3vUgNMM4e1weAouGF7uXBXBxjhuXC6yrKVLp7CMkX9gNFZ7iflrmSE9xNNNh6RMs4Jck0mlANE7gJmPTF4R0sDBbBV4Ng8MMVpjUPdwkH6CgA'
  },
  'res-04': {
    title: 'Analog Diaries // 35MM',
    code: '#RES-2025-44',
    discipline: '35mm Photo / Archival Release',
    format: '35mm Full Aperture • Kodak Tri-X 400 D-76 Processed',
    camera: 'Leica M6 // Summicron 35mm f/2.0 ASPH',
    synopsis: 'A raw backstage contact sheet and silver gelatin print catalog documenting theater performers in dressing rooms illuminated strictly by incandescent tungsten vanity bulbs.',
    crew: 'Curated by Student Darkroom Committee • Lead Photographer: Suhani Chawla',
    laurels: ['Archived into Permanent University Visual Library Collection'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCd8ReVnAtlqJiid2BTqw1yv6t0jmurHqF_k6o9eFR3_O9_Wk57_kGySZKf-7Rhy0tixdVwHw5YDSBkAVBFTfVCplbQikykvYAla9TARZohzO4JYuPKCWG7a8IyTyQdJxJw6o0VZCieCFL8CnXZihueUboZ1C-l9WfKM-kBAogwNTq6ZJvGwWmztHoWs8JTjCvbIc81oKGIPQfEwf3QuhZ2JM0yd0j4MpW5ueA-V6gTmbaVM5_dt8QLjQ'
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initScrollProgressBar();
  initHeaderBehavior();
  initCursor();
  initTimecode();
  initAudioEngine();
  initOpticalSimulator();
  initWorkFilterAndLightbox();
  initFilmReelScrubber();
  initEventsSystem();
  initRecruitmentForm();
  initReelModal();
  initVaultModal();
  initAdminModal();
  initMobileMenu();
  initSmoothScroll();
  initScrollReveals();
  init3DCardTilt();
  initMagneticButtons();
  initKeyboardNavigation();
  initDividerAnimations();
  initDynamicSiteSync();
});

/* ----------------------------------------------------
 * 0. CINEMATIC PRELOADER DISMISSAL
 * ---------------------------------------------------- */
function initPreloader() {
  const preloader = document.getElementById('resolution-preloader');
  if (!preloader) return;

  const dismiss = () => {
    preloader.classList.add('fade-out');
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 650);
  };

  if (document.readyState === 'complete') {
    setTimeout(dismiss, 350);
  } else {
    window.addEventListener('load', () => setTimeout(dismiss, 350));
    setTimeout(dismiss, 1000);
  }
}

/* ----------------------------------------------------
 * 0.1 TOP RESOLUTION YELLOW SCROLL PROGRESS BAR
 * ---------------------------------------------------- */
function initScrollProgressBar() {
  const bar = document.getElementById('scroll-progress-bar');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progress = (window.scrollY / totalHeight) * 100;
      bar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }
  }, { passive: true });
}

/* ----------------------------------------------------
 * 0.2 DYNAMIC HEADER SHRINK & ACTIVE NAV SECTION TRACKING
 * ---------------------------------------------------- */
function initHeaderBehavior() {
  const header = document.getElementById('site-header');
  const headerInner = document.getElementById('header-inner');
  if (!header) return;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 40) {
      if (headerInner) {
        headerInner.classList.remove('h-20');
        headerInner.classList.add('h-16');
      }
      header.classList.add('bg-surface/95', 'shadow-[0_4px_20px_rgba(0,0,0,0.5)]');
    } else {
      if (headerInner) {
        headerInner.classList.remove('h-16');
        headerInner.classList.add('h-20');
      }
      header.classList.remove('shadow-[0_4px_20px_rgba(0,0,0,0.5)]');
    }
  }, { passive: true });

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('#site-header nav a[href^="#"]');

  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const scrollPos = window.scrollY + 180;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      const underline = link.querySelector('span:last-child');
      if (href === currentSectionId) {
        link.classList.add('text-primary');
        link.classList.remove('text-on-surface-variant');
        if (underline) underline.classList.add('scale-x-100');
      } else {
        link.classList.remove('text-primary');
        link.classList.add('text-on-surface-variant');
        if (underline) underline.classList.remove('scale-x-100');
      }
    });
  }, { passive: true });
}

/* ----------------------------------------------------
 * 1. PREMIUM CUSTOM DESKTOP CURSOR (Disabled on Touch)
 * ---------------------------------------------------- */
function initCursor() {
  const cursor = document.getElementById('cinema-cursor');
  const cursorLabel = document.getElementById('cursor-label');
  if (!cursor || !cursorLabel) return;

  const isDesktopPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!isDesktopPointer) {
    cursor.style.display = 'none';
    return;
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.opacity = '1';
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });

  function renderCursor() {
    cursorX += (mouseX - cursorX) * 0.22;
    cursorY += (mouseY - cursorY) * 0.22;
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  function bindHover(elements) {
    elements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        const text = el.getAttribute('data-cursor') || 'VIEW';
        cursor.classList.remove('w-3', 'h-3');
        cursor.classList.add('w-20', 'h-20', 'bg-primary', 'text-black', 'scale-105', 'shadow-[0_0_20px_rgba(250,204,21,0.6)]');
        cursorLabel.textContent = text;
        cursorLabel.style.opacity = '1';
      });

      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('w-20', 'h-20', 'bg-primary', 'text-black', 'scale-105', 'shadow-[0_0_20px_rgba(250,204,21,0.6)]');
        cursor.classList.add('w-3', 'h-3');
        cursorLabel.textContent = '';
        cursorLabel.style.opacity = '0';
      });
    });
  }

  bindHover(document.querySelectorAll('[data-cursor]'));
  window.bindCursorHover = bindHover;
}

/* ----------------------------------------------------
 * 2. 24FPS SMPTE TIMECODE SIMULATOR
 * ---------------------------------------------------- */
function initTimecode() {
  let frames = 18;
  let seconds = 22;
  let minutes = 4;
  let hours = 0;
  const timecodeElem = document.getElementById('hero-timecode');

  setInterval(() => {
    frames++;
    if (frames >= 24) {
      frames = 0;
      seconds++;
      if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
          minutes = 0;
          hours++;
        }
      }
    }
    if (timecodeElem) {
      timecodeElem.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(frames).padStart(2, '0')}`;
    }
  }, 1000 / 24);
}

/* ----------------------------------------------------
 * 3. WEB AUDIO SYNTHESIZER (35mm Projector & Ambient Soundscape)
 * ---------------------------------------------------- */
let audioCtx = null;
let isAudioPlaying = false;
let ambientGain = null;
let noiseNode = null;
let humOsc = null;

function initAudioEngine() {
  const soundBtn = document.getElementById('sound-toggle-btn');
  const soundStatus = document.getElementById('sound-status-label');
  const soundIcon = document.getElementById('sound-icon');
  const soundWave = document.getElementById('sound-wave-bars');

  if (!soundBtn) return;

  soundBtn.addEventListener('click', () => {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (!isAudioPlaying) {
      startAmbientAudio();
      isAudioPlaying = true;
      if (soundStatus) soundStatus.textContent = 'Sound: On';
      if (soundIcon) soundIcon.textContent = 'volume_up';
      if (soundWave) soundWave.classList.remove('opacity-40');
      playMechanicalClick();
    } else {
      stopAmbientAudio();
      isAudioPlaying = false;
      if (soundStatus) soundStatus.textContent = 'Sound: Off';
      if (soundIcon) soundIcon.textContent = 'volume_off';
      if (soundWave) soundWave.classList.add('opacity-40');
    }
  });

  document.querySelectorAll('button, a[href^="#"], input[type="range"]').forEach(el => {
    el.addEventListener('click', () => {
      if (isAudioPlaying) playMechanicalClick();
    });
  });
}

function startAmbientAudio() {
  if (!audioCtx) return;
  
  humOsc = audioCtx.createOscillator();
  const humGain = audioCtx.createGain();
  humOsc.type = 'sine';
  humOsc.frequency.setValueAtTime(55, audioCtx.currentTime);
  humGain.gain.setValueAtTime(0.04, audioCtx.currentTime);
  humOsc.connect(humGain);

  const bufferSize = audioCtx.sampleRate * 2;
  const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  const whiteNoise = audioCtx.createBufferSource();
  whiteNoise.buffer = noiseBuffer;
  whiteNoise.loop = true;

  const bandpass = audioCtx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.setValueAtTime(750, audioCtx.currentTime);
  bandpass.Q.setValueAtTime(3.0, audioCtx.currentTime);

  const noiseGain = audioCtx.createGain();
  noiseGain.gain.setValueAtTime(0.012, audioCtx.currentTime);

  whiteNoise.connect(bandpass);
  bandpass.connect(noiseGain);

  ambientGain = audioCtx.createGain();
  ambientGain.gain.setValueAtTime(0.8, audioCtx.currentTime);

  humGain.connect(ambientGain);
  noiseGain.connect(ambientGain);
  ambientGain.connect(audioCtx.destination);

  humOsc.start();
  whiteNoise.start();
  noiseNode = whiteNoise;
}

function stopAmbientAudio() {
  if (ambientGain && audioCtx) {
    ambientGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.1);
    setTimeout(() => {
      if (humOsc) { humOsc.stop(); humOsc.disconnect(); }
      if (noiseNode) { noiseNode.stop(); noiseNode.disconnect(); }
    }, 150);
  }
}

function playMechanicalClick() {
  if (!audioCtx) return;
  try {
    const clickOsc = audioCtx.createOscillator();
    const clickGain = audioCtx.createGain();
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(1400, audioCtx.currentTime);
    clickOsc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.04);
    clickGain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    clickGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
    clickOsc.connect(clickGain);
    clickGain.connect(audioCtx.destination);
    clickOsc.start();
    clickOsc.stop(audioCtx.currentTime + 0.045);
  } catch (e) {
    // Safe audio catch
  }
}

/* ----------------------------------------------------
 * 4. 3D OPTICAL ENGINE SIMULATOR (Metallic Lens & Bokeh Depth)
 * ---------------------------------------------------- */
function initOpticalSimulator() {
  const lensContainer = document.getElementById('lens-container');
  const lensRing = document.getElementById('lens-outer-ring');
  const irisSvg = document.getElementById('inner-iris');
  const activeFocalLabel = document.getElementById('active-focal-label');
  const irisSlider = document.getElementById('iris-slider');
  const bokehTarget = document.getElementById('bokeh-target-preview');

  let isDragging = false;
  let startX = 0;
  let currentAngle = 0;
  let idleAngle = 0;

  function idleSpin() {
    if (!isDragging && lensRing) {
      idleAngle += 0.08;
      lensRing.style.transform = `rotate(${currentAngle + idleAngle}deg)`;
    }
    requestAnimationFrame(idleSpin);
  }
  requestAnimationFrame(idleSpin);

  if (lensContainer && lensRing) {
    lensContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const delta = e.clientX - startX;
      currentAngle += delta * 0.45;
      startX = e.clientX;
      lensRing.style.transform = `rotate(${currentAngle}deg)`;
    });

    lensContainer.addEventListener('touchstart', (e) => {
      isDragging = true;
      startX = e.touches[0].clientX;
    }, { passive: true });
    window.addEventListener('touchend', () => isDragging = false);
    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const delta = e.touches[0].clientX - startX;
      currentAngle += delta * 0.45;
      startX = e.touches[0].clientX;
      lensRing.style.transform = `rotate(${currentAngle}deg)`;
    }, { passive: true });
  }

  window.setLens = (focal, aperture) => {
    if (activeFocalLabel) {
      activeFocalLabel.textContent = `${focal.toUpperCase()} • ${aperture}`;
    }

    let fNum = parseFloat(aperture.replace('f/', '')) || 1.4;
    if (irisSlider) irisSlider.value = fNum;
    window.adjustIris(fNum);

    document.querySelectorAll('.focal-btn').forEach(btn => {
      if (btn.getAttribute('data-focal') === focal) {
        btn.classList.remove('bg-surface-container', 'text-on-surface');
        btn.classList.add('bg-primary', 'text-black', 'font-bold');
      } else {
        btn.classList.remove('bg-primary', 'text-black', 'font-bold');
        btn.classList.add('bg-surface-container', 'text-on-surface');
      }
    });

    if (isAudioPlaying) playMechanicalClick();
  };

  window.adjustIris = (val) => {
    const fVal = parseFloat(val);
    if (irisSvg) {
      const scale = Math.max(0.2, 1.4 - (fVal / 16) * 1.15);
      irisSvg.setAttribute('transform', `scale(${scale}) translate(${(1 - scale) * 50}, ${(1 - scale) * 50})`);
    }

    if (activeFocalLabel) {
      const parts = activeFocalLabel.textContent.split('•');
      const focal = parts[0] ? parts[0].trim() : '85MM';
      activeFocalLabel.textContent = `${focal} • f/${fVal.toFixed(1)}`;
    }

    if (bokehTarget) {
      const blurAmount = Math.max(0, (16 - fVal) * 0.65);
      bokehTarget.style.filter = `blur(${blurAmount}px)`;
    }
  };
}

/* ----------------------------------------------------
 * 5. SELECTED WORKS FILTERING & LIGHTBOX WITH REST API SYNC
 * ---------------------------------------------------- */
async function syncWorksFromAPI() {
  try {
    const res = await fetch('/api/works');
    if (!res.ok) return;
    const json = await res.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      workKeys = [];
      const worksGrid = document.getElementById('works-grid');
      let gridHtml = '';

      json.data.forEach((w, idx) => {
        const key = w.workCode ? w.workCode.toLowerCase().replace(/[^a-z0-9]/g, '-') : `res-0${idx + 1}`;
        workKeys.push(key);
        worksData[key] = {
          title: w.title,
          code: w.workCode,
          discipline: w.disciplineLabel || (w.discipline === 'narrative' ? 'NARRATIVE CINEMA' : (w.discipline === 'photo' ? '35MM STILL' : (w.discipline === 'sound' ? 'SOUND DESIGN' : 'EXHIBITION'))),
          format: w.format || '2.39:1 CINEMASCOPE // 4K 10-BIT',
          camera: w.camera || 'RED V-RAPTOR 8K VV // COOKE ANAMORPHIC /I',
          synopsis: w.synopsis || w.shortDescription || '',
          crew: w.crew || '',
          laurels: w.laurels || [],
          image: w.image
        };

        const gridSpan = w.gridSpan || (idx === 0 ? 'md:col-span-8' : (idx === 1 ? 'md:col-span-4' : (idx === 2 ? 'md:col-span-5' : 'md:col-span-7')));
        let aspectClass = 'aspect-[16/9]';
        if (w.aspectRatio === '4:5' || idx === 1) aspectClass = 'aspect-[4/5]';
        else if (w.aspectRatio === '16:10' || idx === 2) aspectClass = 'aspect-[16/10]';
        else if (w.aspectRatio === '1:1') aspectClass = 'aspect-square';

        const cursorType = w.discipline === 'narrative' ? 'PLAY' : (w.discipline === 'photo' ? 'VIEW' : 'BROWSE');

        gridHtml += `
          <div class="camera-frame-box tilt-card ${gridSpan} group relative bg-surface-container-low cursor-pointer overflow-hidden transition-all duration-300 border border-surface-container-high hover:border-primary/50" data-cursor="${cursorType}" data-work-category="${w.discipline || 'narrative'}" data-work-id="${key}" data-tilt="true">
            <div class="w-full ${aspectClass} overflow-hidden relative">
              <div class="photo-card-hover w-full h-full bg-cover bg-center filter brightness-90 group-hover:brightness-100" style="background-image: url('${w.image}')"></div>
              <div class="absolute top-md left-md bg-surface-container-lowest/90 backdrop-blur-md px-sm py-micro font-caption-sm text-caption-sm text-primary uppercase font-bold border border-primary/30">
                ${w.format || '2.39:1 CINEMASCOPE // 4K 10-BIT'}
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent to-transparent opacity-80"></div>
            </div>
            <div class="p-lg bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-md">
              <div>
                <span class="font-caption-sm text-caption-sm text-primary uppercase tracking-widest font-bold">${w.workCode || `#RES-2026-0${idx+1}`} • ${(w.disciplineLabel || w.discipline || 'PORTFOLIO').toUpperCase()}</span>
                <h3 class="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">${w.title}</h3>
                <p class="font-body-md text-body-md text-on-surface-variant">${w.crew || w.shortDescription || ''}</p>
              </div>
              <div class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface group-hover:bg-primary group-hover:text-black transition-all shrink-0">
                <span class="material-symbols-outlined text-[20px]">arrow_outward</span>
              </div>
            </div>
          </div>
        `;
      });

      if (worksGrid) {
        worksGrid.innerHTML = gridHtml;
        bindWorkItemClicks();
        if (window.bindCursorHover) {
          window.bindCursorHover(worksGrid.querySelectorAll('[data-cursor]'));
        }
      }
    }
  } catch (e) {
    // Graceful fallback to initial cached worksData
  }
}

function bindWorkItemClicks() {
  document.querySelectorAll('[data-work-id]').forEach(item => {
    item.onclick = () => {
      const workId = item.getAttribute('data-work-id');
      currentLightboxKey = workId;
      const data = worksData[workId];
      if (data) {
        openWorkLightbox(data);
      }
    };
  });
}

function initWorkFilterAndLightbox() {
  syncWorksFromAPI();

  const filterBtns = document.querySelectorAll('.work-filter-btn');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-filter');
      const workItems = document.querySelectorAll('[data-work-category]');
      
      filterBtns.forEach(b => {
        b.classList.remove('bg-primary', 'text-black', 'font-bold');
        b.classList.add('bg-surface-container', 'text-on-surface-variant');
      });
      btn.classList.add('bg-primary', 'text-black', 'font-bold');
      btn.classList.remove('bg-surface-container', 'text-on-surface-variant');

      workItems.forEach(item => {
        const itemCat = item.getAttribute('data-work-category');
        if (category === 'all' || itemCat === category) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });

      if (isAudioPlaying) playMechanicalClick();
    });
  });

  bindWorkItemClicks();
}

function openWorkLightbox(data) {
  const modal = document.getElementById('work-lightbox-modal');
  if (!modal) return;

  document.getElementById('lb-code').textContent = data.code;
  document.getElementById('lb-discipline').textContent = data.discipline;
  document.getElementById('lb-title').textContent = data.title;
  document.getElementById('lb-format').textContent = data.format;
  document.getElementById('lb-camera').textContent = data.camera;
  document.getElementById('lb-synopsis').textContent = data.synopsis;
  document.getElementById('lb-crew').textContent = data.crew;
  
  const laurelsContainer = document.getElementById('lb-laurels');
  laurelsContainer.innerHTML = '';
  data.laurels.forEach(laurel => {
    const p = document.createElement('div');
    p.className = 'flex items-center gap-xs text-primary font-caption-sm text-caption-sm font-bold';
    p.innerHTML = `<span class="material-symbols-outlined text-[14px]">stars</span><span>${laurel}</span>`;
    laurelsContainer.appendChild(p);
  });

  const imgElem = document.getElementById('lb-image');
  if (imgElem) {
    imgElem.style.backgroundImage = `url('${data.image}')`;
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden';
  if (isAudioPlaying) playMechanicalClick();
}

window.prevLightboxWork = () => {
  let idx = workKeys.indexOf(currentLightboxKey);
  if (idx === -1) idx = 0;
  idx = (idx - 1 + workKeys.length) % workKeys.length;
  currentLightboxKey = workKeys[idx];
  openWorkLightbox(worksData[currentLightboxKey]);
};

window.nextLightboxWork = () => {
  let idx = workKeys.indexOf(currentLightboxKey);
  if (idx === -1) idx = 0;
  idx = (idx + 1) % workKeys.length;
  currentLightboxKey = workKeys[idx];
  openWorkLightbox(worksData[currentLightboxKey]);
};

window.closeWorkLightbox = () => {
  const modal = document.getElementById('work-lightbox-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }
};

/* ----------------------------------------------------
 * 6. FILM REEL HORIZONTAL SCRUBBER
 * ---------------------------------------------------- */
function initFilmReelScrubber() {
  const reel = document.getElementById('film-reel-strip');
  const reelProgress = document.getElementById('reel-progress');
  const reelCounter = document.getElementById('reel-counter-label');
  if (!reel || !reelProgress) return;

  reel.addEventListener('wheel', (e) => {
    if (e.deltaY !== 0) {
      e.preventDefault();
      reel.scrollLeft += e.deltaY * 1.5;
    }
  }, { passive: false });

  reel.addEventListener('scroll', () => {
    const maxScroll = reel.scrollWidth - reel.clientWidth;
    const percent = maxScroll > 0 ? (reel.scrollLeft / maxScroll) * 100 : 0;
    reelProgress.style.width = `${Math.max(15, percent)}%`;

    const frameIndex = Math.min(4, Math.max(1, Math.round((percent / 100) * 3) + 1));
    if (reelCounter) {
      reelCounter.textContent = `FRAME SCRUB // 0${frameIndex}`;
    }
  });
}

/* ----------------------------------------------------
 * 7. EVENTS SYSTEM & BACKEND REST RSVP REGISTRATION
 * ---------------------------------------------------- */
function initEventsSystem() {
  const eventFilterBtns = document.querySelectorAll('.event-filter-btn');
  const eventCards = document.querySelectorAll('[data-event-category]');

  eventFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-event-filter');
      eventFilterBtns.forEach(b => {
        b.classList.remove('bg-primary', 'text-black', 'font-bold');
        b.classList.add('bg-surface-container', 'text-on-surface-variant');
      });
      btn.classList.add('bg-primary', 'text-black', 'font-bold');
      btn.classList.remove('bg-surface-container', 'text-on-surface-variant');

      eventCards.forEach(card => {
        const cat = card.getAttribute('data-event-category');
        if (category === 'all' || cat === category) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });

      if (isAudioPlaying) playMechanicalClick();
    });
  });

  window.openRsvpModal = (eventTitle, eventDate, eventLocation, seatsRemaining, eventId) => {
    const modal = document.getElementById('rsvp-modal');
    if (!modal) return;

    window._activeRsvpEventId = eventId || null;
    document.getElementById('rsvp-event-title').textContent = eventTitle;
    document.getElementById('rsvp-event-date').textContent = eventDate;
    document.getElementById('rsvp-event-loc').textContent = eventLocation;
    document.getElementById('rsvp-seats-badge').textContent = seatsRemaining > 0 
      ? `LIMITED ACCESS // ${seatsRemaining} SEATS LEFT`
      : `REGISTRATION CLOSED // SOLD OUT`;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    if (isAudioPlaying) playMechanicalClick();
  };

  window.closeRsvpModal = () => {
    const modal = document.getElementById('rsvp-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.style.overflow = '';
    }
  };

  const rsvpForm = document.getElementById('rsvp-form');
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const attendeeName = document.getElementById('rsvp-name').value;
      const attendeeEmail = document.getElementById('rsvp-email').value;
      const eventTitle = document.getElementById('rsvp-event-title').textContent;
      const eventTargetId = window._activeRsvpEventId || '1';

      let passId = `RES-PASS-${Math.floor(100000 + Math.random() * 900000)}`;

      // Post to Backend REST Endpoint
      try {
        const res = await fetch(`/api/events/${eventTargetId}/rsvp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: attendeeName, email: attendeeEmail })
        });
        const data = await res.json();
        if (!res.ok) {
          alert(data.message || 'This event has reached full capacity or registration is closed.');
          return;
        }
        if (data.success && data.data && data.data.passId) {
          passId = data.data.passId;
        }
      } catch (err) {
        console.warn('Operating offline - generated local ticket ID:', passId);
      }

      document.getElementById('rsvp-form-view').classList.add('hidden');
      const passView = document.getElementById('rsvp-ticket-view');
      passView.classList.remove('hidden');

      document.getElementById('ticket-pass-id').textContent = passId;
      document.getElementById('ticket-attendee').textContent = attendeeName;
      document.getElementById('ticket-event').textContent = eventTitle;

      if (isAudioPlaying) playMechanicalClick();
    });
  }

  window.resetRsvpView = () => {
    const formView = document.getElementById('rsvp-form-view');
    const ticketView = document.getElementById('rsvp-ticket-view');
    if (formView && ticketView) {
      formView.classList.remove('hidden');
      ticketView.classList.add('hidden');
    }
    window.closeRsvpModal();
  };
}

/* ----------------------------------------------------
 * 8. RECRUITMENT APPLICATION & BACKEND INTAKE
 * ---------------------------------------------------- */
function initRecruitmentForm() {
  const form = document.getElementById('recruitment-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('applicant-name').value;
    const discipline = document.getElementById('applicant-discipline').value;
    const portfolioUrl = document.getElementById('applicant-portfolio').value;
    
    let appId = `RES-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    // Submit to Backend REST API
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, discipline, portfolioUrl })
      });
      const data = await res.json();
      if (data.success && data.data && data.data.applicationId) {
        appId = data.data.applicationId;
      }
    } catch (err) {
      console.warn('Operating offline - stored locally with application ID:', appId);
    }

    const appModal = document.getElementById('app-success-modal');
    if (appModal) {
      document.getElementById('app-success-id').textContent = appId;
      document.getElementById('app-success-name').textContent = name;
      document.getElementById('app-success-discipline').textContent = discipline;
      appModal.classList.remove('hidden');
      appModal.classList.add('flex');
      document.body.style.overflow = 'hidden';
    }

    form.reset();
    if (isAudioPlaying) playMechanicalClick();
  });

  window.closeAppSuccessModal = () => {
    const modal = document.getElementById('app-success-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.style.overflow = '';
    }
  };
}

/* ----------------------------------------------------
 * 9. REEL 24 VIDEO PLAYER & LUT SWITCHER
 * ---------------------------------------------------- */
function initReelModal() {
  window.openReelModal = () => {
    const modal = document.getElementById('reel-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    if (isAudioPlaying) playMechanicalClick();
  };

  window.closeReelModal = () => {
    const modal = document.getElementById('reel-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.style.overflow = '';
    }
  };

  window.applyLut = (lutName) => {
    const screen = document.getElementById('reel-screen-canvas');
    if (!screen) return;

    screen.className = 'w-full h-full bg-cover bg-center transition-all duration-500';
    if (lutName === 'aces') {
      screen.classList.add('contrast-125', 'brightness-95', 'saturate-150');
    } else if (lutName === 'noir') {
      screen.classList.add('grayscale', 'contrast-150', 'brightness-90');
    } else if (lutName === 'koda') {
      screen.classList.add('sepia-[0.3]', 'contrast-110', 'saturate-125');
    } else {
      screen.classList.add('contrast-105', 'brightness-100');
    }

    document.querySelectorAll('.lut-btn').forEach(b => {
      if (b.getAttribute('data-lut') === lutName) {
        b.classList.remove('bg-surface-container', 'text-on-surface-variant');
        b.classList.add('bg-primary', 'text-black', 'font-bold');
      } else {
        b.classList.remove('bg-primary', 'text-black', 'font-bold');
        b.classList.add('bg-surface-container', 'text-on-surface-variant');
      }
    });

    if (isAudioPlaying) playMechanicalClick();
  };

  window.setReelAspect = (ratio) => {
    const container = document.getElementById('reel-viewport-box');
    if (!container) return;

    container.className = 'relative w-full max-w-5xl mx-auto overflow-hidden bg-surface-container-lowest transition-all duration-300';
    if (ratio === 'scope') {
      container.classList.add('aspect-[2.39/1]');
    } else if (ratio === 'academy') {
      container.classList.add('aspect-[4/3]', 'max-w-3xl');
    } else {
      container.classList.add('aspect-[16/9]');
    }

    if (isAudioPlaying) playMechanicalClick();
  };
}

/* ----------------------------------------------------
 * 10. CURATORIAL VAULT ARCHIVE & LIVE REST SEARCH
 * ---------------------------------------------------- */
async function fetchVaultFromAPI(query = '') {
  try {
    const url = query ? `/api/vault?q=${encodeURIComponent(query)}` : '/api/vault';
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (e) {
    return null;
  }
}

function initVaultModal() {
  window.openVaultModal = async () => {
    const modal = document.getElementById('vault-modal');
    if (!modal) return;
    
    const items = await fetchVaultFromAPI('');
    renderVaultGrid(items || []);
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    if (isAudioPlaying) playMechanicalClick();
  };

  window.closeVaultModal = () => {
    const modal = document.getElementById('vault-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.style.overflow = '';
    }
  };

  const searchInput = document.getElementById('vault-search-input');
  let searchTimeout = null;
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(async () => {
        const q = e.target.value.trim();
        const items = await fetchVaultFromAPI(q);
        renderVaultGrid(items || []);
      }, 150);
    });
  }
}

function renderVaultGrid(items) {
  const container = document.getElementById('vault-items-grid');
  if (!container) return;
  container.innerHTML = '';

  if (items.length === 0) {
    container.innerHTML = `<div class="col-span-full text-center py-xl text-outline font-caption-sm">NO ARCHIVAL ENTRIES FOUND MATCHING QUERY</div>`;
    return;
  }

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'camera-frame-box bg-surface-container p-md flex flex-col justify-between gap-sm hover:bg-surface-container-high transition-colors cursor-pointer group border border-surface-container-high hover:border-primary/40';
    card.innerHTML = `
      <div class="flex items-center justify-between font-caption-sm text-caption-sm text-outline">
        <span class="text-primary font-bold">${item.vaultId || item.id}</span>
        <span>${item.year}</span>
      </div>
      <div>
        <h4 class="font-headline-sm text-on-surface text-base group-hover:text-primary transition-colors">${item.title}</h4>
        <p class="font-caption-sm text-caption-sm text-on-surface-variant pt-xs">${item.category} • ${item.rollStock || item.roll}</p>
      </div>
      <div class="flex items-center justify-between text-outline text-[12px] pt-xs border-t border-surface-variant/40">
        <span class="text-primary font-bold">ARCHIVED / RAW PASS</span>
        <span class="material-symbols-outlined text-[16px] text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
      </div>
    `;
    card.addEventListener('click', () => {
      alert(`Accessing Archival Plate [${item.vaultId || item.id}]: ${item.title}. Authenticated via Academic Commons.`);
    });
    container.appendChild(card);
  });
}

/* ----------------------------------------------------
 * 11. ADMIN & CURATOR DASHBOARD PORTAL
 * ---------------------------------------------------- */
async function loadAdminData() {
  try {
    const res = await fetch('/api/admin/metrics');
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) {
        // Can dynamically update metrics if rendered
      }
    }
  } catch (e) {
    // Graceful fallback
  }
}

function initAdminModal() {
  window.openAdminModal = () => {
    const modal = document.getElementById('admin-modal');
    if (!modal) return;
    loadAdminData();
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    if (isAudioPlaying) playMechanicalClick();
  };

  window.closeAdminModal = () => {
    const modal = document.getElementById('admin-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.style.overflow = '';
    }
  };
}

/* ----------------------------------------------------
 * 12. MOBILE NAVIGATION DRAWER
 * ---------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-drawer');
  const closeBtn = document.getElementById('mobile-drawer-close');

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      drawer.classList.remove('translate-x-full');
      document.body.style.overflow = 'hidden';
      if (isAudioPlaying) playMechanicalClick();
    });
  }

  if (closeBtn && drawer) {
    closeBtn.addEventListener('click', () => {
      drawer.classList.add('translate-x-full');
      document.body.style.overflow = '';
      if (isAudioPlaying) playMechanicalClick();
    });
  }

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (drawer) drawer.classList.add('translate-x-full');
      document.body.style.overflow = '';
    });
  });
}

/* ----------------------------------------------------
 * 13. SMOOTH ANCHOR SCROLLING
 * ---------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
}

/* ----------------------------------------------------
 * 14. SUBTLE SCROLL-TRIGGERED REVEALS
 * ---------------------------------------------------- */
function initScrollReveals() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const revealElements = document.querySelectorAll('section > div');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => {
    el.classList.add('reveal-init');
    observer.observe(el);
  });
}

/* ----------------------------------------------------
 * 15. 3D CARD PERSPECTIVE TILT (X/Y: ±2-4°)
 * ---------------------------------------------------- */
function init3DCardTilt() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!isFinePointer) return;

  const tiltCards = document.querySelectorAll('[data-tilt="true"]');
  tiltCards.forEach(card => {
    card.classList.add('tilt-card');
    
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -3.5;
      const rotateY = ((x - centerX) / centerX) * 3.5;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(6px)`;
      card.style.boxShadow = `0 16px 36px rgba(0, 0, 0, 0.6), 0 0 20px rgba(250, 204, 21, 0.08)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
      card.style.boxShadow = '';
    });
  });
}

/* ----------------------------------------------------
 * 16. MAGNETIC BUTTONS INTERACTION
 * ---------------------------------------------------- */
function initMagneticButtons() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!isFinePointer) return;

  const magneticElements = document.querySelectorAll('[data-magnetic="true"]');
  magneticElements.forEach(btn => {
    btn.classList.add('magnetic-btn');

    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const pullX = x * 0.22;
      const pullY = y * 0.22;
      
      btn.style.transform = `translate3d(${pullX.toFixed(2)}px, ${pullY.toFixed(2)}px, 0) scale(1.02)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate3d(0px, 0px, 0) scale(1)';
    });
  });
}

/* ----------------------------------------------------
 * 17. KEYBOARD NAVIGATION (Lightbox & Modals)
 * ---------------------------------------------------- */
function initKeyboardNavigation() {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closeWorkLightbox();
      window.closeRsvpModal();
      window.closeVaultModal();
      window.closeAdminModal();
      window.closeReelModal();
      window.closeAppSuccessModal();
    } else if (e.key === 'ArrowLeft') {
      const lightboxModal = document.getElementById('work-lightbox-modal');
      if (lightboxModal && !lightboxModal.classList.contains('hidden')) {
        window.prevLightboxWork();
      }
    } else if (e.key === 'ArrowRight') {
      const lightboxModal = document.getElementById('work-lightbox-modal');
      if (lightboxModal && !lightboxModal.classList.contains('hidden')) {
        window.nextLightboxWork();
      }
    }
  });
}

/* ----------------------------------------------------
 * 18. ANIMATED SECTION DIVIDERS IN RESOLUTION YELLOW
 * ---------------------------------------------------- */
function initDividerAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const dividers = document.querySelectorAll('.animated-divider-line');
  if (dividers.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('drawn');
      }
    });
  }, { threshold: 0.1 });

  dividers.forEach(d => observer.observe(d));
}

/* ----------------------------------------------------
 * 19. DYNAMIC SITE SYNC (Homepage CMS, Works, Events, Team from REST API)
 * ---------------------------------------------------- */
async function initDynamicSiteSync() {
  try {
    // 1. Fetch live published Homepage CMS Content
    const contentRes = await fetch('/api/content/home');
    if (contentRes.ok) {
      const contentJson = await contentRes.json();
      if (contentJson.success && contentJson.data) {
        const c = contentJson.data;

        // --- A. HERO SECTION HYDRATION ---
        if (c.hero) {
          const heroBadge = document.querySelector('#hero-section [data-cursor="EXPLORE"] .inline-flex span.font-bold');
          if (heroBadge && c.hero.badgeLabel) heroBadge.textContent = c.hero.badgeLabel;

          const heroHeading = document.querySelector('#hero-section h1');
          if (heroHeading && (c.hero.headingLine1 || c.hero.headingLine2)) {
            heroHeading.innerHTML = `
              ${escapeHTML(c.hero.headingLine1 || 'We Frame')} <br/>
              <span class="font-display-xl italic text-primary font-normal">${escapeHTML(c.hero.headingLine2 || 'The Moment.')}</span>
            `;
          }

          const heroSub = document.querySelector('#hero-section p.font-body-lg');
          if (heroSub && c.hero.subheading) {
            heroSub.textContent = c.hero.subheading;
          }

          const primaryCta = document.querySelector('#hero-section a.magnetic-btn');
          if (primaryCta) {
            if (c.hero.primaryCtaUrl) primaryCta.setAttribute('href', c.hero.primaryCtaUrl);
            const primarySpan = primaryCta.querySelector('span.relative');
            if (primarySpan && c.hero.primaryCtaText) {
              primarySpan.innerHTML = `
                ${escapeHTML(c.hero.primaryCtaText)}
                <span class="material-symbols-outlined text-[16px] transition-transform group-hover:translate-y-1">arrow_downward</span>
              `;
            }
          }

          const secondaryCta = document.querySelector('#hero-section button.magnetic-btn[onclick="openReelModal()"]');
          if (secondaryCta && c.hero.secondaryCtaText) {
            const secSpan = secondaryCta.querySelector('span:last-child');
            if (secSpan) secSpan.textContent = c.hero.secondaryCtaText;
          }

          // Hero Media Backdrop (Image vs Video)
          const heroBackdropBox = document.querySelector('#hero-section .relative.w-full.h-\\[760px\\]') || document.querySelector('#hero-section .relative.w-full');
          const heroBgDiv = heroBackdropBox ? heroBackdropBox.querySelector('.bg-cover') : null;
          
          if (heroBgDiv) {
            if (c.hero.backdropType === 'video' && c.hero.backdropVideo) {
              heroBgDiv.classList.add('hidden');
              let heroVideo = heroBackdropBox.querySelector('video.hero-live-video');
              if (!heroVideo) {
                heroVideo = document.createElement('video');
                heroVideo.className = 'hero-live-video absolute inset-0 w-full h-full object-cover filter brightness-75 contrast-125';
                heroVideo.setAttribute('autoplay', '');
                heroVideo.setAttribute('muted', '');
                heroVideo.setAttribute('loop', '');
                heroVideo.setAttribute('playsinline', '');
                heroBackdropBox.insertBefore(heroVideo, heroBgDiv);
              }
              heroVideo.src = c.hero.backdropVideo;
              heroVideo.classList.remove('hidden');
              heroVideo.play().catch(() => {});
            } else {
              const heroVideo = heroBackdropBox ? heroBackdropBox.querySelector('video.hero-live-video') : null;
              if (heroVideo) heroVideo.classList.add('hidden');
              heroBgDiv.classList.remove('hidden');
              if (c.hero.backdropImage) {
                heroBgDiv.style.backgroundImage = `url('${c.hero.backdropImage}')`;
              }
            }
          }
        }

        // --- B. MANIFESTO & METRICS HYDRATION ---
        if (c.manifesto) {
          const m = c.manifesto;
          const tagEl = document.querySelector('#manifesto .inline-flex span:nth-child(2)');
          if (tagEl && m.tag) tagEl.textContent = m.tag;

          const headingEl = document.querySelector('#manifesto h2');
          if (headingEl && (m.heading || m.italicHighlight)) {
            headingEl.innerHTML = `
              ${escapeHTML(m.heading || "We don't just capture moments.")} <br/>
              <span class="italic font-display-xl font-normal text-primary">${escapeHTML(m.italicHighlight || 'We give them a point of view.')}</span>
            `;
          }

          const bodyEl = document.querySelector('#manifesto p.font-body-lg');
          if (bodyEl && m.body) bodyEl.textContent = m.body;

          // 4 Metric mosaic cards
          const statCards = document.querySelectorAll('#manifesto .tilt-card span.font-headline-sm');
          if (statCards.length >= 4) {
            if (m.productionsCount) statCards[0].textContent = m.productionsCount;
            if (m.laurelsCount) statCards[1].textContent = m.laurelsCount;
            if (m.preservedFramesCount) statCards[2].textContent = m.preservedFramesCount;
            if (m.creatorsCount) statCards[3].textContent = m.creatorsCount;
          }

          // Editorial Portrait
          const portraitImg = document.querySelector('#manifesto .photo-card-hover');
          if (portraitImg && m.portraitUrl) {
            portraitImg.style.backgroundImage = `url('${m.portraitUrl}')`;
          }

          const portraitLead = document.querySelector('#manifesto .bottom-xs .text-on-surface');
          if (portraitLead && m.portraitLead) portraitLead.textContent = m.portraitLead;

          const portraitExif = document.querySelector('#manifesto .bottom-xs .text-primary.font-bold');
          if (portraitExif && m.portraitExif) portraitExif.textContent = m.portraitExif;

          const quoteTitle = document.querySelector('#manifesto .-bottom-8 p.font-caption-sm');
          if (quoteTitle && m.quoteTitle) quoteTitle.textContent = m.quoteTitle;

          const quoteBody = document.querySelector('#manifesto .-bottom-8 p.font-body-md');
          if (quoteBody && m.quoteBody) quoteBody.textContent = m.quoteBody;
        }

        // --- C. FEATURED WORKS HYDRATION ---
        if (Array.isArray(c.featuredWorks) && c.featuredWorks.length > 0) {
          const worksGrid = document.getElementById('works-grid');
          if (worksGrid) {
            workKeys = [];
            let gridHtml = '';

            c.featuredWorks.forEach((w, idx) => {
              const key = w.workCode ? w.workCode.toLowerCase().replace(/[^a-z0-9]/g, '-') : `res-0${idx + 1}`;
              workKeys.push(key);
              worksData[key] = {
                title: w.title,
                code: w.workCode,
                discipline: w.disciplineLabel || (w.discipline === 'narrative' ? 'NARRATIVE CINEMA' : (w.discipline === 'photo' ? '35MM STILL' : (w.discipline === 'sound' ? 'SOUND DESIGN' : 'EXHIBITION'))),
                format: w.format || '2.39:1 CINEMASCOPE // 4K 10-BIT',
                camera: w.camera || 'RED V-RAPTOR 8K VV // COOKE ANAMORPHIC /I',
                synopsis: w.synopsis || w.shortDescription || '',
                crew: w.crew || '',
                laurels: w.laurels || [],
                image: w.coverImage || w.image
              };

              const gridSpan = w.gridSpan || (idx === 0 ? 'md:col-span-8' : (idx === 1 ? 'md:col-span-4' : (idx === 2 ? 'md:col-span-5' : 'md:col-span-7')));
              let aspectClass = 'aspect-[16/9]';
              if (w.aspectRatio === '4:5' || idx === 1) aspectClass = 'aspect-[4/5]';
              else if (w.aspectRatio === '16:10' || idx === 2) aspectClass = 'aspect-[16/10]';
              else if (w.aspectRatio === '1:1') aspectClass = 'aspect-square';

              const cursorType = w.discipline === 'narrative' ? 'PLAY' : (w.discipline === 'photo' ? 'VIEW' : 'BROWSE');

              gridHtml += `
                <div class="camera-frame-box tilt-card ${gridSpan} group relative bg-surface-container-low cursor-pointer overflow-hidden transition-all duration-300 border border-surface-container-high hover:border-primary/50" data-cursor="${cursorType}" data-work-category="${w.discipline || 'narrative'}" data-work-id="${key}" data-tilt="true">
                  <div class="w-full ${aspectClass} overflow-hidden relative">
                    <div class="photo-card-hover w-full h-full bg-cover bg-center filter brightness-90 group-hover:brightness-100" style="background-image: url('${w.coverImage || w.image}')"></div>
                    <div class="absolute top-md left-md bg-surface-container-lowest/90 backdrop-blur-md px-sm py-micro font-caption-sm text-caption-sm text-primary uppercase font-bold border border-primary/30">
                      ${escapeHTML(w.format || '2.39:1 CINEMASCOPE // 4K 10-BIT')}
                    </div>
                    <div class="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent to-transparent opacity-80"></div>
                  </div>
                  <div class="p-lg bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-md">
                    <div>
                      <span class="font-caption-sm text-caption-sm text-primary uppercase tracking-widest font-bold">${escapeHTML(w.workCode || `#RES-2026-0${idx+1}`)} • ${escapeHTML((w.disciplineLabel || w.discipline || 'PORTFOLIO').toUpperCase())}</span>
                      <h3 class="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">${escapeHTML(w.title)}</h3>
                      <p class="font-body-md text-body-md text-on-surface-variant">${escapeHTML(w.crew || w.shortDescription || '')}</p>
                    </div>
                    <div class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface group-hover:bg-primary group-hover:text-black transition-all shrink-0">
                      <span class="material-symbols-outlined text-[20px]">arrow_outward</span>
                    </div>
                  </div>
                </div>
              `;
            });

            worksGrid.innerHTML = gridHtml;
            bindWorkItemClicks();
            if (window.bindCursorHover) {
              window.bindCursorHover(worksGrid.querySelectorAll('[data-cursor]'));
            }
            if (typeof init3DCardTilt === 'function') {
              init3DCardTilt();
            }
          }
        }

        // --- D. FEATURED EVENTS HYDRATION ---
        if (Array.isArray(c.featuredEvents) && c.featuredEvents.length > 0) {
          const eventsGrid = document.getElementById('events-grid');
          if (eventsGrid) {
            eventsGrid.innerHTML = c.featuredEvents.map(ev => {
              const seats = ev.seatsRemaining !== undefined ? ev.seatsRemaining : (ev.seatsLeft !== undefined ? ev.seatsLeft : 10);
              const isSoldOut = seats <= 0;
              const dateStr = ev.dateDisplay || formatEventDate(ev.date) || 'UPCOMING 2026';

              return `
                <div class="camera-frame-box tilt-card bg-surface-container-low p-xl flex flex-col justify-between gap-xl relative overflow-hidden group hover:bg-surface-container transition-colors border border-surface-container-high hover:border-primary/50" data-cursor="EXPLORE" data-event-category="${ev.category || 'workshops'}" data-tilt="true">
                  <div class="flex items-center justify-between gap-sm font-caption-sm text-caption-sm">
                    <span class="px-sm py-micro ${isSoldOut ? 'bg-red-950/60 text-red-300 border border-red-500/40' : 'bg-primary text-black'} uppercase font-bold">${isSoldOut ? 'REGISTRATION CLOSED' : `SEATS OPEN // ${seats} LEFT`}</span>
                    <span class="text-primary font-bold">${escapeHTML(dateStr)}</span>
                  </div>
                  <div class="space-y-sm">
                    <h3 class="font-headline-md text-headline-md uppercase tracking-tight text-on-surface group-hover:text-primary transition-colors">
                      ${escapeHTML(ev.title)}
                    </h3>
                    <p class="font-body-lg text-body-lg text-on-surface-variant">
                      ${escapeHTML(ev.description || '')}
                    </p>
                  </div>
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-sm pt-md border-t border-surface-container-high">
                    <div class="font-caption-sm text-caption-sm text-outline">
                      <span>LOCATION: ${escapeHTML((ev.location || 'CAMPUS BASE').toUpperCase())}</span>
                    </div>
                    <button class="px-lg py-xs bg-surface-container-high text-on-surface font-label-md text-label-md uppercase tracking-wider group-hover:bg-primary group-hover:text-black font-bold transition-all flex items-center gap-xs magnetic-btn disabled:opacity-50 disabled:cursor-not-allowed" data-magnetic="true" onclick="openRsvpModal('${(ev.title || '').replace(/'/g, "\\'")}', '${(dateStr || '').replace(/'/g, "\\'")}', '${(ev.location || '').replace(/'/g, "\\'")}', ${seats}, '${ev._id || ev.id || ''}')" type="button" ${isSoldOut ? 'disabled' : ''}>
                      <span>${isSoldOut ? 'Sold Out' : 'Reserve Seat'}</span>
                      <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              `;
            }).join('');

            if (window.bindCursorHover) {
              window.bindCursorHover(eventsGrid.querySelectorAll('[data-cursor]'));
            }
            if (typeof init3DCardTilt === 'function') {
              init3DCardTilt();
            }
          }
        }

        // --- E. ANNOUNCEMENTS HYDRATION ---
        const banner = document.getElementById('global-announcement-banner');
        const annText = document.getElementById('announcement-text');
        const annCta = document.getElementById('announcement-cta');
        if (banner && c.announcement) {
          if (c.announcement.active && c.announcement.text) {
            banner.classList.remove('hidden');
            if (annText) annText.textContent = c.announcement.text;
            if (annCta) {
              annCta.textContent = (c.announcement.actionLabel || 'Apply Now') + ' →';
              annCta.href = c.announcement.url || '#recruitment-portal';
            }
          } else {
            banner.classList.add('hidden');
          }
        }

        // --- F. SECTION VISIBILITY CONTROLS ---
        if (c.sectionVisibility) {
          const vis = c.sectionVisibility;
          const heroSec = document.getElementById('hero-section');
          const manifestoSec = document.getElementById('manifesto');
          const worksSec = document.getElementById('selected-works');
          const opticsSec = document.getElementById('optical-engine');
          const reelSec = document.getElementById('film-reel');
          const eventsSec = document.getElementById('events');
          const teamSec = document.getElementById('team');
          const recruitSec = document.getElementById('recruitment-portal');

          if (heroSec) heroSec.style.display = vis.hero === false ? 'none' : '';
          if (manifestoSec) manifestoSec.style.display = vis.manifesto === false ? 'none' : '';
          if (worksSec) worksSec.style.display = vis.works === false ? 'none' : '';
          if (opticsSec) opticsSec.style.display = vis.optics === false ? 'none' : '';
          if (reelSec) reelSec.style.display = vis.reel === false ? 'none' : '';
          if (eventsSec) eventsSec.style.display = vis.events === false ? 'none' : '';
          if (teamSec) teamSec.style.display = vis.team === false ? 'none' : '';
          if (recruitSec) recruitSec.style.display = vis.recruitment === false ? 'none' : '';
        }
      }
    }

    // 2. Sync Team Members
    const teamRes = await fetch('/api/team');
    if (teamRes.ok) {
      const teamJson = await teamRes.json();
      if (teamJson.success && Array.isArray(teamJson.data) && teamJson.data.length > 0) {
        const teamGrid = document.querySelector('#team .grid');
        if (teamGrid) {
          teamGrid.innerHTML = teamJson.data.map((m, idx) => {
            const portrait = m.portraitUrl || m.image || '/assets/images/placeholder-portrait.jpg';
            const badge = m.disciplineCode || m.badge || (m.discipline ? m.discipline.substring(0, 3).toUpperCase() + ` • 0${idx + 1}` : `LEAD • 0${idx + 1}`);

            return `
              <div class="camera-frame-box tilt-card bg-surface-container-low p-sm flex flex-col gap-sm group border border-surface-container-high hover:border-primary/40" data-cursor="MEET" data-tilt="true">
                <div class="aspect-[3/4] overflow-hidden bg-surface-container-highest relative">
                  <div class="photo-card-hover w-full h-full bg-cover bg-center grayscale contrast-125" style="background-image: url('${portrait}')"></div>
                  <div class="absolute bottom-xs left-xs bg-surface-container-lowest/90 px-xs py-micro font-caption-sm text-caption-sm text-primary font-bold border border-primary/30">
                    ${badge}
                  </div>
                </div>
                <div>
                  <h4 class="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">${escapeHTML(m.name)}</h4>
                  <p class="font-caption-sm text-caption-sm text-primary uppercase font-bold">${escapeHTML(m.role)}</p>
                  <p class="font-caption-sm text-caption-sm text-outline pt-xs group-hover:text-on-surface-variant transition-colors">${escapeHTML(m.handle || '')}</p>
                </div>
              </div>
            `;
          }).join('');

          if (window.bindCursorHover) {
            window.bindCursorHover(teamGrid.querySelectorAll('[data-cursor]'));
          }
          if (typeof init3DCardTilt === 'function') {
            init3DCardTilt();
          }
        }
      }
    }

    // 3. Sync About & Milestones (Step 9)
    try {
      const aboutRes = await fetch('/api/content/about');
      if (aboutRes.ok) {
        const aboutJson = await aboutRes.json();
        if (aboutJson.success && aboutJson.data) {
          window.resolutionAboutData = aboutJson.data;
          const ab = aboutJson.data;

          // Hydrate Milestones timeline container if present on the page
          const milestoneTimeline = document.getElementById('milestones-timeline-container');
          if (milestoneTimeline && Array.isArray(ab.milestones) && ab.milestones.length > 0) {
            milestoneTimeline.innerHTML = ab.milestones.map(m => `
              <div class="milestone-entry border-l-2 border-primary/60 pl-md py-xs space-y-xs">
                <span class="font-mono text-primary text-sm font-bold">${escapeHTML(m.year)}</span>
                <h4 class="font-bold text-on-surface text-base">${escapeHTML(m.title)}</h4>
                <p class="text-on-surface-variant text-xs leading-relaxed">${escapeHTML(m.description)}</p>
              </div>
            `).join('');
          }
        }
      }
    } catch (aboutErr) {
      console.warn('About data hydration fallback:', aboutErr);
    }
  } catch (err) {
    console.warn('API sync fallback to default embedded markup:', err);
  }
}

// Utility: HTML Escaping
function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Utility: Event Date Display Formatter
function formatEventDate(dateInput) {
  if (!dateInput) return 'UPCOMING 2026';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
}
