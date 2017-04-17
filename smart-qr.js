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
    console.log(value);
    if (value == '') {
      return;  
    }
    i.src = "https://qrcode.kaywa.com/img.php?s=6&d=" + encodeURIComponent(value);
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
    if ((matches) && (matches[0] != '')) {
      var number = matches[0].replace(/[^0-9\+]/g, '');
      if (number == '') {
        return;  
      }
      number = 'tel:' + number;
      addQR(number);  
    }
  }

  function parseAndAddListeners() {
    var links = document.getElementsByTagName('a');
    for(var i=0, len=links.length; i < len; i++){
      var link = links[i];
      if (link.href) {
        // Links with href="tel:..."
        var re = new RegExp('^tel:(.*)$');
        var matches = link.href.match(re);
        if (matches) {
          addListeners(link, link.href);
        }
        // Links with href="maps.google.com/?.*q=12,34"
        var re = new RegExp('maps.google.com.*q=([0-9\.]*),([0-9\.]*)');
        var matches = link.href.match(re);
        if (matches) {
          var value = 'geo:' + matches[1] + ',' + matches[2];
          addListeners(link, value);
        }
        // Wikipedia location links.
        var re = new RegExp('tools.wmflabs.org/geohack/geohack\.php.*params=([0-9\.]*)_._([0-9\.]*)');
        var matches = link.href.match(re);
        if (matches) {
          var value = 'geo:' + matches[1] + ',' + matches[2];
          addListeners(link, value);
        }
      }
      // Links with data-number.
      if (link.dataset) {
        if (link.dataset.number) {
          addListeners(link, link.dataset.number);
        }
      }
    }
    var links = document.getElementsByTagName('button');
    for(var i=0, len=links.length; i < len; i++){
      var link = links[i];
      if (link.dataset) {
        if (link.dataset.href) {
          addListeners(link, link.dataset.href);
        }
      }
    }
    document.addEventListener('mouseup', handleTextSelect);
  }

  function manualTriggerWithDblClick() {
    window.addEventListener('dblclick', parseAndAddListeners, true);
  }

  "use strict";

  // Create code and add to body.
  var i = document.createElement("img");
  i.style.width = "100px";
  i.style.height = "100px";
  i.style.position = "fixed";
  i.style.bottom = "20px";
  i.style.zIndex = "999";
  i.style.visibility = "hidden";
  i.alt = "QR Code";

  document.body.appendChild(i);

  parseAndAddListeners();
  manualTriggerWithDblClick();

}());

