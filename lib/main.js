var buttons = require('sdk/ui/button/action');
var tabs = require('sdk/tabs');
var history = require('sdk/places/history');

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
      url: 'chrome://graphen/content/index.html',

      onReady: function( tab ){
        var historyFromApi = {};

        for( var i = 0; i < tabs.length; i++ ){
          var tabi = tabs[i];

          if( tabi === tab ){ continue; }

          console.log('Jacking tab : ' + tabi.title);
          //console.dir( tabi );

          tabi.on('ready', function( res ){
            console.log('ready');
            port.emit('init');
          });

          var jack = function( tabi ){
            var jacker = tabi.attach({
              contentScriptFile: './jack/tab-history-jack.js'
            });

            var port = jacker.port;

            port.on('jack', function( msg ){
              console.log('jacked');
              console.dir({
                title: tabi.title,
                url: tabi.url
              });

              jack( tabi );
            });

            port.emit('init');
          };

          jack( tabi );

        }

        tab.attach({
          contentScript: 'document.historyFromApi = ' + JSON.stringify( historyFromApi ) + ';'
        });
      }
    });
  }
});
