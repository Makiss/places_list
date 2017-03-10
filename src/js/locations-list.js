'use strict';

var container = document.querySelector('.content-container');

(function () {
  var modalLocationOverlay = document.querySelector('.overlay--add-location');
  var modalLocationCloseButton = modalLocationOverlay.querySelector('.modal__close');
  var addLocationForm = modalLocationOverlay.querySelector('.form--add-location');
  var imageUploadInput = addLocationForm.location_image;
  var locationsLink = document.querySelector('.nav__link--locations');
  var fragment = document.createDocumentFragment();
  var locationImage;

  init();

  locationsLink.addEventListener('click', onLocationsLinkClick);
  imageUploadInput.addEventListener('change', onImageUploadInputChange);
  addLocationForm.addEventListener('submit', onAddLocationFormSubmit);

  function init() {
    var locationsListObject = window.locationsHistory.getLocationsObjectFromStorage();
    var locationsStorageList = window.locationsHistory.getLocationsListFromStorage(locationsListObject);
    var allLocationsDeleted = false;
    var containerText = document.createTextNode(window.utils.noLocationsMessage);

    allLocationsDeleted = locationsStorageList.every(function (location) {
      return location.isDeleted === true;
    });

    if (!allLocationsDeleted) {
      createRemoveLocationsButton();
    } else {
      container.appendChild(containerText);
    }
    createAddLocationsButton();

    if (!locationsStorageList || locationsStorageList.length === 0) {
      localStorage.setItem('locations-list', JSON.stringify([]));
      getLocations();
    } else {
      locationsStorageList.forEach(function (locationData) {
        var locationItem = new Location(locationData);
        if (!locationItem.checkLocationDeleted()) {
          locationItem.render();
          fragment.appendChild(locationItem.element);
        }
      });

      container.appendChild(fragment);
    }
  }

  function renderLocations(locations) {
    locations.forEach(function (location) {
      var locationItem = new Location(location);
      if (!locationItem.checkLocationDeleted()) {
        locationItem.render();
        locationItem.save();
        fragment.appendChild(locationItem.element);
      }
    });

    container.appendChild(fragment);
  }

  function getLocations() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', window.utils.locationsDir);
    xhr.addEventListener('load', onLoad);
    xhr.send();
  }

  function onLoad(evt) {
    var rawData = evt.target.response;
    var loadedLocations = JSON.parse(rawData);

    renderLocations(loadedLocations);
  }

  function onImageUploadInputChange() {
    var image = this.files[0];
    var reader = new FileReader();

    if (image.type.match(/image.*/)) {
      reader.addEventListener('load', function (event) {
        locationImage = event.target.result;
      });
      reader.readAsDataURL(image);
    }
  }

  function onAddLocationFormSubmit(evt) {
    evt.preventDefault();

    var form = this;
    var location = {};
    var locationElement;

    location.name = form.location_name.value;
    location.address = form.location_address.value;
    location.contacts = form.location_contacts.value;
    location.description = form.location_description.value;
    location.preview = locationImage;
    location.rating = {};
    location.rating.average = 0.00;
    location.rating.quantity = 0;

    locationElement = new Location(location);
    locationElement.render();
    locationElement.save();
    fragment.appendChild(locationElement.element);

    if (container.firstChild.textContent === window.utils.noLocationsMessage) {
      container.firstChild.textContent = '';
      createRemoveLocationsButton();
    }
    container.appendChild(fragment);
    modalLocationCloseButton.click();
  }

  function onAddLocationButtonClick(evt) {
    evt.preventDefault();

    modalLocationOverlay.classList.remove('invisible');
    modalLocationCloseButton.addEventListener('click', onModalLocationCloseButtonClick);
  }

  function onModalLocationCloseButtonClick(evt) {
    evt.preventDefault();

    modalLocationOverlay.classList.add('invisible');
    this.removeEventListener('click', onModalLocationCloseButtonClick);
  }

  function onRemoveLocationsButtonClick(evt) {
    evt.preventDefault();

    var removeLocationsButton = document.querySelector('.btn--remove-locations');
    var containerText = document.createTextNode(window.utils.noLocationsMessage);

    container.removeChild(removeLocationsButton);
    Location.prototype.removeLocations(container);
    container.appendChild(containerText);
  }

  function createRemoveLocationsButton() {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn  btn--remove-locations';
    button.textContent = 'Удалить все локации';
    button.addEventListener('click', onRemoveLocationsButtonClick);

    container.appendChild(button);
  }

  function createAddLocationsButton() {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn  btn--circle  btn--add-location';
    button.textContent = '+';
    button.addEventListener('click', onAddLocationButtonClick);

    container.appendChild(button);
  }

  function onLocationsLinkClick(evt) {
    evt.preventDefault();

    var activeNavLink = document.querySelector('.nav__link--active');

    window.utils.toggleNavLink(activeNavLink, locationsLink);
    window.container.innerHTML = '';
    init();
  }
})();
