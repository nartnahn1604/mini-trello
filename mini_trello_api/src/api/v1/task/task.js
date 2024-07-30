const {
  getDocs,
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} = require("firebase/firestore/lite");
const { db } = require("../../../config/db");
const Task = require("../model/Task");

async function getTasks(taskId) {
  const tasks = await getDocs(collection(db, Task.getCollection()));
  return tasks.docs
    .map((task) => task.data())
    .filter((task) => task.parent === taskId)
    .sort((a, b) => parseInt(a.index) - parseInt(b.index));
}

async function addTask(task) {
  const tasks = await getTasks(task.parent);
  task.index = tasks.length;
  await addDoc(collection(db, Task.getCollection()), task.toJson());
  tasks.push(task);
  return tasks;
}

async function updateTask(task) {
  const docId = await getTaskDocId(task.id);
  await updateDoc(doc(db, Task.getCollection(), docId), task.toJson());
  return task;
}

async function updateTaskIndexes(indexes, parent) {
  const tasks = await getDocs(collection(db, Task.getCollection()));
  indexes.forEach(async (card) => {
    card.tasks.forEach(async (task) => {
      const docId = await getTaskDocId(task.id);
      const taskData = tasks.docs.find((t) => t.data().id === task.id).data();
      if (taskData.index !== task.index) {
        await updateDoc(doc(db, Task.getCollection(), docId), {
          ...taskData,
          index: task.index,
          parent: card.id,
        });
      }
    });
  });
  return await getTasks(parent);
}

async function deleteTask(task) {
  const docId = await getTaskDocId(task.id);
  if (!docId) {
    return { error: "Task not found", code: 404 };
  }
  await deleteDoc(doc(db, Task.getCollection(), docId));
  return await getTasks(task.parent);
}

async function getTaskById(id) {
  const tasks = await getDocs(collection(db, Task.getCollection()));
  const task = tasks.docs.find((task) => task.data().id === id);
  return Task.fromJson(task.data());
}

async function getTaskDocId(id) {
  const tasks = await getDocs(collection(db, Task.getCollection()));
  const task = tasks.docs.find((task) => task.data().id === id);
  return task?.id || null;
}

module.exports = {
  getTasks,
  addTask,
  updateTask,
  updateTaskIndexes,
  deleteTask,
  getTaskById,
};
