const { verifyToken } = require("./src/api/v1/auth/auth");
const {
  fullname,
  refresh,
  auth,
  signin,
  signup,
} = require("./src/api/v1/auth/authController");
const {
  boardsController,
  addBoardController,
  deleteBoardController,
  updateBoardController,
} = require("./src/api/v1/board/boardController");
const {
  addCardController,
  cardController,
  updateCardController,
  deleteCardController,
} = require("./src/api/v1/card/cardController");
const {
  inviteMemberController,
  acceptInviteController,
  removeMemberController,
} = require("./src/api/v1/member/memberController");
const {
  addTaskController,
  taskController,
  updateTaskController,
  deleteTaskController,
  updateTaskIndexController,
} = require("./src/api/v1/task/taskController");

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS, GET, POST, PUT, PATCH, DELETE",
  "Access-Control-Max-Age": 2592000,
  "Access-Control-Allow-Headers": "content-type",
};

const routes = {
  post: {
    "/auth/signup": async (body) => await signup(body),
    "/auth/signin": async (body) => await signin(body),
    "/auth": async (body) => await auth(body),
    "/auth/refresh": async (body) => await refresh(body),
    "/auth/fullname": async (body, accessToken) =>
      await fullname(body, accessToken),
    "/boards": async (body, accessToken) =>
      await addBoardController(body, accessToken),
    "/cards": async (body, accessToken) =>
      await addCardController(body, accessToken),
    "/tasks": async (body, accessToken) =>
      await addTaskController(body, accessToken),
  },
  get: {
    "/boards": async (body, accessToken) =>
      await boardsController(body, accessToken),
    "/boards/accept": async (body, accessToken) =>
      await acceptInviteController(body, accessToken),
    "/cards": async (body, accessToken) =>
      await cardController(body, accessToken),
    "/tasks": async (body, accessToken) =>
      await taskController(body, accessToken),
  },
  put: {
    "/boards/update": async (body, accessToken) =>
      await updateBoardController(body, accessToken),
    "/boards/invite": async (body, accessToken) =>
      await inviteMemberController(body, accessToken),
    "/boards/remove": async (body, accessToken) =>
      await removeMemberController(body, accessToken),
    "/cards/update": async (body, accessToken) =>
      await updateCardController(body, accessToken),
    "/tasks/update": async (body, accessToken) =>
      await updateTaskController(body, accessToken),
    "/tasks/update/index": async (body, accessToken) =>
      await updateTaskIndexController(body, accessToken),
  },
  delete: {
    "/boards/delete": async (body, accessToken) =>
      await deleteBoardController(body, accessToken),
    "/cards/delete": async (body, accessToken) =>
      await deleteCardController(body, accessToken),
    "/tasks/delete": async (body, accessToken) =>
      await deleteTaskController(body, accessToken),
  },
};

function getParams(params) {
  return params
    .split("&")
    .map((p) => {
      const [key, value] = p.split("=");
      return { [key]: value };
    })
    .reduce((acc, cur) => {
      return { ...acc, ...cur };
    });
}

function getReqData(req) {
  return new Promise((resolve, reject) => {
    try {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        resolve(body);
      });
    } catch (error) {
      reject(error);
    }
  });
}

async function getHandler(req, res) {
  const { url } = req;
  var [path, params] = url.split("?");
  params = params ? getParams(params) : [];
  if (Object.keys(routes.get).includes(path)) {
    let accessToken = req.headers.authorization;
    accessToken = accessToken ? accessToken.split(" ")[1] : null;
    const result = await routes.get[path](params, accessToken);
    res.writeHead(200, { "Content-Type": "application/json", ...cors });
    res.end(JSON.stringify(result));
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain", ...cors });
  res.end("Not Found\n");
}

async function postHandler(req, res) {
  const { url } = req;
  if (Object.keys(routes.post).includes(url)) {
    let body = JSON.parse(await getReqData(req));
    let accessToken = req.headers.authorization;
    accessToken = accessToken ? accessToken.split(" ")[1] : null;
    var result = await routes.post[url](body, accessToken);
    if (result?.error) {
      res.writeHead(result.code, {
        "Content-Type": "application/json",
        ...cors,
      });
      res.end(JSON.stringify(result));
      return;
    }
    res.writeHead(201, { "Content-Type": "application/json", ...cors });
    res.end(JSON.stringify(result));
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain", ...cors });
  res.end("Not Found\n");
}

async function putHandler(req, res) {
  const { url } = req;
  if (Object.keys(routes.put).includes(url)) {
    let body = JSON.parse(await getReqData(req));
    let accessToken = req.headers.authorization;
    accessToken = accessToken ? accessToken.split(" ")[1] : null;
    var result = await routes.put[url](body, accessToken);
    if (result?.error) {
      res.writeHead(result.code, {
        "Content-Type": "application/json",
        ...cors,
      });
      res.end(JSON.stringify(result));
      return;
    }
    res.writeHead(200, { "Content-Type": "application/json", ...cors });
    res.end(JSON.stringify(result));
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain", ...cors });
  res.end("Not Found\n");
}

async function deleteHandler(req, res) {
  const { url } = req;
  var [path, params] = url.split("?");
  params = params ? getParams(params) : [];
  if (Object.keys(routes.delete).includes(path)) {
    let accessToken = req.headers.authorization;
    accessToken = accessToken ? accessToken.split(" ")[1] : null;
    var result = await routes.delete[path](params, accessToken);
    if (result?.error) {
      res.writeHead(result.code, {
        "Content-Type": "application/json",
        ...cors,
      });
      res.end(JSON.stringify(result));
      return;
    }
    res.writeHead(200, { "Content-Type": "application/json", ...cors });
    res.end(JSON.stringify(result));
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain", ...cors });
  res.end("Not Found\n");
}

const handlers = {
  get: getHandler,
  post: postHandler,
  put: putHandler,
  delete: deleteHandler,
};

async function router(req, res) {
  const { method } = req;

  const handler = handlers[method.toLowerCase()];
  if (handler) {
    await handler(req, res);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found\n");
  }
}

module.exports = { router };
