export function loginUser(email) {
  document.querySelector('[data-content]').innerHTML = `
    <div class="header__sub-wrapper">
      <div class="header__user">${email}</div>
      <button class="btn-reset btn header__sub-btn" data-btn-quit>Выход</button>
    </div>

    <button class="btn-reset btn btn--animation--head-shake header__sub-btn" data-graph-path="btn-create-order">Разместить заказ</button>
  `;

  document.querySelector('[data-btn-quit]').addEventListener('click', () => {
    localStorage.setItem('userInf', '');
    location.reload();
  });
}
