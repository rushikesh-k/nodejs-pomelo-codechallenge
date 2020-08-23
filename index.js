"use strict";

const Hapi = require("@hapi/hapi");
const Joi = require("joi");
const Inert = require("@hapi/inert");
const Vision = require("@hapi/vision");
const HapiSwagger = require("hapi-swagger");

const swaggerOptions = {
  info: {
    title: "Node JS Appliaction - Hapi Framework Documentation",
    version: "1.0.0.0",
  },
};

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
  });

  server.route({
    method: "GET",
    path: "/",
    options: {
      handler: (request, h) => {
        return "Launch Page";
      },
    },
  });

  server.route({
    method: "POST",
    path: "/request",
    handler: (request, h) => {
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
      return result;
    },
    options: {
      tags: ["api"],
      validate: {
        payload: Joi.object().required(),
      },
    },
  });

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
      documentationPage: true,
      documentationPath: "/docs",
    },
  ]);

  try {
    await server.start();
    console.log("Server running at:", server.info.uri);
  } catch (err) {
    console.log(err);
  }
};

function findChildren(y, data) {
  for (let z = 0, zlen = data.length; z < zlen; z++) {
    if (y["id"] === data[z]["parent_id"] && y["id"] != data[z]["id"]) {
      y["children"].push(findChildren(data[z], data));
    }
  }
  return y;
}

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
