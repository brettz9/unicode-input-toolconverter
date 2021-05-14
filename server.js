'use strict';

const http = require('http');
const statik = require('@brettz9/node-static');
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
        const out = fontInfo[0]._items.flatMap((arr, {typefaces}) => {
          return typefaces.map((typeface) => typeface.family);
        });
        res.end(JSON.stringify([...new Set(out)].sort()));
      } catch (err) {
        // eslint-disable-next-line no-console -- CLI
        console.error('Error', err);
      }
    })();
    return;
  }

  req.addListener('end', function () {
    file.serve(req, res);
  }).resume();
}).listen(8000);
