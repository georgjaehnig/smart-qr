// ==UserScript==
// @name        Smart QR
// @namespace   http://tampermonkey.net/
// @description Detect links to phone numbers and locations and display a QR code on mouseover.
// @include     http://*
// @include     https://*
// @version     0.1
// ==/UserScript==


(function () {

  function addQR(value) {
    //console.log(value);
    if (value == '') {
      return;
    }
    i.src = 'https://chart.apis.google.com/chart?cht=qr&chs=100x100&chld=L|0&chl=' + encodeURIComponent(value);
    i.style.visibility = "visible";
  };

  function removeQR() {
    i.style.visibility = "hidden";
  };

  function addListeners(element, value) {
    element.addEventListener('mouseover', function() { addQR(value); } );
    element.addEventListener('mouseout', function() { removeQR(); });
    element.smartQRvalue = value;
  }

  function handleTextSelect(event) {
    var selection = document.getSelection();
    var text = selection.toString();
    if (text == '') {
      removeQR();
    }
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
          addListeners(element, element.dataset.number);
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
    window.addEventListener('dblclick', parseAndAddListeners, true);
  }

  function parseURL(url) {
    var parser = document.createElement('a');
    parser.href = url;
    return parser;
  }

  "use strict";

  var currentURL = parseURL(window.location.href);

  // Create code and add to body.
  var i = document.createElement("img");
  i.style.width = "100px";
  i.style.height = "100px";
  i.style.position = "fixed";
  i.style.left = "10px";
  i.style.bottom = "30px";
  i.style.zIndex = "999";
  i.style.visibility = "hidden";
  i.alt = "QR Code";

  document.body.appendChild(i);

  parseAndAddListeners();
  manualTriggerWithDblClick();

}());

