'use strict';

(function () {
  var historyLink = document.querySelector('.nav__link--history');
  var activeNavLink = document.querySelector('.nav__link--active');

  historyLink.addEventListener('click', onHistoryLinkClick);

  function onHistoryLinkClick(evt) {
    evt.preventDefault();

    var historyLink = this;

    window.utils.toggleNavLink(activeNavLink, historyLink);
    window.locationsHistory.renderLocationsHistory();
  }
})();
