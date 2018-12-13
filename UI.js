#!/usr/bin/env node

var fs = require("fs");
//var path = require("path");
var jsdom = require("jsdom"); 

function changeBackgroundColor(color){
    debugger;
    var htmlSource = fs.readFileSync("UI.html", "utf8");
    var $ = initialize_jQuery(htmlSource);

    $("body").css('background-color', 'red');
    // GOD THIS IS UGLY!!!
    fs.writeFile("UI.html", window.document.querySelector('html').outerHTML, function(err){
        debugger;
    });
    console.log();
}

function documentToSource(doc) {
    // The non-standard window.document.outerHTML also exists,
    // but currently does not preserve source code structure as well

    // The following two operations are non-standard
    return doc.doctype.toString()+doc.innerHTML;
}

function initialize_jQuery(source) {
    const { JSDOM } = jsdom;
    const { window } = new JSDOM(source);
    var $ = jQuery = require('jquery')(window);

    global.window = window;

    return $;
}

exports.changeBackgroundColor = changeBackgroundColor;