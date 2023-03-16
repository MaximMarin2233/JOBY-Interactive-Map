import './components/checkUser';
import './components/map';
import './components/form';

import { checkUser } from "./components/checkUser";
import { map } from "./components/map";
import { form } from "./components/form";

window.addEventListener('DOMContentLoaded', () => {
  let user;

  try {
    user = JSON.parse(localStorage.getItem('userInf'));
  } catch (err) {
    user = false;
  }

  if(user) {
    checkUser(user.email, user.password, (data) => {
      if(data) {
        document.querySelector('[data-content]').innerHTML = `
          <div class="header__sub-wrapper">
            <div class="header__user">${user.email}</div>
            <button class="btn-reset btn header__sub-btn" data-btn-quit>Выход</button>
          </div>

          <button class="btn-reset btn btn--animation--head-shake header__sub-btn" data-graph-path="btn-sign-in">Разместить заказ</button>
        `;

        document.querySelector('[data-btn-quit]').addEventListener('click', () => {
          localStorage.setItem('userInf', '');
          location.reload();
        });
      }
    });
  }
  map();
  form();
});
