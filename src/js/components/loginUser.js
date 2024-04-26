import { checkUser } from "./checkUser";
import { checkEmail } from "./checkEmail";
import { deletePlacemark } from "./deletePlacemark";

export function loginUser(email) {

  const mainContent = document.querySelector('.header__main-content');

  document.querySelector('[data-content]').innerHTML = `
    <div class="header__sub-wrapper">
      <div class="header__user">${email}</div>
      <button class="btn-reset btn header__sub-btn header__btn-logout" data-btn-quit>Выход</button>
      <button class="btn-reset btn header__sub-btn header__btn-logout header__btn-logout--mobile" data-btn-quit>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 12H20M20 12L17 9M20 12L17 15" stroke="currentcolor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M4 12C4 7.58172 7.58172 4 12 4M12 20C9.47362 20 7.22075 18.8289 5.75463 17" stroke="currentcolor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
    </div>

    <button class="btn-reset btn btn--animation--head-shake header__sub-btn" data-graph-path="btn-create-order">Разместить заказ</button>
  `;

  checkEmail('libs/check-coords.php', email, (data) => {
    if (data.response) {
      mainContent.innerHTML += `
        <button class="btn-reset btn header__main-btn" data-delete-placemark>Удалить мой заказ</button>
      `;

      document.querySelector('[data-delete-placemark]').addEventListener('click', () => {
        let user;

        try {
          user = JSON.parse(localStorage.getItem('userInf'));
        } catch (err) {
          user = false;
        }

        if(user) {
          checkUser('libs/sign-in-LS.php', user.email, user.password, (data) => {
            if(data.response) {

              deletePlacemark('libs/delete-placemark.php', user.email, (data) => {
                if(data.response) {
                  location.reload();
                }
              });

            }
          });
        }
      });
    } else {
      mainContent.innerHTML += `
        <button class="btn-reset btn header__main-btn" disabled title="У вас пока что нету размещенного заказа!">Удалить мой заказ</button>
      `;
    }
  });

  document.querySelectorAll('[data-btn-quit]').forEach(item => {
    item.addEventListener('click', () => {
      localStorage.setItem('userInf', '');
      location.reload();
    });
  });
}
