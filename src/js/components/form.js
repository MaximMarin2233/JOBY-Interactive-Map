import JustValidate from 'just-validate';
import GraphModal from 'graph-modal';
import vars from '../_vars';

import { checkUser } from "./checkUser";
import { loginUser } from "./loginUser";
import { addToLS } from "./addToLS";
import { checkEmail } from "./checkEmail";

export function form() {
  const modal = new GraphModal();

  function validForm(selector, rules, func) {
    const validation = new JustValidate(selector);

    for (let item of rules) {
      validation
        .addField(item.ruleSelector, item.rules);
    }

    validation.onSuccess(func);
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
      ]
    },
    {
      ruleSelector: '#sign-up-password-repeat',
      rules: [
        {
          rule: 'function',
          validator: function() {
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

    if(grecaptcha.getResponse(vars.captcha1)) {
      captchaText.innerHTML = '';

      modalContainer.classList.add('graph-modal__container--anim');

      const email = currentForm.querySelector('#sign-up-email').value.replace(/<[^>]+>/g,'');
      const password = currentForm.querySelector('#sign-up-password').value.replace(/<[^>]+>/g,'');
      const mark = 'no';
      const code = '';

      xmlhttp.open('post', 'libs/sign-up.php', true);
      xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xmlhttp.send("email=" + encodeURIComponent(email) + "&password=" + encodeURIComponent(password) + "&mark=" + encodeURIComponent(mark) + "&code=" + encodeURIComponent(code));

      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4) {
          if (xmlhttp.status === 200) {
            checkUser('libs/sign-in.php', email, password, (data) => {
              setTimeout(() => {
                modalContainer.classList.remove('graph-modal__container--anim');
                ev.target.reset();
                grecaptcha.reset(vars.captcha1);

                modal.close();

                if(data.response) {
                  addToLS(email, data.userPassword);
                  location.reload();
                }
              }, 2000);
            });
          }
        }
      }
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
      ]
    },
  ], (ev) => {
    const currentForm = document.querySelector('.form--sign-in');
    const modalContainer = currentForm.closest('.graph-modal__container');
    const captchaText = currentForm.querySelector('.graph-modal__captcha-text');

    if(grecaptcha.getResponse(vars.captcha2)) {
      captchaText.innerHTML = '';

      modalContainer.classList.add('graph-modal__container--anim');

      const email = currentForm.querySelector('#sign-in-email').value.replace(/<[^>]+>/g,'');
      const password = currentForm.querySelector('#sign-in-password').value.replace(/<[^>]+>/g,'');

      checkUser('libs/sign-in.php', email, password, (data) => {
        setTimeout(() => {
          modalContainer.classList.remove('graph-modal__container--anim');
          grecaptcha.reset(vars.captcha2);

          if(data.response) {
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
      ]
    },
  ], (ev) => {
    const currentForm = document.querySelector('.form--password-reset');
    const modalContainer = currentForm.closest('.graph-modal__container');
    const captchaText = currentForm.querySelector('.graph-modal__captcha-text');

    if(grecaptcha.getResponse(vars.captcha3)) {
      captchaText.innerHTML = '';

      modalContainer.classList.add('graph-modal__container--anim');

      const email = currentForm.querySelector('#password-reset-email').value.replace(/<[^>]+>/g,'');


      checkEmail('libs/check-email.php', email, (data) => {
        setTimeout(() => {
          modalContainer.classList.remove('graph-modal__container--anim');
          grecaptcha.reset(vars.captcha3);

          if(data.response) {
            ev.target.reset();

            modal.close();
            modal.open('password-forget-code');

            document.querySelector('[data-graph-target="password-forget-code"]').querySelector('[name="email"]').value = email;

            // addToLS(email, data.userPassword);
            // location.reload();
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
      ]
    },
  ], (ev) => {
    // const currentForm = document.querySelector('.form--password-reset');
    // const modalContainer = currentForm.closest('.graph-modal__container');


    // modalContainer.classList.add('graph-modal__container--anim');

    // const email = currentForm.querySelector('#password-reset-email').value.replace(/<[^>]+>/g,'');


    // checkEmail('libs/check-email.php', email, (data) => {
    //   setTimeout(() => {
    //     modalContainer.classList.remove('graph-modal__container--anim');
    //     grecaptcha.reset(vars.captcha3);

    //     if(data.response) {
    //       ev.target.reset();

    //       modal.close();
    //       modal.open('password-forget-code');

    //       document.querySelector('[data-graph-target="password-forget-code"]').querySelector('[name="email"]').value = email;

    //       // addToLS(email, data.userPassword);
    //       // location.reload();
    //     } else {
    //       captchaText.innerHTML = `
    //         <div class="just-validate-error-label" style="color: rgb(184, 17, 17);">Введённый почтовый адрес не существует!</div>
    //       `;
    //     }
    //   }, 2000);
    // });

    console.log('ok');
  });

}
