const {
  getDocs,
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} = require("firebase/firestore/lite");
const { db } = require("../../../config/db");
const Card = require("../model/Card");
const { getTasks } = require("../task/task");

async function getCards(boardId) {
  const cards = await getDocs(collection(db, Card.getCollection()));
  var output = [];
  for (let i = 0; i < cards.docs.length; i++) {
    const card = cards.docs[i].data();
    if (card.parent === boardId) {
      const tasks = await getTasks(card.id);
      card.tasks = tasks;
      output.push(card);
    }
  }
  return output.sort((a, b) => parseInt(a.index) - parseInt(b.index));
}

async function addCard(card) {
  const cards = await getCards(card.parent);
  card.index = cards.length;
  await addDoc(collection(db, Card.getCollection()), card.toJson());
  cards.push(card);
  return cards;
}

async function updateCard(card) {
  const docId = await getCardDocId(card.id);
  await updateDoc(doc(db, Card.getCollection(), docId), card.toJson());
  return card;
}

async function deleteCard(card) {
  const docId = await getCardDocId(card.id);
  if (!docId) {
    return { error: "Card not found", code: 404 };
  }
  await deleteDoc(doc(db, Card.getCollection(), docId));
  return await getCards(card.parent);
}

async function getCardById(id) {
  const cards = await getDocs(collection(db, Card.getCollection()));
  const card = cards.docs.find((card) => card.data().id === id);
  return Card.fromJson(card.data());
}

async function getCardDocId(id) {
  const cards = await getDocs(collection(db, Card.getCollection()));
  const card = cards.docs.find((card) => card.data().id === id);
  return card?.id || null;
}

module.exports = {
  getCards,
  addCard,
  updateCard,
  deleteCard,
  getCardById,
};
