// ==UserScript==
// @name Smart QR
// @description Detects phone numbers and locations and displays their value as a QR code on mouseover. Needs doubleclick somewhere on the page to get triggered.
// @version 0.2
// @copyright   2017, Georg Jähnig
// @author Georg Jähnig
// @license MIT
// @include *
// @run-at document-end
// @grant none
// ==/UserScript==
// ==OpenUserJS==
// @author jorges
// ==/OpenUserJS==

(function () {

  "use strict";

  function addQR(value) {
    //console.log(value);
    if (value == '') {
      return;
    }
    img.src = 'https://chart.apis.google.com/chart?cht=qr&chs=100x100&chld=L|0&chl=' + encodeURIComponent(value);
    img.style.visibility = "visible";
  };

  function removeQR() {
    img.style.visibility = "hidden";
  };

  function addListeners(element, value) {
    element.addEventListener('mouseover', function() { addQR(value); } );
    //element.addEventListener('mouseout', function() { removeQR(); });
  }

  function handleTextSelect(event) {
    var selection = document.getSelection();
    var text = selection.toString();
    if (text == '') {
      removeQR();
    }
    // Geo coordinates.
    // Match selections like "12.34 , 56.789".
    var re = new RegExp('^\\s*([0-9]\+\.[0-9]\+)\\s*(,\|;)\\s*([0-9]\+\.[0-9]\+)\\s*$');
    var matches = text.match(re);
    if (matches) {
      var value = 'geo:' + matches[1] + ',' + matches[3];
      addQR(value);
      return;
    }
    // Phone number.
    var re = new RegExp('^[^a-zA-Z]*$');
    var matches = text.match(re);
    if (matches) {
      var number = matches[0].replace(/[^0-9\+]/g, '');
      if (number == '') {
        return;
      }
      number = 'tel:' + number;
      addQR(number);
      return;
    }
  }

  function parseAndAddListeners() {

    // <span class="phone">0123456789</span>.
    var elements = document.getElementsByTagName('span');
    for(var i=0, len=elements.length; i < len; i++){
      var element = elements[i];
      if (element.className.match(/phone/)) {
        var number = element.innerHTML;
        number = number.replace(/[^0-9\+]/g, '');
        var value = 'tel:' + number;
        addListeners(element, value);
      }
    }
    var elements = document.getElementsByTagName('a');
    for(var i=0, len=elements.length; i < len; i++){
      var element = elements[i];
      if (element.href) {
        // elements with href="tel:..."
        var re = new RegExp('^tel:(.*)$');
        var matches = element.href.match(re);
        if (matches) {
          addListeners(element, element.href);
        }
        // elements with href="maps.google.com/?.*q=12,34"
        var re = new RegExp('maps.google.com.*q=([0-9\.]*),([0-9\.]*)');
        var matches = element.href.match(re);
        if (matches) {
          var value = 'geo:' + matches[1] + ',' + matches[2];
          addListeners(element, value);
        }
        // elements with href="@12.34,56.78"
        var re = new RegExp('google.*@([0-9]\+\.[0-9]\+),([0-9]\+\.[0-9]\+)');
        var matches = element.href.match(re);
        if (matches) {
          var value = 'geo:' + matches[1] + ',' + matches[2];
          addListeners(element, value);
        }
        // Wikipedia location elements.
        if (currentURL.hostname.match(/wikipedia\.org/)) {
          var re = new RegExp('tools.wmflabs.org/geohack/geohack\.php.*params=([0-9\.]*)_._([0-9\.]*)');
          var matches = element.href.match(re);
          if (matches) {
            var value = 'geo:' + matches[1] + ',' + matches[2];
            addListeners(element, value);
          }
        }
        // Openstreetmap coordinate link.
        if (currentURL.hostname.match(/openstreetmap\.org/)) {
          var re = new RegExp('/#map=[0-9]+/([0-9\.]+)/([0-9\.]+)');
          var matches = element.href.match(re);
          if (matches) {
            var value = 'geo:' + matches[1] + ',' + matches[2];
            addListeners(element, value);
          }
        }
        // Any "geo:" link.
        var re = new RegExp('geo:([0-9\.]+),([0-9\.]+)');
        var matches = element.href.match(re);
        if (matches) {
          var value = 'geo:' + matches[1] + ',' + matches[2];
          addListeners(element, value);
        }
      }
      // elements with data-number.
      if (element.dataset) {
        if (element.dataset.number) {
          var value = 'tel:' + element.dataset.number;
          addListeners(element, value);
        }
      }
    }
    // Facebook events, location.
    if (currentURL.hostname.match(/facebook\.com/)) {
      var elements = document.getElementsByTagName('img');
      for(var i=0, len=elements.length; i < len; i++){
        var element = elements[i];
        if (element.src) {
          var re = new RegExp('markers=([0-9\.]+)%2C([0-9\.]+)');
          var matches = element.src.match(re);
          if (matches) {
            var value = 'geo:' + matches[1] + ',' + matches[2];
            addListeners(element, value);
          }
        }
      }
    }
    // Google maps, info sidebar, phone numbers
    if (currentURL.hostname.match(/google/)) {
      var elements = document.getElementsByTagName('button');
      for(var i=0, len=elements.length; i < len; i++){
        var element = elements[i];
        if (element.dataset) {
          if (element.dataset.href) {
            addListeners(element, element.dataset.href);
          }
        }
      }
    }
    // Text selections.
    document.addEventListener('mouseup', handleTextSelect);
  }

  function manualTriggerWithDblClick() {
    document.body.appendChild(img);
    window.addEventListener('dblclick', parseAndAddListeners, true);
  }

  function codeForCurrentPage() {
    window.addEventListener('click', function (evt) {
      if (evt.detail === 3) {
        var value = window.location.href;
        addQR(value);
      }
    });
  }

  function parseURL(url) {
    var parser = document.createElement('a');
    parser.href = url;
    return parser;
  }

  var currentURL = parseURL(window.location.href);

  // Create code and add to body.
  var img = document.createElement("img");
  img.style.width = "100px";
  img.style.height = "100px";
  img.style.position = "fixed";
  img.style.left = "10px";
  img.style.bottom = "30px";
  img.style.zIndex = "999";
  img.style.visibility = "hidden";
  img.alt = "QR Code";

  img.addEventListener('mouseover', removeQR, true);

  manualTriggerWithDblClick();
  codeForCurrentPage();

}());

