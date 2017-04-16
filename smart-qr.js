// ==UserScript==
// @name        Smart QR
// @namespace   http://tampermonkey.net/
// @description Smart codes
// @include     http://*
// @include     https://*
// @version     0.1
// ==/UserScript==

var i;

function addQR(event) {
	i = document.createElement("img");
	console.log(encodeURIComponent(event.target.smartQRvalue));
	i.src = "https://qrcode.kaywa.com/img.php?s=6&d=" + encodeURIComponent(event.target.smartQRvalue);
	i.style.width = "100px";
	i.style.height = "100px";
	i.style.position = "absolute";
	i.style.top = "0px";
	i.alt = "QR Code";
	document.body.appendChild(i);
};

function removeQR() {
	document.body.removeChild(i);
};

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
				link.addEventListener('mouseover', addQR);
				link.addEventListener('mouseout', removeQR);
				link.smartQRvalue = link.href;
			}
		}
		//console.log(link.href);
	}
}());
