function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

(function () {
  function initAppleScroll() {
    const section = document.querySelector('.apple-section');
    const background = document.getElementById('apple-bg');
    const text = document.getElementById('apple-text');

    if (!section || !background || !text) {
      return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobileQuery = window.matchMedia('(max-width: 900px)');
    let rafId = 0;

    const setStaticState = () => {
      background.style.transform = 'scale(1)';
      text.style.opacity = '1';
      text.style.transform = 'translate3d(0, 0, 0)';
    };

    const render = () => {
      if (mobileQuery.matches || reduceMotion) {
        setStaticState();
        rafId = 0;
        return;
      }

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const maxDistance = Math.max(rect.height - viewportHeight, 1);
      const progress = clamp((-rect.top) / maxDistance, 0, 1);
      const easedScale = 1 - Math.pow(1 - progress, 3);
      const textProgress = clamp((progress - 0.16) / 0.32, 0, 1);

      background.style.transform = `translate3d(0, ${progress * 14}px, 0) scale(${1.25 - easedScale * 0.25})`;
      text.style.opacity = String(textProgress);
      text.style.transform = `translate3d(0, ${(1 - textProgress) * 50}px, 0)`;

      rafId = 0;
    };

    const requestRender = () => {
      if (rafId) {
        return;
      }

      rafId = window.requestAnimationFrame(render);
    };

    window.addEventListener('scroll', requestRender, { passive: true });
    window.addEventListener('resize', requestRender);
    requestRender();
  }

  window.GoiGhem = window.GoiGhem || {};
  window.GoiGhem.initAppleScroll = initAppleScroll;
}());
