var port = self.port;

//port.on('init', function(){

  port.emit('jack', {
    title: document.title,
    url: window.location.href
  });

  window.history.back();
  
//});

