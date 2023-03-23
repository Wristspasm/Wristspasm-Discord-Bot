const EndpointHandler = require("./handlers/EndpointHandler.js");
const { webMessage } = require("../Logger.js");
const config = require("../../config.json");
const express = require("express");
const http = require("http");
const fs = require("fs");

class WebServer {
  constructor(app) {
    this.app = app;

    this.port = config.web.port;

    //this.endpointHandler = new EndpointHandler(this);
  }

  connect() {
    var http = require("http");
    var fs = require("fs");

    const PORT = 1439;

    fs.readFile("./src/web/index.html", function (err, html) {
      if (err) throw err;
      http
        .createServer(function (request, response) {
          response.writeHeader(200, { "Content-Type": "text/html" });
          response.write(html);
          response.end();
        })
        .listen(PORT);
    });

    /*
    if (config.web.enabled === false) return;

    this.web = express();
    this.web.use(express.json());

    this.endpointHandler.registerEvents();  

    this.web.listen(this.port, () => {
      webMessage(`Server running at http://localhost:${this.port}/`);
    });*/
  }
}

module.exports = WebServer;
