// ==UserScript==
// @author         Loskir
// @id             iitc-plugin-lockdown-changes
// @name           IITC plugin: Lockdown changes [2020]
// @description    Cooldown 300s→90s
// @category       Tweaks
// @version        1.0.4
// @updateURL      https://raw.githubusercontent.com/Loskir/iitc-plugins/master/lockdown-changes/lockdown-changes.meta.js
// @downloadURL    https://raw.githubusercontent.com/Loskir/iitc-plugins/master/lockdown-changes/lockdown-changes.user.js
// @match          https://intel.ingress.com/*
// @grant          none
// ==/UserScript==

function wrapper(plugin_info) {
  //PLUGIN AUTHORS: writing a plugin outside of the IITC build environment? if so, delete these lines!!
  //(leaving them in place might break the 'About IITC' page or break update checks)
  //plugin_info.buildName = 'iitc';
  //plugin_info.dateTimeVersion = '20170108.21732';
  //plugin_info.pluginId = 'dtreplace';
  //END PLUGIN AUTHORS NOTE

  // PLUGIN START ////////////////////////////////////////////////////////
  const setup = () => {
    window.getPortalHackDetails = function(d) {
      var heatsinks = getPortalModsByType(d, 'HEATSINK');
      var multihacks = getPortalModsByType(d, 'MULTIHACK');

      // first mod of type is fully effective, the others are only 50% effective
      var effectivenessReduction = [ 1, 0.5, 0.5, 0.5 ];

      var cooldownTime = 90;

      $.each(heatsinks, function(index,mod) {
        var hackSpeed = parseInt(mod.stats.HACK_SPEED)/1000000;
        cooldownTime = Math.round(cooldownTime * (1 - hackSpeed * effectivenessReduction[index]));
      });

      var numHacks = 4;

      $.each(multihacks, function(index,mod) {
        var extraHacks = parseInt(mod.stats.BURNOUT_INSULATION);
        numHacks = numHacks + (extraHacks * effectivenessReduction[index]);
      });

      return {cooldown: cooldownTime, hacks: numHacks, burnout: cooldownTime*(numHacks-1)};
    }}
  // PLUGIN END //////////////////////////////////////////////////////////

  setup.info = plugin_info; //add the script info data to the function as a property
  if (!window.bootPlugins) window.bootPlugins = [];
  window.bootPlugins.push(setup);
  // if IITC has already booted, immediately run the 'setup' function
  if (window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end

// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('(' + wrapper + ')(' + JSON.stringify(info) + ');'));
(document.body || document.head || document.documentElement).appendChild(script);

