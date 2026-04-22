(function () {
  function initSlider() {
    const slider = document.querySelector('[data-slider]');

    if (!slider) {
      return;
    }

    const viewport = slider.querySelector('[data-slider-viewport]');
    const track = slider.querySelector('[data-slider-track]');
    const prevButton = slider.querySelector('[data-slider-prev]');
    const nextButton = slider.querySelector('[data-slider-next]');

    if (!viewport || !track || !prevButton || !nextButton) {
      return;
    }

    const sourceSlides = Array.from(track.children).map((slide) => slide.cloneNode(true));
    const transitionValue = 'transform 650ms cubic-bezier(0.22, 1, 0.36, 1)';
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobileQuery = window.matchMedia('(max-width: 767px)');
    const autoplayDelay = 4200;

    let mode = '';
    let slideSpan = 0;
    let autoplayId = 0;
    let resizeTimer = 0;
    let isTransitioning = false;
    let activeDirection = 0;

    const clearTrack = () => {
      track.innerHTML = '';
      sourceSlides.forEach((slide) => {
        track.appendChild(slide.cloneNode(true));
      });
      track.style.transition = 'none';
      track.style.transform = 'translate3d(0, 0, 0)';
      viewport.scrollLeft = 0;
      isTransitioning = false;
      activeDirection = 0;
    };

    const measureSlideSpan = () => {
      const firstSlide = track.querySelector('.product-card');

      if (!firstSlide) {
        return 0;
      }

      const trackStyles = window.getComputedStyle(track);
      const gap = parseFloat(trackStyles.columnGap || trackStyles.gap || '0');
      return firstSlide.getBoundingClientRect().width + gap;
    };

    const stopAutoplay = () => {
      if (autoplayId) {
        window.clearInterval(autoplayId);
        autoplayId = 0;
      }
    };

    const startAutoplay = () => {
      if (reduceMotion || mode !== 'loop') {
        return;
      }

      stopAutoplay();
      autoplayId = window.setInterval(() => {
        move(1);
      }, autoplayDelay);
    };

    const resetAutoplay = () => {
      stopAutoplay();
      startAutoplay();
    };

    const buildLoopMode = () => {
      clearTrack();
      slider.classList.remove('is-native-scroll');
      slideSpan = measureSlideSpan();
      track.style.transition = 'none';
      track.style.transform = 'translate3d(0, 0, 0)';
    };

    const buildNativeMode = () => {
      clearTrack();
      slider.classList.add('is-native-scroll');
      mode = 'native';
      stopAutoplay();
    };

    const syncMode = () => {
      const nextMode = mobileQuery.matches ? 'native' : 'loop';

      if (mode === nextMode) {
        if (nextMode === 'loop') {
          buildLoopMode();
          startAutoplay();
        }
        return;
      }

      stopAutoplay();
      mode = nextMode;

      if (nextMode === 'native') {
        buildNativeMode();
      } else {
        buildLoopMode();
        startAutoplay();
      }
    };

    const moveNative = (direction) => {
      const step = measureSlideSpan() || viewport.getBoundingClientRect().width * 0.84;
      viewport.scrollBy({
        left: step * direction,
        behavior: 'smooth',
      });
    };

    const moveLoop = (direction) => {
      if (isTransitioning || !slideSpan) {
        return;
      }

      if (reduceMotion) {
        if (direction > 0 && track.firstElementChild) {
          track.appendChild(track.firstElementChild);
        } else if (direction < 0 && track.lastElementChild) {
          track.prepend(track.lastElementChild);
        }
        track.style.transition = 'none';
        track.style.transform = 'translate3d(0, 0, 0)';
        return;
      }

      slideSpan = measureSlideSpan();
      activeDirection = direction;
      isTransitioning = true;

      if (direction > 0) {
        track.style.transition = transitionValue;
        track.style.transform = `translate3d(${-slideSpan}px, 0, 0)`;
        return;
      }

      if (track.lastElementChild) {
        track.style.transition = 'none';
        track.prepend(track.lastElementChild);
        track.style.transform = `translate3d(${-slideSpan}px, 0, 0)`;

        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            track.style.transition = transitionValue;
            track.style.transform = 'translate3d(0, 0, 0)';
          });
        });
      }
    };

    const move = (direction) => {
      if (mode === 'native') {
        moveNative(direction);
        return;
      }

      moveLoop(direction);
    };

    nextButton.addEventListener('click', () => {
      move(1);
      resetAutoplay();
    });

    prevButton.addEventListener('click', () => {
      move(-1);
      resetAutoplay();
    });

    track.addEventListener('transitionend', (event) => {
      if (event.target !== track || !isTransitioning || mode !== 'loop') {
        return;
      }

      if (activeDirection > 0 && track.firstElementChild) {
        track.appendChild(track.firstElementChild);
      }

      track.style.transition = 'none';
      track.style.transform = 'translate3d(0, 0, 0)';
      isTransitioning = false;
      activeDirection = 0;
    });

    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);
    slider.addEventListener('focusin', stopAutoplay);
    slider.addEventListener('focusout', (event) => {
      if (slider.contains(event.relatedTarget)) {
        return;
      }

      startAutoplay();
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    });

    window.addEventListener('resize', () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        syncMode();
      }, 180);
    });

    syncMode();
  }

  window.GoiGhem = window.GoiGhem || {};
  window.GoiGhem.initSlider = initSlider;
}());
