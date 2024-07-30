const {
  getEmailFromToken,
  getUserByEmail,
  getUserFullname,
} = require("../auth/auth");
const { getCards } = require("../card/card");
const Board = require("../model/Board");
const {
  getBoards,
  addBoard,
  updateBoard,
  deleteBoard,
  getBoardById,
} = require("./board");

async function boardsController(body, accessToken) {
  let email = await getEmailFromToken(accessToken);
  if (email?.error) {
    return email;
  }

  try {
    if (body?.id) {
      var board = await getBoardById(body.id);
      var members = board.members;
      var membersData = [];
      for (let i = 0; i < members.length; i++) {
        const fullname = await getUserFullname(accessToken);
        membersData.push({ ...members[i], fullname: fullname.fullname });
      }
      return {
        ...board.toJson(),
        members: membersData,
        cards: await getCards(body.id),
      };
    }
    var boards = await getBoards(email);
    var boardsData = [];
    for (let i = 0; i < boards.length; i++) {
      var board = boards[i];
      var members = board.members;
      var membersData = [];
      for (let i = 0; i < members.length; i++) {
        const fullname = await getUserFullname(accessToken);
        membersData.push({ ...members[i], fullname: fullname.fullname });
      }
      boardsData.push({
        ...board,
        members: membersData,
      });
    }
    return boardsData;
  } catch (error) {
    return { error: error.message, code: 400 };
  }
}

async function addBoardController(body, accessToken) {
  let email = await getEmailFromToken(accessToken);
  if (email?.error) {
    return email;
  }

  try {
    return await addBoard(
      Board.fromJson({
        ...body,
        members: [{ email: email, role: "owner", state: "accept" }],
        id: Math.random().toString(36).slice(2, 9),
      })
    );
  } catch (error) {
    return { error: error.message, code: 400 };
  }
}

async function updateBoardController(body, accessToken) {
  let email = await getEmailFromToken(accessToken);
  if (email?.error) {
    return email;
  }

  try {
    return await updateBoard(Board.fromJson({ ...body }), email);
  } catch (error) {
    return { error: error.message, code: 400 };
  }
}

async function deleteBoardController(body, accessToken) {
  let email = await getEmailFromToken(accessToken);
  if (email?.error) {
    return email;
  }

  try {
    return await deleteBoard(body.id, email);
  } catch (error) {
    return { error: error.message, code: 400 };
  }
}

module.exports = {
  boardsController,
  addBoardController,
  updateBoardController,
  deleteBoardController,
};
