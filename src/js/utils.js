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

  function createButton(type, classList, textContent, clickEventListener, container) {
    var button = document.createElement('button');
    button.type = type;
    button.className = classList;
    button.textContent = textContent;
    button.addEventListener('click', clickEventListener);

    container.appendChild(button);
  }

  return {
    toggleNavLink: toggleNavLink,
    findLocationElementIndex: findLocationElementIndex,
    locationsDir: LOCATIONS_DIR,
    noLocationsMessage: noLocationsMessage,
    createButton: createButton
  };
})();
