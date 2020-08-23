"use strict";

const Hapi = require("@hapi/hapi");
const Joi = require("joi");
const Inert = require("@hapi/inert");
const Vision = require("@hapi/vision");

const server = Hapi.server({
  port: 3000,
  host: "localhost",
});

server.route({
  method: "GET",
  path: "/",
  handler: function () {
    return "Hello World!";
  },
});

server.route({
  method: "POST",
  path: "/request",
  handler: (request, h) => {
    // console.log(request.payload);
    const payload = request.payload;
    var iArray = [];
    var result = [];
    for (var x in payload) {
      var iObj = payload[x];
      for (var y in iObj) {
        iArray.push(iObj[y]);
      }
    }
    if (iArray.length > 0) {
      var data = iArray;
      iArray.forEach((x) => {
        if (x["level"] === 0) {
          result.push(findChildren(x, data));
        }
      });
    }
    console.log(JSON.stringify(result));
    return result;
  },
  options: {
    tags: ["api"],
    validate: {
      payload: Joi.object().required(),
    },
  },
});

function findChildren(y, data) {
  for (let z = 0, zlen = data.length; z < zlen; z++) {
    if (y["id"] === data[z]["parent_id"] && y["id"] != data[z]["id"]) {
      y["children"].push(findChildren(data[z], data));
    }
  }
  return y;
}

exports.init = async () => {
  await server.initialize();
  return server;
};

exports.start = async () => {
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
  return server;
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});
