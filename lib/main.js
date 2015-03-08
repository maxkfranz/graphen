var buttons = require('sdk/ui/button/action');
var tabs = require('sdk/tabs');
var history = require('sdk/places/history');
var tabhist = {};
var log = function(){ return console.log.apply( console, arguments ); };
var uiUrl = 'chrome://graphen/content/index.html';

// snoop on tab pageload activity to get the history
tabs.on('pageshow', function( tab ){
  if( tab.url === uiUrl ){ return; }

  var id = 'tab' + tab.id;
  var th = tabhist[ id ] = tabhist[ id ] || [];
  var ent = {
    title: tab.title,
    url: tab.url,
    thumbnail: tab.getThumbnail(),
    time: Date.now()
  };
  var prevEnt = th[ th.length - 1 ];

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
