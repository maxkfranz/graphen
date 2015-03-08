var port = self.port;

window.addEventListener('click', function( e ){
  var tgt = e.target;
  var isLink = tgt.nodeName.toLowerCase() === 'a' && tgt.href && tgt.href.length > 0;

  if( isLink ){
    port.emit('linkjack', {
      url: tgt.href,
      text: tgt.text
    });
  }
});
