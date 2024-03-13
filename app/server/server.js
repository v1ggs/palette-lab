// This file creates a server, runs the pallete html file,
// and reloads it on change.

const fs = require('fs');
const http = require('http');
const { URL } = require('url');
const { WebSocketServer } = require('ws');
const { devfile } = require('../config/paths.js');
const config = require('../config/load-config.js');
const watcher = require('../filesystem/watcher.js');

/**
 * Validates and normalizes a URL to use http or https.
 * If the URL does not specify a protocol, or specifies a protocol other
 * than https, it prepends "http://". If "https://" is specified, it is preserved.
 * @param {string} urlString - The original URL string.
 * @returns {string} Normalized URL with http or https protocol.
 */
const validateUrl = urlString => {
   // Check if the URL starts with any protocol using "://".
   if (!/^.+?:\/\//.test(urlString)) {
      // If no protocol is found, prepend "http://"
      urlString = 'http://' + urlString;
   } else if (/^https:\/\//.test(urlString)) {
      // If it explicitly starts with "https://", keep it as is.
      return urlString;
   } else {
      // For URLs with a protocol other than "https://",
      // replace the protocol with "http://".
      urlString = urlString.replace(/^.+?:\/\//, 'http://');
   }

   return urlString;
};

/**
 * Parses the URL from the config, ensuring it's properly formatted.
 */
const parseUrl = previewUrl => {
   const url = new URL(validateUrl(previewUrl));

   return {
      protocol: url.protocol,
      hostname: url.hostname,
      port: url.port,
      host: url.host, // hostname:port
      pathname: url.pathname,
   };
};

/**
 * Generates a script for live reloading using WebSocket.
 */
const liveReloadScript = previewUrl => {
   const url = parseUrl(previewUrl);

   return `
<script type="module">
  const connectWebSocket = () => {
    const ws = new WebSocket('ws://${url.hostname}:${url.port}');
    ws.onmessage = function(message) {
      console.log("Message received: ", message.data);
      if (message.data === 'reload') {
        window.location.reload();
      }
    };
    ws.onopen = function() {
      console.log("WebSocket connection established.");
    };
    ws.onerror = function(error) {
      console.error("WebSocket Error: ", error);
    };
    ws.onclose = function() {
      console.log("WebSocket connection closed. Attempting to reconnect...");
      setTimeout(connectWebSocket, 1000); // Attempt to reconnect after 1 second
    };
  };

  connectWebSocket();
</script>
`;
};

/**
 * Initializes and returns an HTTP server with live reload capabilities.
 */
const initServer = (file, previewUrl) => {
   const reloadScript = liveReloadScript(previewUrl);

   // file deepcode ignore NoRateLimitingForExpensiveWebOperation: no DDoS on a local server.
   // file deepcode ignore HttpToHttps: no need for https for a local preview.
   // Create the server using the preloaded reload script
   const server = http.createServer((req, res) => {
      fs.readFile(file, 'utf8', (err, data) => {
         if (err) {
            res.writeHead(404);
            res.end('404 Not Found');
            return;
         }

         // Inject the reload script into the HTML before sending the response
         const modifiedData = data.replace('</head>', `${reloadScript}</head>`);
         res.writeHead(200, { 'Content-Type': 'text/html' });
         res.end(modifiedData);
      });
   });

   return server;
};

/**
 * Main function to set up the server, WebSocket, and file watcher
 * for live reload.
 */
module.exports = () => {
   const cfg = config();
   const filePath = devfile.html;
   const url = parseUrl(cfg.config.previewUrl);
   const server = initServer(filePath, cfg.config.previewUrl);
   const wss = new WebSocketServer({ server });

   wss.on('connection', ws => {
      ws.on('message', data => {
         console.log('received: %s', data);
      });

      // ws.send("something");
   });

   server.listen(url.port, () => {
      console.log(
         `Palette Lab is running on ${url.protocol}//${url.hostname}:${url.port}`,
      );
      console.log(`Wait for the page to open...`);
      console.log(`Use CTRL+C to stop.`);

      // open is ESM only, and can't be `require()`ed.
      import('open').then(open => {
         open.default(`${url.protocol}//${url.hostname}:${url.port}`);
      });
   });

   // eslint-disable-next-line
   watcher(filePath, path => {
      // console.log(path + ' has changed. Reloading...');

      wss.clients.forEach(client => {
         // 1 = WebSocket.OPEN
         if (client.readyState === 1) {
            client.send('reload');
         }
      });
   });
};
