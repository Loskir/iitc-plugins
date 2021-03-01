// ==UserScript==
// @author         Loskir
// @name           IITC plugin: Less clutter highlighter
// @category       Highlighter
// @version        1.0.0
// @description    Provides a highlighter that makes all portals render as smaller solid circles
// @id             less-clutter-highlighter
// @downloadURL    https://github.com/Loskir/iitc-plugins/raw/master/less-clutter-highlighter/less-clutter-highlighter.user.js
// @match          https://intel.ingress.com/*
// @grant          none
// ==/UserScript==

function wrapper(plugin_info) {
  // ensure plugin framework is there, even if iitc is not yet loaded
  if(typeof window.plugin !== 'function') window.plugin = function() {};


  // use own namespace for plugin
  window.plugin.lessClutterHighlighter = function() {};

  window.plugin.lessClutterHighlighter.highlight = function(data) {
    const details = data.portal.options
    data.portal.setStyle({
      stroke: true,
      color: COLORS[details.team],
      weight: 1,
      opacity: 1,
      fill: true,
      fillColor: COLORS[details.team],
      fillOpacity: 1,
      dashArray: null
    })
    data.portal.setRadius(6)
  }

  const setup =  function() {
    window.addPortalHighlighter('Less clutter', window.plugin.lessClutterHighlighter.highlight);
  }

  setup.info = plugin_info; //add the script info data to the function as a property
  if(!window.bootPlugins) window.bootPlugins = [];
  window.bootPlugins.push(setup);
// if IITC has already booted, immediately run the 'setup' function
  if(window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);

