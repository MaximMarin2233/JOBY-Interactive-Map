import vars from '../_vars';

import { checkUser } from "./checkUser";

export function map() {

  function init() {
    let map;

    ymaps.geolocation.get({
      mapStateAutoApply: true,
      autoReverseGeocode: false
    })
    .then(
      function(result) {
        let coordinates = result.geoObjects.get(0).geometry.getCoordinates();

        createMap({
          center: coordinates,
          zoom: 11
        }, {
          searchControlProvider: 'yandex#search'
        });

      },
      function(err) {
        createMap({
          center: [55.75987793362054,37.619763925026476],
          zoom: 11
        });

      }
    );

    setTimeout(() => {
      let loader = document.querySelector('.loader');

      if(loader) {
        createMap({
          center: [55.75987793362054,37.619763925026476],
          zoom: 11
        });
      }
    }, 6000);
  }

  function createMap(obj1, obj2) {
    map = new ymaps.Map('joby-map', obj1, obj2);

    map.controls.remove('trafficControl');
    map.controls.remove('typeSelector');
    map.controls.remove('fullscreenControl');
    map.controls.remove('rulerControl');

    let captchaKey = '6LfRd5ckAAAAAD1GVeseZJSzlRw21_II9R7QwC7R';

    vars.captcha1 = grecaptcha.render('captcha1', {
      'sitekey' : captchaKey,
    });
    vars.captcha2 = grecaptcha.render('captcha2', {
      'sitekey' : captchaKey,
    });
    vars.captcha3 = grecaptcha.render('captcha3', {
      'sitekey' : captchaKey,
    });

    const loader = document.querySelector('.loader');

    loader.remove();
    // setTimeout(() => {
    //   loader.classList.add('loader--hidden');
    // }, 2000);
    // setTimeout(() => {
    //   loader.remove();
    // }, 2500);




    var suggestView = new ymaps.SuggestView('create-order-address');
    var request = document.querySelector('#create-order-address');

    document.querySelector('[data-create-order-btn]').addEventListener('click', (e) => {
      let user;

      try {
        user = JSON.parse(localStorage.getItem('userInf'));
      } catch (err) {
        user = false;
      }

      if(user) {
        checkUser('libs/sign-in-LS.php', user.email, user.password, (data) => {
          if(data.response) {
            if(request.value.length > 0) {
              geocode();
            } else {
              showError('Введите адрес');
            }
          } else {
            location.reload();
          }
        });
      } else {
        showError('Вы не авторизованы!');
      }

    });

    function geocode() {
        ymaps.geocode(request.value).then(function (res) {
            var obj = res.geoObjects.get(0),
                error, hint;

            if (obj) {
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
            } else {
                showResult(obj);
            }
        }, function (e) {
            console.log(e)
        })

    }
    function showResult(obj) {
        if(obj.getCountry() == 'Россия') {
          document.querySelector('#create-order-address').classList.remove('input_error');
          document.querySelector('#notice').textContent = '';
        } else {
          showError('Страна должна быть Россия');

          return;
        }

        console.log(obj.geometry.getCoordinates());

        // var address = [obj.getCountry(), obj.getAddressLine()].join(', ');

    }

    function showError(message) {
        document.querySelector('#notice').textContent = message;
        document.querySelector('#create-order-address').classList.add('input_error');
    }

  }

  ymaps.ready(init);

}
