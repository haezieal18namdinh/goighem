(function () {
  function initIntro() {
    const intro = document.getElementById('intro');
    const pageShell = document.getElementById('page-shell');

    if (!pageShell) {
      return;
    }

    if (!intro) {
      pageShell.classList.remove('page-shell--pending');
      pageShell.classList.add('is-ready');
      return;
    }

    document.body.classList.add('no-scroll');

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const introDuration = reduceMotion ? 220 : 1150;
    const fadeDuration = reduceMotion ? 120 : 650;

    window.requestAnimationFrame(() => {
      intro.classList.add('is-visible');
    });

    window.setTimeout(() => {
      intro.classList.add('is-exiting');
      pageShell.classList.remove('page-shell--pending');
      pageShell.classList.add('is-ready');

      window.setTimeout(() => {
        document.body.classList.remove('no-scroll');
        intro.remove();
      }, fadeDuration);
    }, introDuration);
  }

  window.GoiGhem = window.GoiGhem || {};
  window.GoiGhem.initIntro = initIntro;
}());
