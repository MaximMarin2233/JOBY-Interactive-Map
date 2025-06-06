import GraphModal from 'graph-modal';
import vars from '../_vars';

import { checkUser } from "./checkUser";
import { addToLS } from "./addToLS";
import { checkEmail } from "./checkEmail";
import { checkCode } from "./checkCode";
import { passwordNew } from "./passwordNew";
import { validForm } from "./validForm";
import { getPhone } from "./getPhone";

export function form() {
  const modal = new GraphModal();

  let usingInf = localStorage.getItem('using-inf');

  if (!usingInf) {
    modal.open('using-website');
    localStorage.setItem('using-inf', true)
  }


  validForm('.form--sign-up', [
    {
      ruleSelector: '#sign-up-email',
      rules: [
        {
          rule: 'required',
          errorMessage: 'Введите E-mail!',
        },
        {
          rule: 'email',
          errorMessage: 'Некорректный E-mail!',
        },
        {
          rule: 'maxLength',
          value: 230,
          errorMessage: 'Максимальная длина - 230 символов!',
        },
      ]
    },
    {
      ruleSelector: '#sign-up-password',
      rules: [
        {
          rule: 'required',
          errorMessage: 'Введите пароль!',
        },
        {
          rule: 'minLength',
          value: 5,
          errorMessage: 'Минимальная длина - 5 символов!',
        },
        {
          rule: 'maxLength',
          value: 230,
          errorMessage: 'Максимальная длина - 230 символов!',
        },
      ]
    },
    {
      ruleSelector: '#sign-up-password-repeat',
      rules: [
        {
          rule: 'function',
          validator: function () {
            const password1 = document.querySelector('.form--sign-up').querySelector('#sign-up-password');
            const password2 = document.querySelector('.form--sign-up').querySelector('#sign-up-password-repeat');
            return password1.value === password2.value;
          },
          errorMessage: 'Пароли должны совпадать!',
        },
      ]
    },
  ], (ev) => {
    const currentForm = document.querySelector('.form--sign-up');
    const modalContainer = currentForm.closest('.graph-modal__container');
    const captchaText = currentForm.querySelector('.graph-modal__captcha-text');

    const xmlhttp = new XMLHttpRequest();

    if (grecaptcha.getResponse(vars.captcha1)) {

      const email = currentForm.querySelector('#sign-up-email').value.replace(/<[^>]+>/g, '');

      captchaText.innerHTML = '';

      modalContainer.classList.add('anim-block');

      checkEmail('libs/check-email.php', email, (data) => {
        if (!data.response) {

          const password = currentForm.querySelector('#sign-up-password').value.replace(/<[^>]+>/g, '');
          const code = '';
          const coords = '';
          const phone = '';
          const placemarkTitle = '';
          const placemarkText = '';
          const placemarkDate = '';

          xmlhttp.open('post', 'libs/sign-up.php', true);
          xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
          xmlhttp.send("email=" + encodeURIComponent(email) +
                      "&password=" + encodeURIComponent(password) +
                      "&code=" + encodeURIComponent(code) +
                      "&coords=" + encodeURIComponent(coords) +
                      "&phone=" + encodeURIComponent(phone) +
                      "&placemarkTitle=" + encodeURIComponent(placemarkTitle) +
                      "&placemarkText=" + encodeURIComponent(placemarkText) +
                      "&placemarkDate=" + encodeURIComponent(placemarkDate));

          xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4) {
              if (xmlhttp.status === 200) {
                checkUser('libs/sign-in.php', email, password, (data) => {
                  setTimeout(() => {
                    modalContainer.classList.remove('anim-block');
                    ev.target.reset();
                    grecaptcha.reset(vars.captcha1);

                    modal.close();

                    if (data.response) {
                      addToLS(email, data.userPassword);
                      location.reload();
                    }
                  }, 2000);
                });
              }
            }
          }

        } else {
          modalContainer.classList.remove('anim-block');
          grecaptcha.reset(vars.captcha1);

          captchaText.innerHTML = `
            <div class="just-validate-error-label" style="color: rgb(184, 17, 17);">Введённый почтовый адрес существует!</div>
          `;
        }
      });


    } else {
      captchaText.innerHTML = `
        <div class="just-validate-error-label" style="color: rgb(184, 17, 17);">Подтвердите что вы не робот</div>
      `;
    }
  });

  validForm('.form--sign-in', [
    {
      ruleSelector: '#sign-in-email',
      rules: [
        {
          rule: 'required',
          errorMessage: 'Введите E-mail!',
        },
        {
          rule: 'email',
          errorMessage: 'Некорректный E-mail!',
        },
        {
          rule: 'maxLength',
          value: 230,
          errorMessage: 'Максимальная длина - 230 символов!',
        },
      ]
    },
    {
      ruleSelector: '#sign-in-password',
      rules: [
        {
          rule: 'required',
          errorMessage: 'Введите пароль!',
        },
        {
          rule: 'minLength',
          value: 5,
          errorMessage: 'Минимальная длина - 5 символов!',
        },
        {
          rule: 'maxLength',
          value: 230,
          errorMessage: 'Максимальная длина - 230 символов!',
        },
      ]
    },
  ], (ev) => {
    const currentForm = document.querySelector('.form--sign-in');
    const modalContainer = currentForm.closest('.graph-modal__container');
    const captchaText = currentForm.querySelector('.graph-modal__captcha-text');

    if (grecaptcha.getResponse(vars.captcha2)) {
      captchaText.innerHTML = '';

      modalContainer.classList.add('anim-block');

      const email = currentForm.querySelector('#sign-in-email').value.replace(/<[^>]+>/g, '');
      const password = currentForm.querySelector('#sign-in-password').value.replace(/<[^>]+>/g, '');

      checkUser('libs/sign-in.php', email, password, (data) => {
        setTimeout(() => {
          modalContainer.classList.remove('anim-block');
          grecaptcha.reset(vars.captcha2);

          if (data.response) {
            captchaText.innerHTML = '';

            ev.target.reset();
            modal.close();

            addToLS(email, data.userPassword);
            location.reload();
          } else {
            captchaText.innerHTML = `
              <div class="just-validate-error-label" style="color: rgb(184, 17, 17);">Неправильный логин или пароль</div>
            `;
          }
        }, 2000);
      });

    } else {
      captchaText.innerHTML = `
        <div class="just-validate-error-label" style="color: rgb(184, 17, 17);">Подтвердите что вы не робот</div>
      `;
    }
  });

  let passwordCodeEmail = false;

  validForm('.form--password-reset', [
    {
      ruleSelector: '#password-reset-email',
      rules: [
        {
          rule: 'required',
          errorMessage: 'Введите E-mail!',
        },
        {
          rule: 'email',
          errorMessage: 'Некорректный E-mail!',
        },
        {
          rule: 'maxLength',
          value: 230,
          errorMessage: 'Максимальная длина - 230 символов!',
        },
      ]
    },
  ], (ev) => {
    const currentForm = document.querySelector('.form--password-reset');
    const modalContainer = currentForm.closest('.graph-modal__container');
    const captchaText = currentForm.querySelector('.graph-modal__captcha-text');

    if (grecaptcha.getResponse(vars.captcha3)) {
      captchaText.innerHTML = '';

      modalContainer.classList.add('anim-block');

      const email = currentForm.querySelector('#password-reset-email').value.replace(/<[^>]+>/g, '');


      checkEmail('libs/check-email.php', email, (data) => {
        setTimeout(() => {
          modalContainer.classList.remove('anim-block');
          grecaptcha.reset(vars.captcha3);

          if (data.response) {
            captchaText.innerHTML = '';

            ev.target.reset();

            modal.close();
            modal.open('password-forget-code');

            passwordCodeEmail = email;
          } else {
            captchaText.innerHTML = `
              <div class="just-validate-error-label" style="color: rgb(184, 17, 17);">Введённый почтовый адрес не существует!</div>
            `;
          }
        }, 2000);
      });

    } else {
      captchaText.innerHTML = `
        <div class="just-validate-error-label" style="color: rgb(184, 17, 17);">Подтвердите что вы не робот</div>
      `;
    }

  });

  validForm('.form--password-code', [
    {
      ruleSelector: '#password-code',
      rules: [
        {
          rule: 'required',
          errorMessage: 'Введите код!',
        },
        {
          rule: 'maxLength',
          value: 230,
          errorMessage: 'Максимальная длина - 230 символов!',
        },
      ]
    },
  ], (ev) => {
    const currentForm = document.querySelector('.form--password-code');
    const modalContainer = currentForm.closest('.graph-modal__container');
    const captchaText = currentForm.querySelector('.graph-modal__captcha-text');

    if (passwordCodeEmail) {
      captchaText.innerHTML = '';

      modalContainer.classList.add('anim-block');

      const code = currentForm.querySelector('#password-code').value.replace(/_/g, '').replace(/\s/g, '');

      checkCode('libs/check-code.php', passwordCodeEmail, code, (data) => {
        setTimeout(() => {
          modalContainer.classList.remove('anim-block');

          if (data.response) {
            captchaText.innerHTML = '';

            ev.target.reset();

            modal.close();
            modal.open('password-new');
          } else {
            captchaText.innerHTML = `
              <div class="just-validate-error-label" style="color: rgb(184, 17, 17);">Неверный код!</div>
            `;
          }
        }, 2000);
      });
    } else {
      captchaText.innerHTML = `
        <div class="just-validate-error-label" style="color: rgb(184, 17, 17);">Почтовый адрес не существует!</div>
      `;
    }
  });

  validForm('.form--password-new', [
    {
      ruleSelector: '#password-new',
      rules: [
        {
          rule: 'required',
          errorMessage: 'Введите пароль!',
        },
        {
          rule: 'minLength',
          value: 5,
          errorMessage: 'Минимальная длина - 5 символов!',
        },
        {
          rule: 'maxLength',
          value: 230,
          errorMessage: 'Максимальная длина - 230 символов!',
        },
      ]
    },
    {
      ruleSelector: '#password-new-repeat',
      rules: [
        {
          rule: 'function',
          validator: function () {
            const password1 = document.querySelector('.form--password-new').querySelector('#password-new');
            const password2 = document.querySelector('.form--password-new').querySelector('#password-new-repeat');
            return password1.value === password2.value;
          },
          errorMessage: 'Пароли должны совпадать!',
        },
      ]
    },
  ], (ev) => {
    const currentForm = document.querySelector('.form--password-new');
    const modalContainer = currentForm.closest('.graph-modal__container');

    modalContainer.classList.add('anim-block');

    const password = currentForm.querySelector('#password-new').value.replace(/<[^>]+>/g, '');

    passwordNew('libs/password-new.php', passwordCodeEmail, password, (data) => {
      setTimeout(() => {
        modalContainer.classList.remove('anim-block');

        if (data.response) {

          ev.target.reset();

          modal.close();
          modal.open('btn-sign-in');
        }
      }, 2000);
    });

  });

  window.addEventListener('click', (e) => {
    if(e.target.classList.contains('orders-list__btn--show-phone')) {
      let user;

      try {
        user = JSON.parse(localStorage.getItem('userInf'));
      } catch (err) {
        user = false;
      }

      if(user) {
        checkUser('libs/sign-in-LS.php', user.email, user.password, (data) => {
          if(data.response) {
            getPhone('libs/get-phone.php', e.target.dataset.id, (data) => {
              if (data.response) {
                e.target.parentElement.parentElement.querySelector('.orders-list__phone').textContent = `
                  Телефон: ${data.phone}
                `;
                e.target.remove();
              }
            });
          }
        });
      } else {
        modal.open('btn-sign-in');
      }

    }
  });

}
