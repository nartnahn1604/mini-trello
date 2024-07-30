const Constants = {
  API_URL: "http://localhost:3001",
  END_POINT: {
    AUTH: {
      SIGN_UP: "/auth/signup",
      SIGN_IN: "/auth/signin",
      VERIFY_ACCESS: "/auth",
      VERIFY_REFRESH: "/auth/refresh",
      UPDATE: "/auth/fullname",
    },
    BOARD: {
      CREATE: "/boards",
      GET: "/boards",
      UPDATE: "/boards/update",
      DELETE: "/boards/delete",
    },
    CARD: {
      CREATE: "/cards",
      GET: "/cards",
      UPDATE: "/cards/update",
      DELETE: "/cards/delete",
    },
    TASK: {
      CREATE: "/tasks",
      GET: "/tasks",
      UPDATE: "/tasks/update",
      UPDATE_INDEX: "/tasks/update/index",
      DELETE: "/tasks/delete",
    },
    MEMBER: {
      INVITE: "/boards/invite",
      REMOVE: "/boards/remove",
    },
  },
  MQTT: {
    URL: "127.0.0.1",
    PORT: "1884",
    USERNAME: "",
    PASSWORD: "",
    CLIENT_ID: "trello",
  },
};

export default Constants;
