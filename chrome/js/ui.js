function init( graphenHistory ){

  var body = document.body;

  body.classList.add('loaded');

  var hist = window.graphenHistory = graphenHistory;
  var eles = [];
  var nodes = [];
  var edges = [];

  for( var tabId in hist ){
    var tab = hist[ tabId ];

    for( var i = 0; i < tab.length; i++ ){
      var entry = tab[i];
      var maxLabelLen = 32;

      entry.label = moment(entry.time).format('HH:mm') + ' : ' + ( entry.title.length < maxLabelLen ? entry.title : entry.title.substring(0, maxLabelLen) + '...' );

      // add history node
      nodes.push({
        group: 'nodes',
        data: entry
      });

      if( entry.fromTab ){
        edges.push({
          group: 'edges',
          data: {
            source: entry.fromTab,
            target: entry.id
          }
        });
      }

      if( i > 0 ){
        edges.push({
          group: 'edges',
          data: {
            source: nodes[ nodes.length - 2 ].data.id,
            target: entry.id
          }
        });
      }

    }

  }

  eles = nodes.concat( edges );

  var cy = cytoscape({
    container: document.getElementById('cy'),

    layout: {
      name: 'dagre'
    },

    style: [
      {
        selector: 'node',
        css: {
          'content': 'data(label)',
          'font-size': 8,
          'color': '#888',
          'width': 100,
          'height': 70,
          'border-color': '#ccc',
          'border-opacity': 0.5,
          'border-width': 1,
          'shape': 'roundrectangle',
          'background-image': 'data(thumbnail)',
          'background-fit': 'cover'
        }
      },

      {
        selector: 'edge',
        css: {
          'width': 6,
          'target-arrow-shape': 'triangle',
          'line-color': '#ddd',
          'target-arrow-color': '#ddd',
          'opacity': 0.4
        }
      }
    ],

    elements: eles
  });

  cy.on('tap', 'node', function( e ){
    var node = this;

    window.open( node.data('url') );
  });

}