import JustValidate from 'just-validate';

export function form() {

  function validForm(selector, func) {
    const validation = new JustValidate(selector);

    validation
      .addField('#sign-up-email', [
        {
          rule: 'required',
          errorMessage: 'Введите E-mail!',
        },
        {
          rule: 'email',
          errorMessage: 'Некорректный E-mail!',
        },
      ])
      .addField('#sign-up-password', [
        {
          rule: 'required',
          errorMessage: 'Введите пароль!',
        },
        {
          rule: 'minLength',
          value: 5,
          errorMessage: 'Минимальная длина - 5 символов!',
        },
      ])
      .addField('#sign-up-password-repeat', [
        {
          rule: 'function',
          validator: function() {
            const password1 = document.querySelector(selector).querySelector('#sign-up-password');
            const password2 = document.querySelector(selector).querySelector('#sign-up-password-repeat');
            return password1.value === password2.value;
          },
          errorMessage: 'Пароли должны совпадать!',
        },
      ]);

    validation.onSuccess(func);

  }

  validForm('.form--reg', (ev) => {
    const xmlhttp = new XMLHttpRequest();

    const email = document.querySelector('.form--reg').querySelector('#sign-up-email').value.replace(/<[^>]+>/g,'');
    const password = document.querySelector('.form--reg').querySelector('#sign-up-password').value.replace(/<[^>]+>/g,'');

    xmlhttp.open('post', 'libs/sign-up.php', true);
    xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xmlhttp.send("email=" + encodeURIComponent(email) + "&password=" + encodeURIComponent(password));

    ev.target.reset();
  });

}
