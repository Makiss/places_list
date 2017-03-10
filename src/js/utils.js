'use strict';

window.utils = (function () {
  var LOCATIONS_DIR = 'data/locations.json';
  var noLocationsMessage = 'На данный момент нет созданных локаций';

  function toggleNavLink(activeNavLink, currentLink) {
    activeNavLink.classList.remove('nav__link--active');
    activeNavLink.href = '#';
    currentLink.classList.add('nav__link--active');
  }

  function findLocationElementIndex(locationsStorageList, locationName) {
    var locationIndex;

    locationsStorageList.some(function (location, index) {
      locationIndex = index;
      return location.name === locationName;
    });

    return locationIndex;
  }

  return {
    toggleNavLink: toggleNavLink,
    findLocationElementIndex: findLocationElementIndex,
    locationsDir: LOCATIONS_DIR,
    noLocationsMessage: noLocationsMessage
  };
})();
