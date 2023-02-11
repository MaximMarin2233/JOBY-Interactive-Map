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
  }

  function createMap(obj1, obj2) {
    map = new ymaps.Map('joby-map', obj1, obj2);

    map.controls.remove('trafficControl');
    map.controls.remove('typeSelector');
    map.controls.remove('fullscreenControl');
    map.controls.remove('rulerControl');

    const loader = document.querySelector('.loader');

    loader.remove();
    // setTimeout(() => {
    //   loader.classList.add('loader--hidden');
    // }, 2000);
    // setTimeout(() => {
    //   loader.remove();
    // }, 2500);
  }

  ymaps.ready(init);

}
