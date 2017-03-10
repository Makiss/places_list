'use strict';

(function () {
  function Location(data) {
    this._data = data;
  }

  Location.prototype.render = function () {
    var template = document.getElementById('location-template');
    var RATING_COUNT = 5;
    var IMAGE_TIMEOUT = 10000;
    var starElement;
    var ratingList;
    var ratingAverage;
    var favoriteBtn;
    var contentImage;
    var imageWrapper;
    var imageLoadTimeout;
    var deleteLocationButton;

    if ('content' in template) {
      this.element = template.content.children[0].cloneNode(true);
    } else {
      this.element = template.children[0].cloneNode(true);
    }

    this.element.querySelector('.place-item__title').textContent = this._data.name;
    this.element.querySelector('.place-item__text--contact').innerHTML = 'адрес: <span>' + this._data.address +
                                                                    '</span><br>контакты: ' + this._data.contacts;
    this.element.querySelector('.place-item__text--features').textContent = this._data.description;
    this.element.querySelector('.rating__number').textContent = this._data.rating.average + ' (оценок: ' +
                                                          this._data.rating.quantity + ')';
    deleteLocationButton = this.element.querySelector('.btn--delete');

    deleteLocationButton.addEventListener('click', onDeleteLocationButtonClick);

    // put stars according to average rating
    ratingList = this.element.querySelector('.rating__list');
    ratingAverage = this._data.rating.average;
    for (var i = 0; i < RATING_COUNT; i++) {
      starElement = document.createElement('li');
      if (ratingAverage >= 1) {
        starElement.className = 'rating__star  rating__star--yellow';
      } else if (ratingAverage < 1 && ratingAverage > 0) {
        starElement.className = 'rating__star  rating__star--yellow-white';
      } else {
        starElement.className = 'rating__star  rating__star--white';
      }
      ratingList.appendChild(starElement);
      ratingAverage--;
    }

    // indicate favorite locations
    favoriteBtn = this.element.querySelector('.btn--star');
    if (this._data.favorite) {
      favoriteBtn.className += '  btn--star-yellow';
    } else {
      favoriteBtn.className += '  btn--star-grey';
    }
    favoriteBtn.addEventListener('click', Location.prototype.addRemoveFromFavorite);

    imageWrapper = this.element.querySelector('.place-item__img');

    // Create content images
    contentImage = new Image(152, 152);
    // if server hangs and doesn't return an image
    imageLoadTimeout = setTimeout(function () {
      onImageLoadTimeout(contentImage, imageWrapper);
    }, IMAGE_TIMEOUT);
    // check if image is loaded
    contentImage.addEventListener('load', function () {
      onContentImageLoad(imageLoadTimeout, imageWrapper, contentImage);
    });
    // listen to error while downloading image
    contentImage.addEventListener('error', function () {
      onContentImageError(imageWrapper);
    });
    contentImage.src = this._data.preview;
    contentImage.alt = this._data.name;
  };

  Location.prototype.save = function () {
    var locationsListObject = window.locationsHistory.getLocationsObjectFromStorage();
    var locationData = this._data;
    var locationsStorageList = window.locationsHistory.getLocationsListFromStorage(locationsListObject);
    var locationExists;

    locationData.created_at = new Date().toLocaleString('en-GB');

    if (locationsStorageList.length > 0) {
      locationExists = locationsStorageList.some(function (location) {
        return location.name === locationData.name;
      });
      if (!locationExists) {
        setStorageList(locationsStorageList, locationData);
      }
    } else {
      setStorageList(locationsStorageList, locationData);
    }
  };

  Location.prototype.delete = function (locationsStorageList, locationName) {
    var locationIndex = window.utils.findLocationElementIndex(locationsStorageList, locationName);

    locationsStorageList[locationIndex].isDeleted = true;
    locationsStorageList[locationIndex].updated_at = new Date().toLocaleString('en-GB');

    setStorageList(locationsStorageList);
  };

  Location.prototype.removeLocations = function (container) {
    var childrenList = container.querySelectorAll('.place-item');
    var locationsListObject = window.locationsHistory.getLocationsObjectFromStorage();
    var locationsStorageList = window.locationsHistory.getLocationsListFromStorage(locationsListObject);

    locationsStorageList.forEach(function (location) {
      location.isDeleted = true;
      location.updated_at = new Date().toLocaleString('en-GB');
    });
    setStorageList(locationsStorageList);

    [].forEach.call(childrenList, function (child) {
      container.removeChild(child);
    });
  };

  Location.prototype.addRemoveFromFavorite = function () {
    var addToFavoriteButton = this;
    var locationsListObject = window.locationsHistory.getLocationsObjectFromStorage();
    var locationsStorageList = window.locationsHistory.getLocationsListFromStorage(locationsListObject);
    var locationName = this.parentElement.querySelector('.place-item__title').textContent;
    var locationIndex = window.utils.findLocationElementIndex(locationsStorageList, locationName);

    if (addToFavoriteButton.classList.contains('btn--star-yellow')) {
      addToFavoriteButton.classList.remove('btn--star-yellow');
      addToFavoriteButton.classList.add('btn--star-grey');
      locationsStorageList[locationIndex].favorite = false;
    } else {
      addToFavoriteButton.classList.remove('btn--star-grey');
      addToFavoriteButton.classList.add('btn--star-yellow');
      locationsStorageList[locationIndex].favorite = true;
    }
    localStorage.setItem('locations-list', JSON.stringify(locationsStorageList));
  };

  Location.prototype.checkLocationDeleted = function () {
    var locationsListObject = window.locationsHistory.getLocationsObjectFromStorage();
    var locationsStorageList = window.locationsHistory.getLocationsListFromStorage(locationsListObject);
    var locationName = this._data.name;
    var locationIndex = window.utils.findLocationElementIndex(locationsStorageList, locationName);

    return locationsStorageList[locationIndex] && locationsStorageList[locationIndex].isDeleted;
  };

  function onDeleteLocationButtonClick(evt) {
    evt.preventDefault();

    var location = this.parentElement.parentElement;
    var locationContainer = location.parentElement;
    var locationName = location.querySelector('.place-item__title').textContent;
    var allLocationsDeleted = false;
    var locationsListObject = window.locationsHistory.getLocationsObjectFromStorage();
    var locationsStorageList = window.locationsHistory.getLocationsListFromStorage(locationsListObject);
    var containerText = document.createTextNode(window.utils.noLocationsMessage);
    var removeLocationsButton = document.querySelector('.btn--remove-locations');

    Location.prototype.delete(locationsStorageList, locationName);
    locationContainer.removeChild(location);
    allLocationsDeleted = locationsStorageList.every(function (locationItem) {
      return locationItem.isDeleted === true;
    });

    if (allLocationsDeleted) {
      locationContainer.removeChild(removeLocationsButton);
      locationContainer.appendChild(containerText);
    }
  }

  function onContentImageLoad(imageLoadTimeout, imageWrapper, contentImage) {
    clearTimeout(imageLoadTimeout);
    imageWrapper.appendChild(contentImage);
  }

  function onContentImageError(imageWrapper) {
    imageWrapper.className += '  place-item__no-photo';
  }

  function onImageLoadTimeout(contentImage, imageWrapper) {
    contentImage.src = '';
    imageWrapper.className += '  place-item__no-photo';
  }

  function setStorageList(locationsStorageList, locationData) {
    if (locationData) {
      locationsStorageList.push(locationData);
    }

    localStorage.setItem('locations-list', JSON.stringify(locationsStorageList));
  }

  window.Location = Location;
})();
