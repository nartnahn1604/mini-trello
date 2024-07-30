const {
  createNewUser,
  verifyCode,
  verifyToken,
  getUserFullname,
  createToken,
  updateUserFullname,
} = require("./auth");

async function signup(body) {
  try {
    return await createNewUser(body.email);
  } catch (error) {
    return { error: error.message, code: 400 };
  }
}

async function signin(body) {
  try {
    return await verifyCode(body.email, body.code);
  } catch (error) {
    return { error: error.message, code: 400 };
  }
}

async function auth(body) {
  try {
    const result = await verifyToken(body.accessToken);
    if (result.user) {
      return {
        email: result.user,
        fullname: (await getUserFullname(body.accessToken)).fullname,
      };
    }
  } catch (error) {
    return { error: "Invalid token", code: 401 };
  }
}

async function refresh(body) {
  try {
    const { refreshToken } = body;
    const { user } = await verifyToken(refreshToken);
    return createToken(user);
  } catch (error) {
    return { error: "Invalid token", code: 401 };
  }
}

async function fullname(body, accessToken) {
  try {
    return await updateUserFullname(body.fullname, accessToken);
  } catch (error) {
    return { error: error.message, code: 400 };
  }
}

module.exports = {
  signup,
  signin,
  auth,
  refresh,
  fullname,
};
