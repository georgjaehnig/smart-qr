# Smart QR

You want to 

- call the phone number on a web page with your mobile phone? 
- add the location of Facebook event to you smartphone map app?
- add the phone number someone sent you to your smartphone contacts?

Then this userscript might be for you.

## Prerequisites

Userscripts are added to your browser and then run on webpages you are visiting. Depending on your browser, you first need a plugin for userscripts, for instance:

- for Firefox: [Greasemonkey](https://addons.mozilla.org/firefox/addon/greasemonkey/) 
- for Chrome: [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)

To read the QR codes displayed by Smart QR, on your smartphone you need a QR reader app, for instance:

- for Android: [Barcode Scanner](https://play.google.com/store/apps/details?id=com.google.zxing.client.android)
- for iOS / Apple: [Quick Scan - QR Code Reader](https://itunes.apple.com/app/qr-code-scanner/id483336864) for iOS

## Install

Once you have one of the userscript browser extensions installed in your browser, you can install Smart QR. Go to

https://openuserjs.org/scripts/jorges/Smart_QR

and click ***Install***.

# Usage

When visiting any web page:

## Phone numbers and locations

1. ***Double click*** somewhere on the page to get the script started. (This is important, otherwise nothing will happen.)
2. Now you can either
   - Hover the mouse over:
     - a [link to a phone number](tel:+123456789)
     - a [link to Google Maps with coordinates](https://www.google.com/maps?q=52.51627,13.37705)
   - select a text containing
     - geo coordinates, like 52.51627,13.37705
     - a sequence of numbers, like 123456789
3. Smart QR will display a QR code in the lower left corner containing the phone number or the location. When scanning them with your phone, you will be directly offered to make a call or to open your favourite map app with this location.

