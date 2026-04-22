(function () {
  function initNavbar() {
    const nav = document.getElementById('mainNav');
    const toggle = document.querySelector('[data-nav-toggle]');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeLinks = document.querySelectorAll('[data-nav-close]');

    if (!nav) {
      return;
    }

    let ticking = false;
    let hideTimer = 0;

    const updateNavbar = () => {
      nav.classList.toggle('is-scrolled', window.scrollY > 28 || nav.classList.contains('is-menu-open'));
      ticking = false;
    };

    const closeMenu = () => {
      if (!toggle || !mobileMenu) {
        return;
      }

      nav.classList.remove('is-menu-open');
      mobileMenu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => {
        if (!nav.classList.contains('is-menu-open')) {
          mobileMenu.hidden = true;
        }
      }, 220);
      updateNavbar();
    };

    const openMenu = () => {
      if (!toggle || !mobileMenu) {
        return;
      }

      mobileMenu.hidden = false;
      nav.classList.add('is-menu-open');
      document.body.classList.add('nav-open');
      toggle.setAttribute('aria-expanded', 'true');
      window.requestAnimationFrame(() => {
        mobileMenu.classList.add('is-open');
      });
      updateNavbar();
    };

    const onScroll = () => {
      if (ticking) {
        return;
      }

      ticking = true;
      window.requestAnimationFrame(updateNavbar);
    };

    if (toggle && mobileMenu) {
      toggle.addEventListener('click', () => {
        if (nav.classList.contains('is-menu-open')) {
          closeMenu();
        } else {
          openMenu();
        }
      });

      closeLinks.forEach((link) => {
        link.addEventListener('click', closeMenu);
      });

      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && nav.classList.contains('is-menu-open')) {
          closeMenu();
        }
      });

      window.addEventListener('resize', () => {
        if (window.innerWidth > 900) {
          closeMenu();
        }
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    updateNavbar();
  }

  window.GoiGhem = window.GoiGhem || {};
  window.GoiGhem.initNavbar = initNavbar;
}());
