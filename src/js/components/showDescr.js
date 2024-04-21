export function showDescr() {
  window.addEventListener('click', (e) => {

    if(e.target.classList.contains('orders-list__btn')) {
      if(e.target.textContent === 'Показать описание') {
        e.target.parentElement.parentElement.querySelector('.orders-list__descr').style['-webkit-line-clamp'] = 'initial';
        e.target.textContent = 'Скрыть описание';
      } else {
        e.target.parentElement.parentElement.querySelector('.orders-list__descr').style['-webkit-line-clamp'] = 1;
        e.target.textContent = 'Показать описание';
      }
    }
  });

  document.querySelector('.orders-list-wrapper__btn').addEventListener('click', () => {
    document.querySelector('.orders-list-wrapper').classList.remove('orders-list-wrapper--active');
  })
}
