const http = require('http');
const statik = require('node-static');
const {systemProfiler: asp} = require('apple-system-profiler');

const file = new statik.Server({
  headers: {
    'Content-Type': 'charset=utf-8'
  }
});

http.createServer(function (req, res) {
  if (req.url.startsWith('/.')) {
    res.writeHead(404);
    res.end('Bad request');
    return;
  }
  if (req.url === '/fonts') {
    res.writeHead(200, {
      'Cache-Control': 'no-cache, must-revalidate',
      'Content-Type': 'application/json'
    });
    (async () => {
      try {
        const fontInfo = await asp({
          normalize: false,
          detailLevel: 'full',
          dataTypes: [
            'SPFontsDataType'
          ]
        });
        // Todo: Switch to `flatMap` when available
        const out = fontInfo[0]._items.reduce((arr, {typefaces}) => {
          arr.push(...typefaces.map((typeface) => typeface.family));
          return arr;
        }, []);
        res.end(JSON.stringify([...new Set(out)].sort()));
      } catch (err) {
        console.log('Error', err);
      }
    })();
    return;
  }

  req.addListener('end', function () {
    file.serve(req, res);
  }).resume();
}).listen(8000);
