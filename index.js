const socket = require("socket.io-client");
const axios = require("axios");

const { EXPOSE_PORT, LICENSE, SERVER } = process.env;

// noinspection JSValidateTypes
const io = socket(SERVER || "http://localhost:8080");

io.on("connect", () => {
  console.log("connected");
});

io.on("request", async (data) => {
  const { method, path, body: params, headers, time } = data;
  if (!path.includes(LICENSE)) return;
  const { data: body, headers: header } = await axios({
    headers,
    data: params,
    method,
    url: EXPOSE_PORT
      ? `http://localhost:${EXPOSE_PORT}${path}`
      : "http://localhost:8080/ok",
  });
  io.emit("response", { body, time, ...header });
});
