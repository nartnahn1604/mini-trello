const { getEmailFromToken } = require("../auth/auth");
const User = require("../model/User");
const { inviteMember, acceptInvitation, removeMember } = require("./member");

async function inviteMemberController(body, accessToken) {
  let email = await getEmailFromToken(accessToken);
  if (email?.error) {
    return email;
  }

  try {
    return await inviteMember(email, body.email, body.boardId);
  } catch (error) {
    return { error: error.message, code: 400 };
  }
}

async function acceptInviteController(body) {
  try {
    const result = await acceptInvitation(body.email, body.id, body.code);
    if (result?.error) {
      return result.error;
    }
    return result.message;
  } catch (error) {
    return { error: error.message, code: 400 };
  }
}

async function removeMemberController(body, accessToken) {
  let email = await getEmailFromToken(accessToken);
  if (email?.error) {
    return email;
  }

  try {
    return await removeMember(email, body.boardId, body.email);
  } catch (error) {
    return { error: error.message, code: 400 };
  }
}

module.exports = {
  inviteMemberController,
  acceptInviteController,
  removeMemberController,
};
