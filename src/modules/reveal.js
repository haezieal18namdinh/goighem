(function () {
  function initReveal() {
    const elements = document.querySelectorAll('.reveal');

    if (!elements.length) {
      return;
    }

    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => {
        element.classList.add('is-visible');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.14,
        rootMargin: '0px 0px -10% 0px',
      },
    );

    elements.forEach((element) => {
      if (element.dataset.revealDelay) {
        element.style.setProperty('--reveal-delay', element.dataset.revealDelay);
      }

      observer.observe(element);
    });
  }

  window.GoiGhem = window.GoiGhem || {};
  window.GoiGhem.initReveal = initReveal;
}());
