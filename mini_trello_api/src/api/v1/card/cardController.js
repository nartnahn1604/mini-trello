const { getEmailFromToken, getUserByEmail } = require("../auth/auth");
const { getBoardById } = require("../board/board");
const Card = require("../model/Card");
const {
  getCards,
  addCard,
  updateCard,
  deleteCard,
  getCardById,
} = require("./card");

async function cardController(body, accessToken) {
  let email = await getEmailFromToken(accessToken);
  if (email?.error) {
    return email;
  }

  try {
    var cards = await getCards(body.parent);
    return cards;
  } catch (error) {
    return { error: error.message, code: 400 };
  }
}

async function addCardController(body, accessToken) {
  let email = await getEmailFromToken(accessToken);
  if (email?.error) {
    return email;
  }

  try {
    const board = await getBoardById(body.parent);
    if (!board) {
      throw new Error("Board not found.");
    }

    if (!board.members.map((mem) => mem.email).includes(email)) {
      throw new Error("You are not a member of this board.");
    }

    return await addCard(
      Card.fromJson({
        ...body,
        id: Math.random().toString(36).slice(2, 9),
      })
    );
  } catch (error) {
    return { error: error.message, code: 400 };
  }
}

async function updateCardController(body, accessToken) {
  let email = await getEmailFromToken(accessToken);
  if (email?.error) {
    return email;
  }

  try {
    return await updateCard(Card.fromJson({ ...body }));
  } catch (error) {
    return { error: error.message, code: 400 };
  }
}

async function deleteCardController(body, accessToken) {
  let email = await getEmailFromToken(accessToken);
  if (email?.error) {
    return email;
  }

  try {
    return await deleteCard(Card.fromJson(body));
  } catch (error) {
    return { error: error.message, code: 400 };
  }
}

module.exports = {
  cardController,
  addCardController,
  updateCardController,
  deleteCardController,
};
