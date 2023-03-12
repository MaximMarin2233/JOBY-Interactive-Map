import JustValidate from 'just-validate';
import GraphModal from 'graph-modal';
import vars from '../_vars';

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

    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4) {
        if (xmlhttp.status === 200) {
          setTimeout(() => {
            modalContainer.classList.remove('graph-modal__container--anim');
            ev.target.reset();
            grecaptcha.reset(vars.captcha1);

            modal.close();
            modal.open('btn-sign-in');
          }, 2000);
        }
      }
    }

    if(grecaptcha.getResponse(vars.captcha1)) {
      captchaText.innerHTML = '';

      modalContainer.classList.add('graph-modal__container--anim');

      const email = currentForm.querySelector('#sign-up-email').value.replace(/<[^>]+>/g,'');
      const password = currentForm.querySelector('#sign-up-password').value.replace(/<[^>]+>/g,'');
      const mark = 'no';

      xmlhttp.open('post', 'libs/sign-up.php', true);
      xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xmlhttp.send("email=" + encodeURIComponent(email) + "&password=" + encodeURIComponent(password) + "&mark=" + encodeURIComponent(mark));
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

    const xmlhttp = new XMLHttpRequest();

    if(grecaptcha.getResponse(vars.captcha2)) {
      captchaText.innerHTML = '';

      modalContainer.classList.add('graph-modal__container--anim');

      const email = currentForm.querySelector('#sign-in-email').value.replace(/<[^>]+>/g,'');
      const password = currentForm.querySelector('#sign-in-password').value.replace(/<[^>]+>/g,'');


      xmlhttp.open('post', 'libs/sign-in.php', true);
      xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xmlhttp.send("email=" + encodeURIComponent(email) + "&password=" + encodeURIComponent(password));

      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
          if (xmlhttp.status == 200) {
            var data = xmlhttp.responseText;
            if (data != 'empty') {

              data = JSON.parse(data);
              setTimeout(() => {
                modalContainer.classList.remove('graph-modal__container--anim');
                grecaptcha.reset(vars.captcha2);


                if(data) {
                  ev.target.reset();
                  grecaptcha.reset(vars.captcha2);
                  modal.close();

                  document.querySelector('[data-content]').innerHTML = `
                    <div class="header__sub-wrapper">
                      <div class="header__user">${email}</div>
                      <button class="btn-reset btn header__sub-btn" data-graph-path="quit...">Выход</button>
                    </div>

                    <button class="btn-reset btn btn--animation--head-shake header__sub-btn" data-graph-path="btn-sign-in">Разместить заказ</button>
                  `;

                  localStorage.setItem('userInf', JSON.stringify({
                    email: email,
                    password: password
                  }));
                } else {
                  captchaText.innerHTML = `
                    <div class="just-validate-error-label" style="color: rgb(184, 17, 17);">Неправильный логин или пароль</div>
                  `;
                }
              }, 2000);

            }
          }
        }
      };

    } else {
      captchaText.innerHTML = `
        <div class="just-validate-error-label" style="color: rgb(184, 17, 17);">Подтвердите что вы не робот</div>
      `;
    }
  });

}
