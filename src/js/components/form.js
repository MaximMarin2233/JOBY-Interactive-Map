import JustValidate from 'just-validate';
import GraphModal from 'graph-modal';

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

    modalContainer.classList.add('graph-modal__container--anim');

    const xmlhttp = new XMLHttpRequest();

    const email = currentForm.querySelector('#sign-up-email').value.replace(/<[^>]+>/g,'');
    const password = currentForm.querySelector('#sign-up-password').value.replace(/<[^>]+>/g,'');

    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4) {
        if (xmlhttp.status === 200) {
          setTimeout(() => {
            modalContainer.classList.remove('graph-modal__container--anim');

            modal.close();
            modal.open('btn-sign-in');
          }, 2000);
        }
      }
    }

    xmlhttp.open('post', 'libs/sign-up.php', true);
    xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xmlhttp.send("email=" + encodeURIComponent(email) + "&password=" + encodeURIComponent(password));

    ev.target.reset();
  });

}
