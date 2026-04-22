function initStaticForms() {
  const forms = document.querySelectorAll('[data-static-form]');

  forms.forEach((form) => {
    const feedback = form.querySelector('[data-form-feedback]');
    const submitButton = form.querySelector('button[type="submit"]');

    if (submitButton && !submitButton.dataset.defaultLabel) {
      submitButton.dataset.defaultLabel = submitButton.dataset.buttonLabel || submitButton.textContent.trim();
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.setAttribute('aria-busy', 'true');
        submitButton.textContent = 'Đã nhận';
      }

      if (feedback) {
        feedback.textContent = form.id === 'newsletterForm'
          ? 'Bạn đã đăng ký thành công bản tin Gói Ghém.'
          : 'Cảm ơn bạn. Gói Ghém sẽ liên hệ trong vòng 24 giờ.';
      }

      form.reset();

      window.setTimeout(() => {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.removeAttribute('aria-busy');
          submitButton.textContent = submitButton.dataset.defaultLabel || 'Gửi';
        }
      }, 2200);
    });
  });
}

function initCustomSelects() {
  const selects = document.querySelectorAll('[data-custom-select]');

  if (!selects.length) {
    return;
  }

  const closeAll = (except) => {
    selects.forEach((select) => {
      if (select === except) {
        return;
      }

      const trigger = select.querySelector('[data-custom-select-trigger]');
      select.classList.remove('is-open');

      if (trigger) {
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  };

  selects.forEach((customSelect) => {
    const nativeSelect = customSelect.querySelector('.native-select');
    const trigger = customSelect.querySelector('[data-custom-select-trigger]');
    const label = customSelect.querySelector('[data-custom-select-label]');
    const options = Array.from(customSelect.querySelectorAll('[data-custom-select-option]'));

    if (!nativeSelect || !trigger || !label || !options.length) {
      return;
    }

    const syncValue = (value) => {
      nativeSelect.value = value;

      options.forEach((option) => {
        const isSelected = option.dataset.value === value;
        option.classList.toggle('is-selected', isSelected);
        option.setAttribute('aria-selected', String(isSelected));

        if (isSelected) {
          label.textContent = option.textContent.trim();
        }
      });
    };

    trigger.addEventListener('click', () => {
      const willOpen = !customSelect.classList.contains('is-open');
      closeAll(customSelect);
      customSelect.classList.toggle('is-open', willOpen);
      trigger.setAttribute('aria-expanded', String(willOpen));
    });

    options.forEach((option) => {
      option.addEventListener('click', () => {
        syncValue(option.dataset.value || option.textContent.trim());
        customSelect.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      });
    });

    const form = customSelect.closest('form');
    if (form) {
      form.addEventListener('reset', () => {
        window.setTimeout(() => {
          const defaultValue = nativeSelect.options[0] ? nativeSelect.options[0].value : '';
          syncValue(defaultValue);
          customSelect.classList.remove('is-open');
          trigger.setAttribute('aria-expanded', 'false');
        }, 0);
      });
    }

    syncValue(nativeSelect.value);
  });

  document.addEventListener('click', (event) => {
    if (event.target.closest('[data-custom-select]')) {
      return;
    }

    closeAll();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeAll();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const app = window.GoiGhem || {};

  if (typeof app.initIntro === 'function') {
    app.initIntro();
  }

  if (typeof app.initNavbar === 'function') {
    app.initNavbar();
  }

  if (typeof app.initReveal === 'function') {
    app.initReveal();
  }

  if (typeof app.initAppleScroll === 'function') {
    app.initAppleScroll();
  }

  if (typeof app.initSlider === 'function') {
    app.initSlider();
  }

  initCustomSelects();
  initStaticForms();
});
