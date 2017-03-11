'use strict';

window.locationsHistory = (function () {
  function createLocationHistoryColumn(locationsColumn, locationsHeader, headerText) {
    var locationsColumnClone = locationsColumn.cloneNode(true);
    var locationsHeaderClone = locationsHeader.cloneNode();
    var locationsList = displayLocationsList(headerText);

    locationsHeaderClone.textContent = headerText;
    if (locationsList.children.length > 0) {
      locationsColumnClone.appendChild(locationsHeaderClone);
    }
    locationsColumnClone.appendChild(locationsList);
    window.container.appendChild(locationsColumnClone);
  }

  function displayLocationsList(headerText) {
    var locationsListObject = window.locationsHistory.getLocationsObjectFromStorage();
    var locationsStorageList = window.locationsHistory.getLocationsListFromStorage(locationsListObject);
    var locationUnorderedList = document.createElement('ul');
    var filteredLocationsArray = [];

    switch (headerText) {
      case 'Добавленные Локации':
        filteredLocationsArray = locationsStorageList.filter(function (location) {
          return !location.isDeleted;
        });
        if (filteredLocationsArray.length > 0) {
          displayLocationItem(locationUnorderedList, filteredLocationsArray, 'created_at');
          locationUnorderedList.innerHTML += 'Всего: ' + filteredLocationsArray.length + ' локаций';
        }
        break;
      case 'Удаленные Локации':
        filteredLocationsArray = locationsStorageList.filter(function (location) {
          return location.isDeleted;
        });
        if (filteredLocationsArray.length > 0) {
          displayLocationItem(locationUnorderedList, filteredLocationsArray, 'updated_at');
          locationUnorderedList.innerHTML += 'Всего: ' + filteredLocationsArray.length + ' локаций';
        }
        break;
    }

    return locationUnorderedList;
  }

  function displayLocationItem(locationUnorderedList, filteredLocationsArray, dateParamName) {
    filteredLocationsArray.forEach(function (location) {
      var locationListItem = document.createElement('li');
      var locationDateModified = document.createElement('time');
      var locationDate = location[dateParamName];

      locationDateModified.setAttribute('datetime', locationDate.replace(/,/, ''));
      locationDateModified.textContent = locationDate;
      locationListItem.textContent = location.name + ' - ';
      locationListItem.appendChild(locationDateModified);
      locationUnorderedList.appendChild(locationListItem);
    });
  }

  function getLocationsObjectFromStorage() {
    return JSON.parse(localStorage.getItem('locations-list'));
  }

  function getLocationsListFromStorage(locationsListObject) {
    var locationsListArray = [];
    var locationsListObjectKeys = [];

    if (locationsListObject && Object.keys(locationsListObject)) {
      locationsListObjectKeys = Object.keys(locationsListObject);
      locationsListArray = locationsListObjectKeys.map(function (key) {
        return locationsListObject[key];
      });
    } else {
      return [];
    }

    return locationsListArray;
  }

  function countLocations() {
    var historyObject = this;
    var locationsListObject = historyObject.getLocationsObjectFromStorage();
    var locationsListArray = historyObject.getLocationsListFromStorage(locationsListObject);

    return locationsListArray.length;
  }

  function renderLocationsHistory() {
    var locationsColumn = document.createElement('section');
    var historyHeader = document.createElement('h1');
    var locationsColumnHeader = document.createElement('h2');
    var locationsCountParagraph = document.createElement('p');
    var locationsQuantity = window.locationsHistory.countLocations();

    locationsColumn.classList.add('history-column');
    locationsColumnHeader.classList.add('history-column__header');
    historyHeader.classList.add('content-container__header');
    historyHeader.textContent = 'История Локаций';
    locationsCountParagraph.textContent = 'Всего: ' + locationsQuantity + ' локаций';

    window.container.innerHTML = '';

    window.container.appendChild(historyHeader);
    window.container.appendChild(locationsCountParagraph);

    createLocationHistoryColumn(locationsColumn, locationsColumnHeader, 'Добавленные Локации');
    createLocationHistoryColumn(locationsColumn, locationsColumnHeader, 'Удаленные Локации');
  }

  return {
    getLocationsListFromStorage: getLocationsListFromStorage,
    renderLocationsHistory: renderLocationsHistory,
    countLocations: countLocations,
    getLocationsObjectFromStorage: getLocationsObjectFromStorage
  };
})();
