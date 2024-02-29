import vars from '../_vars';

import { checkUser } from "./checkUser";
import { addCoords } from "./addCoords";

export function map() {

  ymaps.ready(init);

  function init() {

    let myMap;

    let location = ymaps.geolocation.get({
      autoReverseGeocode: false
    });

    location.then(
      function (result) {
        defaultCreateMap(myMap, result.geoObjects.position[0], result.geoObjects.position[1]);
      },
      function (err) {
        defaultCreateMap(myMap);
      }
    );

    // CAPTCHA

    let captchaKey = '6LfRd5ckAAAAAD1GVeseZJSzlRw21_II9R7QwC7R';

    vars.captcha1 = grecaptcha.render('captcha1', {
      'sitekey': captchaKey,
    });
    vars.captcha2 = grecaptcha.render('captcha2', {
      'sitekey': captchaKey,
    });
    vars.captcha3 = grecaptcha.render('captcha3', {
      'sitekey': captchaKey,
    });

    // CAPTCHA /

    // LOADER

    const loader = document.querySelector('.loader');

    loader.remove();
    // setTimeout(() => {
    //   loader.classList.add('loader--hidden');
    // }, 2000);
    // setTimeout(() => {
    //   loader.remove();
    // }, 2500);

    // LOADER /

    // TEST


    // Подключаем поисковые подсказки к полю ввода.
    new ymaps.SuggestView('create-order-address');

    // При клике по кнопке запускаем верификацию введёных данных.
    document.querySelector('[data-create-order-btn]').addEventListener('click', function (e) {
      geocode();
    });

    function geocode() {
      // Забираем запрос из поля ввода.
      let request = document.querySelector('#create-order-address').value;

      if (request.length === 0) {
        console.log('empty');

        return;
      }


      // Геокодируем введённые данные.
      ymaps.geocode(request).then(function (res) {
        let obj = res.geoObjects.get(0),
          error, hint;

        console.log(obj.geometry.getCoordinates());
        // console.log(obj.getCountry());

        if (obj.getCountry() !== 'Россия') {
          console.log('country err');

          return;
        }

        if (obj) {
          // Об оценке точности ответа геокодера можно прочитать тут: https://tech.yandex.ru/maps/doc/geocoder/desc/reference/precision-docpage/
          switch (obj.properties.get('metaDataProperty.GeocoderMetaData.precision')) {
            case 'exact':
              break;
            case 'number':
            case 'near':
            case 'range':
              error = 'Неточный адрес, требуется уточнение';
              hint = 'Уточните номер дома';
              break;
            case 'street':
              error = 'Неполный адрес, требуется уточнение';
              hint = 'Уточните номер дома';
              break;
            case 'other':
            default:
              error = 'Неточный адрес, требуется уточнение';
              hint = 'Уточните адрес';
          }
        } else {
          error = 'Адрес не найден';
          hint = 'Уточните адрес';
        }

        // Если геокодер возвращает пустой массив или неточный результат, то показываем ошибку.
        if (error) {
          showError(error);
          showMessage(hint);
        } else {
          showResult(obj);
        }
      }, function (e) {
        console.log(e)
      })

    }
    function showResult(obj) {
      // Удаляем сообщение об ошибке, если найденный адрес совпадает с поисковым запросом.
      console.log('not-err');


      showMessage([obj.getCountry(), obj.getAddressLine()].join(', '));

      console.log([obj.getCountry(), obj.getAddressLine()].join(', '));
      console.log([obj.getThoroughfare(), obj.getPremiseNumber(), obj.getPremise()].join(' '));

      let user;

      try {
        user = JSON.parse(localStorage.getItem('userInf'));
      } catch (err) {
        user = false;
      }

      checkUser('libs/sign-in-LS.php', user.email, user.password, (data) => {
        if (data.response) {

          const postOrderForm = document.querySelector('.form--post-order');
          const modalContainer = postOrderForm.closest('.graph-modal__container');

          modalContainer.classList.add('graph-modal__container--anim');

          addCoords('libs/add-coords.php', user.email, obj.geometry.getCoordinates().join(), (data) => {
            setTimeout(() => {
              modalContainer.classList.remove('graph-modal__container--anim');

              if (data.response) {
                // captchaText.innerHTML = '';

                postOrderForm.reset();

                console.log('success');
              } else {
                // captchaText.innerHTML = `
                //   <div class="just-validate-error-label" style="color: rgb(184, 17, 17);">Введённый почтовый адрес не существует!</div>
                // `;
                console.log('err');
              }
            }, 2000);
          });

        }
      });

    }

    function showError(message) {
      console.log('err');
    }

    function showMessage(message) {
      console.log(`Адрес: ${message}`);
    }


    // TEST /

  }

  function defaultCreateMap(map, x = 55.76, y = 37.64) {
    map = new ymaps.Map("joby-map", {
      center: [x, y],
      zoom: 10
    });
  }

  // function init() {
  //   let map;

  //   ymaps.geolocation.get({
  //     mapStateAutoApply: true,
  //     autoReverseGeocode: false
  //   })
  //   .then(
  //     function(result) {
  //       let coordinates = result.geoObjects.get(0).geometry.getCoordinates();

  //       createMap({
  //         center: coordinates,
  //         zoom: 11
  //       }, {
  //         searchControlProvider: 'yandex#search'
  //       });

  //     },
  //     function(err) {
  //       createMap({
  //         center: [55.75987793362054,37.619763925026476],
  //         zoom: 11
  //       });

  //     }
  //   );

  //   setTimeout(() => {
  //     let loader = document.querySelector('.loader');

  //     if(loader) {
  //       createMap({
  //         center: [55.75987793362054,37.619763925026476],
  //         zoom: 11
  //       });
  //     }
  //   }, 6000);
  // }

  // function createMap(obj1, obj2) {
  //   map = new ymaps.Map('joby-map', obj1, obj2);

  //   map.controls.remove('trafficControl');
  //   map.controls.remove('typeSelector');
  //   map.controls.remove('fullscreenControl');
  //   map.controls.remove('rulerControl');

  //   let captchaKey = '6LfRd5ckAAAAAD1GVeseZJSzlRw21_II9R7QwC7R';

  //   vars.captcha1 = grecaptcha.render('captcha1', {
  //     'sitekey' : captchaKey,
  //   });
  //   vars.captcha2 = grecaptcha.render('captcha2', {
  //     'sitekey' : captchaKey,
  //   });
  //   vars.captcha3 = grecaptcha.render('captcha3', {
  //     'sitekey' : captchaKey,
  //   });

  //   const loader = document.querySelector('.loader');

  //   loader.remove();
  //   // setTimeout(() => {
  //   //   loader.classList.add('loader--hidden');
  //   // }, 2000);
  //   // setTimeout(() => {
  //   //   loader.remove();
  //   // }, 2500);




  //   var suggestView = new ymaps.SuggestView('create-order-address');
  //   var request = document.querySelector('#create-order-address');

  //   document.querySelector('[data-create-order-btn]').addEventListener('click', (e) => {
  //     let user;

  //     try {
  //       user = JSON.parse(localStorage.getItem('userInf'));
  //     } catch (err) {
  //       user = false;
  //     }

  //     if(user) {
  //       checkUser('libs/sign-in-LS.php', user.email, user.password, (data) => {
  //         if(data.response) {
  //           if(request.value.length > 0) {
  //             geocode();
  //           } else {
  //             showError('Введите адрес');
  //           }
  //         } else {
  //           location.reload();
  //         }
  //       });
  //     } else {
  //       showError('Вы не авторизованы!');
  //     }

  //   });

  //   function geocode() {
  //       ymaps.geocode(request.value).then(function (res) {
  //           var obj = res.geoObjects.get(0),
  //               error, hint;

  //           if (obj) {
  //               switch (obj.properties.get('metaDataProperty.GeocoderMetaData.precision')) {
  //                   case 'exact':
  //                       break;
  //                   case 'number':
  //                   case 'near':
  //                   case 'range':
  //                       error = 'Неточный адрес, требуется уточнение';
  //                       hint = 'Уточните номер дома';
  //                       break;
  //                   case 'street':
  //                       error = 'Неполный адрес, требуется уточнение';
  //                       hint = 'Уточните номер дома';
  //                       break;
  //                   case 'other':
  //                   default:
  //                       error = 'Неточный адрес, требуется уточнение';
  //                       hint = 'Уточните адрес';
  //               }
  //           } else {
  //               error = 'Адрес не найден';
  //               hint = 'Уточните адрес';
  //           }

  //           // Если геокодер возвращает пустой массив или неточный результат, то показываем ошибку.
  //           if (error) {
  //               showError(error);
  //           } else {
  //               showResult(obj);
  //           }
  //       }, function (e) {
  //           console.log(e)
  //       })

  //   }
  //   function showResult(obj) {
  //       if(obj.getCountry() == 'Россия') {
  //         document.querySelector('#create-order-address').classList.remove('input_error');
  //         document.querySelector('#notice').textContent = '';
  //       } else {
  //         showError('Страна должна быть Россия');

  //         return;
  //       }

  //       console.log(obj.geometry.getCoordinates());

  //       // var address = [obj.getCountry(), obj.getAddressLine()].join(', ');

  //   }

  //   function showError(message) {
  //       document.querySelector('#notice').textContent = message;
  //       document.querySelector('#create-order-address').classList.add('input_error');
  //   }

  // }

  // ymaps.ready(init);

}
