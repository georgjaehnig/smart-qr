// ==UserScript==
// @name        Smart QR
// @namespace   http://tampermonkey.net/
// @description Detect links to phone numbers and locations and display a QR code on mouseover.
// @include     http://*
// @include     https://*
// @version     0.1
// ==/UserScript==

var i;

function addQR(value) {
  console.log(encodeURIComponent(value));
  i = document.createElement("img");
  i.src = "https://qrcode.kaywa.com/img.php?s=6&d=" + encodeURIComponent(value);
  i.style.width = "100px";
  i.style.height = "100px";
  i.style.position = "fixed";
  i.style.top = "0px";
  i.style.zIndex = "999";
  i.alt = "QR Code";
  document.body.appendChild(i);
};

function removeQR() {
  document.body.removeChild(i);
};

function addListeners(element, value) {
  element.addEventListener('mouseover', function() { addQR(value); } );
  element.addEventListener('mouseout', function() { removeQR(); });
  element.smartQRvalue = value;
}

function handleTextSelect(event) {
  return;
  var selection = document.getSelection();
  var text = selection.toString();
  console.log(selection);
  addListeners(selection.baseNode, text);
}

(function () {
  "use strict";
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
  // document.addEventListener('mouseup', handleTextSelect);
}());
