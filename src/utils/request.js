const axios = require("axios");
const API_PATH = process.env.API_PATH;
const X_KEY = process.env.CROSS_COMMUNICATION_KEY || "";

export const request = (opts) => {
  const { path, method, data, ...newOpts } = opts;
  const myMethod = (method || "POST").toLowerCase();
  const hostname = opts.hostname || API_PATH;
  const url = opts.url || `${hostname}${path}`;

  const myOpts = {
    ...newOpts,
    headers: {
      ...opts.headers,
      Token: X_KEY,
      "Content-Type": "application/json",
    },
  };

  if (myMethod === "post" || myMethod === "put" || myMethod === "patch") {
    // the order of params is matter
    console.log("request", myMethod, url, data, myOpts);
    return axios[myMethod](url, data, myOpts).then((resp) => {
      console.log("result", resp.data);
      return resp.data;
    });
  }

  // the order of params is matter
  console.log("request", myMethod, url, myOpts);
  return axios[myMethod](url, myOpts).then((resp) => {
    console.log("result", resp.data);
    return resp.data;
  });
};
