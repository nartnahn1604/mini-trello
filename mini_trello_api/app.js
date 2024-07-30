const http = require("http");
const { router } = require("./routes");
const port = process.env.PORT || 3001;

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(200, {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "OPTIONS, GET, POST, PUT, PATCH, DELETE",
      "access-control-allow-headers":
        "Content-Type, Accept, Origin, Authorization",
    });
    res.end();
    return;
  }

  await router(req, res);
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
