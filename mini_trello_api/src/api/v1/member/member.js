const {
  getDocs,
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} = require("firebase/firestore/lite");
const { db } = require("../../../config/db");

const User = require("../model/User");
const { getBoardDoc, updateBoard } = require("../board/board");
const { sendMail } = require("../../../config/mailApi");
const Board = require("../model/Board");
const { connectionStatus, publishMessage } = require("../../../../mqttBroker");

async function inviteMember(owner, email, boardId) {
  const users = await getDocs(collection(db, User.getCollection()));
  const user = users.docs.find((user) => user.data().email === email);
  if (!user) {
    return { error: "User not found.", code: 404 };
  }

  const boardDoc = await getBoardDoc(boardId, owner);
  if (!boardDoc) {
    return { error: "Board not found.", code: 404 };
  }

  if (boardDoc.data().members.includes(email)) {
    return { error: "User is already a member of this board.", code: 400 };
  }

  const board = boardDoc.data();
  const invitationCode = Math.random().toString(36).slice(2, 9);
  await updateBoard(
    Board.fromJson({
      ...board,
      members: [
        ...board.members,
        { email, role: "member", state: "pending", code: invitationCode },
      ],
    }),
    owner
  );
  const invitationMessage = `<div>
  You have been invited to a board. Please accept the invitation by clicking the link below: http://localhost:3001/boards/accept?id=${boardId}&code=${invitationCode}&email=${email}
  </div>`;
  await sendMail(email, "Mini Trello - Board Invitation", invitationMessage);
  return { message: "User invited successfully.", code: 200 };
}

async function acceptInvitation(email, boardId, code) {
  const boardDoc = await getBoardDoc(boardId, email);
  if (!boardDoc) {
    return { error: "Board not found.", code: 404 };
  }

  const board = boardDoc.data();
  const member = board.members.find((mem) => mem.email === email);
  if (!member) {
    return { error: "User is not a member of this board.", code: 400 };
  }

  if (member.code !== code) {
    return { error: "Invalid invitation code.", code: 400 };
  }

  await updateBoard(
    Board.fromJson({
      ...board,
      members: board.members.map((mem) =>
        mem.email === email ? { ...mem, state: "accept", code: null } : mem
      ),
    }),
    email
  );
  console.log(connectionStatus);
  setTimeout(() => {
    publishMessage("trello/update", { type: "board", id: boardId });
  }, 3000);
  return { message: "Invitation accepted successfully.", code: 200 };
}

async function removeMember(user, id, email) {
  const boardDoc = await getBoardDoc(id, user);
  if (!boardDoc) {
    return { error: "Board not found.", code: 404 };
  }

  const board = boardDoc.data();

  if (board.members.find((mem) => mem.email === user).role !== "owner") {
    return { error: "You are not the owner of this board.", code: 400 };
  }

  await updateBoard(
    Board.fromJson({
      ...board,
      members: board.members.filter((mem) => mem.email !== email),
    }),
    user
  );
  return { message: "Member removed successfully.", code: 200 };
}

module.exports = {
  inviteMember,
  acceptInvitation,
  removeMember,
};
