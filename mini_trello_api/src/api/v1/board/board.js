const {
  getDocs,
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} = require("firebase/firestore/lite");
const { db } = require("../../../config/db");
const Board = require("../model/Board");

async function getBoards(email) {
  const boards = await getDocs(collection(db, Board.getCollection()));
  return boards.docs
    .map((board) => board.data())
    .filter((board) => board.members.map((mem) => mem.email).includes(email));
}

async function addBoard(board) {
  await addDoc(collection(db, Board.getCollection()), board.toJson());
  return getBoards(board.members[0].email);
}

async function updateBoard(board, email) {
  const boardDoc = await getBoardDoc(board.id, email);
  if (!boardDoc) {
    return { error: "Board not found", code: 404 };
  }
  await updateDoc(doc(db, Board.getCollection(), boardDoc.id), board.toJson());
  return await getBoards(email);
}

async function deleteBoard(id, email) {
  const boardDoc = await getBoardDoc(id, email);
  if (!boardDoc) {
    return { error: "Board not found", code: 404 };
  }
  await deleteDoc(doc(db, Board.getCollection(), boardDoc.id));
  return await getBoards(email);
}

async function getBoardById(id) {
  const boards = await getDocs(collection(db, Board.getCollection()));
  const board = boards.docs.find((board) => board.data().id === id);
  return Board.fromJson(board.data());
}

async function getBoardDoc(id, email) {
  const boards = await getDocs(collection(db, Board.getCollection()));
  return boards.docs.find(
    (board) =>
      board.data().id === id &&
      board
        .data()
        .members.map((mem) => mem.email)
        .includes(email)
  );
}
module.exports = {
  getBoards,
  addBoard,
  updateBoard,
  deleteBoard,
  getBoardById,
  getBoardDoc,
};
