


var http = require('http'),
httpProxy = require('http-proxy');
//
// Create your proxy server and set the target in the options.
//
httpProxy.createProxyServer({secure: true,
  target:'http://localhost:8080'}).listen(9000); // See (†)


/*
server = http.createServer(function (req, res) {

    res.writeHead(200, { 'Content-Type': 'text/plain' });
  
    res.write('Proxy Request was Successful!' + '\n' + JSON.stringify(req.headers, true, 2));
  
    res.end();
  
  });
  
  server.listen(3000);
  */