"use strict";

const Lab = require("@hapi/lab");
const { expect } = require("@hapi/code");
const {
  before,
  afterEach,
  beforeEach,
  describe,
  it,
} = (exports.lab = Lab.script());
const { init } = require("../lib/server");

describe("GET /", () => {
  let server;

  beforeEach(async () => {
    server = await init();
  });

  afterEach(async () => {
    await server.stop();
  });

  it("responds with 200", async () => {
    const res = await server.inject({
      method: "get",
      url: "/",
    });
    expect(res.statusCode).to.equal(200);
  });
});

describe("POST /", () => {
  let server;
  let options;
  before(async (done) => {
    options = {
      method: "POST",
      url: "/request",
      payload: {
        "0": [
          { id: 10, title: "House", level: 0, children: [], parent_id: null },
        ],
        "1": [
          { id: 12, title: "Red Roof", level: 1, children: [], parent_id: 10 },
          { id: 18, title: "Blue Roof", level: 1, children: [], parent_id: 10 },
          { id: 13, title: "Wall", level: 1, children: [], parent_id: 10 },
        ],
        "2": [
          {
            id: 17,
            title: "Blue Window",
            level: 2,
            children: [],
            parent_id: 12,
          },
          { id: 16, title: "Door", level: 2, children: [], parent_id: 13 },
          {
            id: 15,
            title: "Red Window",
            level: 2,
            children: [],
            parent_id: 12,
          },
        ],
      },
    };

    server = await init();
  });

  it("responds with 200", async () => {
    const res = await server.inject(options, (response) => {
      done();
    });
    expect(res.statusCode).to.equal(200);
  });
});
