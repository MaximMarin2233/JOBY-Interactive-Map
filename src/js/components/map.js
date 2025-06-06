import vars from '../_vars';

import { checkUser } from "./checkUser";
import { addOrderInfo } from "./addOrderInfo";
import { getOrderInfo } from "./getOrderInfo";
import { validForm } from "./validForm";

export function map() {

  ymaps.ready(init);

  function init() {
    // let myMap;

    // let location = ymaps.geolocation.get({
    //   autoReverseGeocode: false
    // });

    // location.then(
    //   function (result) {
    //     defaultCreateMap(myMap, result.geoObjects.position[0], result.geoObjects.position[1]);
    //   },
    //   function (err) {
    //     defaultCreateMap(myMap);
    //   }
    // );


    // Создаем карту с центром в Москве
    let myMap = new ymaps.Map("joby-map", {
        center: [55.753215, 37.622504],
        zoom: 10
    });

    defaultCreateMap(myMap);

    // LOADER

    const loader = document.querySelector('.loader');

    setTimeout(() => {
      loader.classList.add('loader--hidden');
    }, 1500);
    setTimeout(() => {
      loader.remove();
    }, 2000);

    // LOADER /

    let savedCoords = localStorage.getItem('userCoords');

    if (savedCoords) {
        // Если есть, центрируем карту по сохраненным координатам
        let coords = JSON.parse(savedCoords);
        myMap.setCenter(coords);
    } else {
        // Если нет, запрашиваем геолокацию пользователя
        ymaps.geolocation.get({
          provider: 'auto',
          autoReverseGeocode: false,
          accuracy: 'high'
        }).then(function (result) {
            // Если получили геолокацию пользователя, центрируем карту по его местоположению
            let userCoords = result.geoObjects.get(0).geometry.getCoordinates();
            myMap.setCenter(userCoords);

            // Сохраняем координаты в localStorage
            localStorage.setItem('userCoords', JSON.stringify(userCoords));
        }, function (error) {
            // Если пользователь отказался от предоставления геолокации или произошла ошибка, центрируем карту в Москве
            // console.log('Ошибка определения местоположения: ' + error.message);
        });
    }


    // CAPTCHA

    let captchaKey = '6LfRd5ckAAAAAD1GVeseZJSzlRw21_II9R7QwC7R';

    if(window.innerWidth <= 575.98) {
      vars.captcha1 = grecaptcha.render('captcha1', {
        'sitekey': captchaKey,
        'size': 'compact'
      });
      vars.captcha2 = grecaptcha.render('captcha2', {
        'sitekey': captchaKey,
        'size': 'compact'
      });
      vars.captcha3 = grecaptcha.render('captcha3', {
        'sitekey': captchaKey,
        'size': 'compact'
      });
    } else {
      vars.captcha1 = grecaptcha.render('captcha1', {
        'sitekey': captchaKey,
      });
      vars.captcha2 = grecaptcha.render('captcha2', {
        'sitekey': captchaKey,
      });
      vars.captcha3 = grecaptcha.render('captcha3', {
        'sitekey': captchaKey,
      });
    }

    // CAPTCHA /



    const inputMask = new Inputmask({
      mask: '+7 999 999 99 99',
      placeholder: '+7              ',
      clearMaskOnLostFocus: false
    });
    const telSelector = document.querySelector('#create-order-phone');
    inputMask.mask(telSelector);

    // TEST


    // Подключаем поисковые подсказки к полю ввода.
    new ymaps.SuggestView('create-order-address');

    const notice = document.querySelector('#notice');

    // При клике по кнопке запускаем верификацию введёных данных.
    // document.querySelector('[data-create-order-btn]').addEventListener('click', function (e) {
    //   geocode();
    // });

    validForm('.form--post-order', [
      {
        ruleSelector: '#create-order-address',
        rules: [
          {
            rule: 'required',
            errorMessage: 'Введите адрес!',
          },
          {
            rule: 'maxLength',
            value: 230,
            errorMessage: 'Максимальная длина - 230 символов!',
          },
        ]
      },
      {
        ruleSelector: '#create-order-phone',
        rules: [
          {
            rule: 'required',
            errorMessage: 'Введите телефон!',
          },
          {
            rule: 'maxLength',
            value: 230,
            errorMessage: 'Максимальная длина - 230 символов!',
          },
          {
            rule: 'function',
            validator: function () {
              const phone = telSelector.inputmask.unmaskedvalue();
              return phone.length === 10;
            },
            errorMessage: 'Введите телефон корректно!'
          },
        ]
      },
      {
        ruleSelector: '#create-order-title',
        rules: [
          {
            rule: 'required',
            errorMessage: 'Заполните поле!',
          },
          {
            rule: 'minLength',
            value: 10,
            errorMessage: 'Минимальная длина - 10 символов!',
          },
          {
            rule: 'maxLength',
            value: 230,
            errorMessage: 'Максимальная длина - 230 символов!',
          },
        ]
      },
      {
        ruleSelector: '#create-order-text',
        rules: [
          {
            rule: 'required',
            errorMessage: 'Заполните поле!',
          },
          {
            rule: 'minLength',
            value: 40,
            errorMessage: 'Минимальная длина - 40 символов!',
          },
          {
            rule: 'maxLength',
            value: 230,
            errorMessage: 'Максимальная длина - 230 символов!',
          },
        ]
      },
    ], (ev) => {
      geocode();
    });

    function geocode() {
      // Забираем запрос из поля ввода.
      let request = document.querySelector('#create-order-address').value;


      // Геокодируем введённые данные.
      ymaps.geocode(request).then(function (res) {
        let obj = res.geoObjects.get(0),
          error, hint;

        // console.log(obj.getCountry());

        if (obj.getCountry() !== 'Россия') {
          notice.textContent = 'Страна должна быть Россия';

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
          showMessage(hint);
        } else {
          showResult(obj);
        }
      }, function (e) {
        // console.log(e)
      }).catch(function (error) {
        notice.textContent = 'Адрес не найден';
      });

    }
    function showResult(obj) {
      // Удаляем сообщение об ошибке, если найденный адрес совпадает с поисковым запросом.
      notice.textContent = '';


      // showMessage([obj.getCountry(), obj.getAddressLine()].join(', '));

      // console.log([obj.getCountry(), obj.getAddressLine()].join(', '));
      // console.log([obj.getThoroughfare(), obj.getPremiseNumber(), obj.getPremise()].join(' '));

      let user;

      try {
        user = JSON.parse(localStorage.getItem('userInf'));
      } catch (err) {
        user = false;
      }

      if (user) {
        checkUser('libs/sign-in-LS.php', user.email, user.password, (data) => {
          if (data.response) {

            const postOrderForm = document.querySelector('.form--post-order');
            const modalContainer = postOrderForm.closest('.graph-modal__container');

            modalContainer.classList.add('anim-block');

            const phone = postOrderForm.querySelector('#create-order-phone').value;
            const title = postOrderForm.querySelector('#create-order-title').value.replace(/<[^>]+>/g, '');
            const text = postOrderForm.querySelector('#create-order-text').value.replace(/<[^>]+>/g, '');


            addOrderInfo('libs/add-order-info.php', user.email, obj.geometry.getCoordinates().join(), phone, title, text, (data) => {
              setTimeout(() => {
                modalContainer.classList.remove('anim-block');

                if (data.response) {
                  // captchaText.innerHTML = '';

                  postOrderForm.reset();

                  window.location.reload();
                } else {
                  // captchaText.innerHTML = `
                  //   <div class="just-validate-error-label" style="color: rgb(184, 17, 17);">Введённый почтовый адрес не существует!</div>
                  // `;
                  // console.log('err');
                }
              }, 2000);
            });

          }
        });
      }

    }

    function showMessage(message) {
      notice.textContent = message;
    }


    // TEST /

  }

  function defaultCreateMap(map) {
    getOrderInfo('libs/get-order-info.php', (data) => {
      if (data.response) {
        // data.coordsArr.forEach(item => {
        //   var placemark = new ymaps.Placemark(item.split(',').map(parseFloat));

        //   map.geoObjects.add(placemark);
        // });

        // var objects = ymaps.geoQuery([{
        //   type: 'Point',
        //   coordinates: [56.513631, 85.043328]
        // }, {
        //   type: 'Point',
        //   coordinates: [56.512613, 85.041613]
        // }]);

        // // Найдем объекты, попадающие в видимую область карты.
        // objects.searchInside(map)
        //   // И затем добавим найденные объекты на карту.
        //   .addToMap(map);

        // map.events.add('boundschange', function () {
        //   // После каждого сдвига карты будем смотреть, какие объекты попадают в видимую область.
        //   var visibleObjects = objects.searchInside(map).addToMap(map);
        //   // Оставшиеся объекты будем удалять с карты.
        //   objects.remove(visibleObjects).removeFromMap(map);
        // });

        var customLayout = ymaps.templateLayoutFactory.createClass('<div style="border-radius: 50%; background-color: #647c89; color: #fff; width: 20px; height: 20px; display: flex; justify-content: center; align-items: center;transform: translate(-50%, -50%)">{{ properties.iconContent }}</div>');

        let markers = [];

        var coordinateCount = {};

        const ordersListWrapper = document.querySelector('.orders-list-wrapper');
        const ordersList = document.querySelector('.orders-list');

        // Считаем количество повторений координат
        data.coordsArr.forEach(function (coordinate) {
          var key = coordinate.coords;
          coordinateCount[key] = (coordinateCount[key] || 0) + 1;
        });

        var lastClickTime = 0;

        // Создаем метки на карте
        data.coordsArr.forEach(function (coordinate) {
          var key = coordinate.coords;
          var iconContent = coordinateCount[key] > 1 ? coordinateCount[key] : 1;


          let placemarkInfoArr = duplicateCoordsArr(coordinate.coords);

          // Проверяем, существует ли уже метка для данной координаты
          var existingMarker = markers.find(function (marker) {
            return marker.geometry.getCoordinates().toString() === coordinate.coords;
          });

          if (!existingMarker) {
            // Создаем новую метку только если её еще нет на карте
            var marker = new ymaps.Placemark(coordinate.coords.split(',').map(parseFloat), {
              iconContent: iconContent.toString(),
              orderInfo: placemarkInfoArr
            }, {
              iconLayout: customLayout,
              iconShape: {
                type: 'Circle',
                coordinates: [0, 0],
                radius: 20
              },
              balloonContent: 'Текст для консоли'
            });

            marker.events.add('click', function (e) {
              var currentTime = new Date().getTime();
              if (currentTime - lastClickTime > 500) {
                lastClickTime = currentTime;

                ordersList.innerHTML = '';
                ordersListWrapper.classList.add('orders-list-wrapper--active');
                ordersListWrapper.classList.add('anim-block');

                let currentArr = e.get('target').properties.get('orderInfo');

                currentArr.forEach(item => {

                  let currentAddress;

                  ymaps.geocode(item.coords.split(',').map(parseFloat), {
                    results: 1
                  }).then(function (res) {
                      var firstGeoObject = res.geoObjects.get(0);
                      currentAddress = firstGeoObject.getAddressLine();


                      ordersList.innerHTML += `
                        <li class="orders-list__item">
                          <h2 class="orders-list__title">${item.placemarkTitle}</h2>
                          <p class="orders-list__descr">${item.placemarkText}</p>
                          <div class="orders-list__btns">
                            <button class="btn-reset btn orders-list__btn orders-list__btn--show-descr">Показать описание</button>
                            <button class="btn-reset btn orders-list__btn orders-list__btn--show-phone" data-id="${item.id}">Показать телефон</button>
                          </div>
                          <address class="orders-list__address">${currentAddress}</address>
                          <div class="orders-list__date">${item.placemarkDate}</div>
                          <div class="orders-list__phone">Телефон: скрыт</div>
                        </li>
                      `;
                  });
                });

                setTimeout(() => {
                  ordersListWrapper.classList.remove('anim-block');
                }, 2000);
              }
            });

            markers.push(marker);
            map.geoObjects.add(marker);
          }
        });



        function duplicateCoordsArr(coords) {
          const arr = [];

          data.coordsArr.forEach(item => {
            if(coords === item.coords) {
              arr.push(item);
            }
          });

          return arr;

        }

        function updateMarkers() {
          var bounds = map.getBounds();

          markers.forEach(function (marker) {
            var markerCoords = marker.geometry.getCoordinates();

            if (bounds[0][0] <= markerCoords[0] && markerCoords[0] <= bounds[1][0] &&
              bounds[0][1] <= markerCoords[1] && markerCoords[1] <= bounds[1][1]) {
              marker.options.set('visible', true);
            } else {
              marker.options.set('visible', false);
            }
          });
        }

        map.events.add('boundschange', function () {
          updateMarkers();
        });


      }
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
