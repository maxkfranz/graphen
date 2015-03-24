var buttons = require('sdk/ui/button/action');
var tabs = require('sdk/tabs');
var history = require('sdk/places/history');
var uuid = require('./uuid');
var notifications = require("sdk/notifications");
var tabhist = {};
var log = function(){ return console.log.apply( console, arguments ); };
var uiUrl = 'chrome://graphen/content/index.html';
var last;

// log = function(){}; // disable logging

notifications.notify({
  title: 'Graphen',
  text: 'Graphen has started logging your current session history.',
  // data: '',
  onClick: function( data ){
  }
});

// snoop on tab pageload activity to get the history
tabs.on('pageshow', function( tab ){
  if( tab.url === uiUrl ){ return; }

  var id = 'tab' + tab.id;
  var newTab = !tabhist[ id ];
  var th = tabhist[ id ] = tabhist[ id ] || [];
  var ent = {
    id: id + '-' + uuid.create().toString(),
    title: tab.title,
    url: tab.url,
    thumbnail: tab.getThumbnail(),
    time: Date.now()
  };
  var prevEnt = th[ th.length - 1 ]; // in this tab chain

  if( newTab && last && last.link.url === ent.url ){
    log('Opened new tab from prior tab');

    ent.fromTab = last.ent.id;
  }

  th.push( ent );

  if( prevEnt && prevEnt.linkout ){
    ent.linkin = prevEnt.linkout;
  }

  log('Added history entry for tab ', id, {
    title: ent.title, 
    url: ent.url
  });

  log('Linkjacking tab ', id);

  var linkjacker = tab.attach({
    contentScriptFile: './linkjack.js'
  });

  var port = linkjacker.port;

  port.on('linkjack', function( link ){
    log('Linkjacked ', link);

    ent.linkout = link;

    last = {
      link: link,
      ent: ent
    };

    //log('Updated history log', tabhist);
  });

  //log('Updated history log', tabhist);
});



var button = buttons.ActionButton({
  id: 'graphen-link',
  label: 'Open Graphen',
  icon: {
    '16': './icon-16.png',
    '32': './icon-32.png',
    '64': './icon-64.png'
  },

  onClick: function( state ){
    tabs.open({
      url: uiUrl,

      onReady: function( tab ){
        tab.attach({
          contentScript: 'init(' + JSON.stringify( tabhist ) + '); '
        });
      }
    });
  }
});
