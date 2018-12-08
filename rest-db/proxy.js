const commander = require('commander');
const http = require('http');

commander
  .version('0.0.1')
  .option('--port <port>')
  .option('--proxy-host <host>')
  .option('--proxy-port <port>')
  .parse(process.argv);

const port = commander.port || 21982;
const proxyHost = commander.proxyHost;
if (!proxyHost) {
  console.log('--proxy-host is required');
  process.exit(1);
}

const proxyPort = commander.proxyPort;
if (!proxyPort) {
  console.log('--proxy-port is required');
  process.exit(1);
}

const server = http.createServer(function (req, res) {
  if (Math.random() < 0.5) {
    res.write('oops!');
    res.end();
    return;
  }

  const options = {
    hostname: proxyHost,
    port: proxyPort,
    path: req.url,
    method: req.method,
    headers: req.headers,
  };
  const req2 = http.request(options, res2 => {
    res.writeHead(res2.statusCode, res2.headers);
    res2.on('data', chunk => res.write(chunk));
    res2.on('end', () => res.end());
  });

  req.on('data', chunk => req2.write(chunk));
  req.on('end', () => req2.end());
});

server.listen(port);
console.log(`listen on ${port}`);
