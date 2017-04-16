// ==UserScript==
// @name        Smart QR
// @namespace   http://tampermonkey.net/
// @description Smart codes
// @include     http://*
// @include     https://*
// @version     0.1
// ==/UserScript==

(function () {
  "use strict";
	/*
  var body = document.body;
  var i = document.createElement("img");
  i.src = "https://qrcode.kaywa.com/img.php?s=6&d=code";
  i.style.width = "100px";
  i.style.height = "100px";
  i.style.position = "absolute";
  i.style.top = "0px";
  i.alt = "QR Code";    
  body.appendChild(i);
	*/
  //console.log(document.getElementsByName);
  var links = document.getElementsByTagName('a');
  console.log(links);
}());
