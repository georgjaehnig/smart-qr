// ==UserScript==
// @name        Smart QR
// @namespace   http://tampermonkey.net/
// @description Detect links to phone numbers and locations and display a QR code on mouseover.
// @include     http://*
// @include     https://*
// @version     0.1
// ==/UserScript==

var i;

function addQR(event) {
	i = document.createElement("img");
	//console.log(encodeURIComponent(event.target.smartQRvalue));
	i.src = "https://qrcode.kaywa.com/img.php?s=6&d=" + encodeURIComponent(event.target.smartQRvalue);
	i.style.width = "100px";
	i.style.height = "100px";
	i.style.position = "fixed";
	i.style.top = "0px";
	i.alt = "QR Code";
	document.body.appendChild(i);
};

function removeQR() {
	document.body.removeChild(i);
};

function addListeners(element, value) {
	element.addEventListener('mouseover', addQR);
	element.addEventListener('mouseout', removeQR);
	element.smartQRvalue = value;
}

(function () {
  "use strict";

  //console.log(document.getElementsByName);
	
  var links = document.getElementsByTagName('a');
	for(var i=0, len=links.length; i < len; i++){
		var link = links[i];
		if (link.href) {
			var re = new RegExp('^tel:(.*)$');
			var matches = link.href.match(re);
			if (matches) {
				//link.setAttribute('onmouseover', showQR);
				addListeners(link, link.href);
			}
		}
		//if (link.attributes.title == "Über Hangouts anrufen") {
		if (link.dataset) {
			if (link.dataset.number) {
				addListeners(link, link.dataset.number);
			}
		}
	}
}());
