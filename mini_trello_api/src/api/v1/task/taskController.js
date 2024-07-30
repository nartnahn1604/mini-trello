const { getEmailFromToken } = require("../auth/auth");
const { getBoardById } = require("../board/board");
const { getCardById } = require("../card/card");
const Task = require("../model/Task");
const {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
  updateTaskIndexes,
  getTaskById,
} = require("./task");

async function taskController(body, accessToken) {
  let email = await getEmailFromToken(accessToken);
  if (email?.error) {
    return email;
  }

  try {
    var tasks = await getTasks(body.parent);
    return tasks;
  } catch (error) {
    return { error: error.message, code: 400 };
  }
}

async function addTaskController(body, accessToken) {
  let email = await getEmailFromToken(accessToken);
  if (email?.error) {
    return email;
  }

  try {
    const card = await getCardById(body.parent);
    if (!card) {
      throw new Error("Card not found.");
    }

    const board = await getBoardById(card.parent);
    if (!board) {
      throw new Error("Board not found.");
    }

    if (!board.members.map((mem) => mem.email).includes(email)) {
      throw new Error("You are not a member of this board.");
    }

    return await addTask(
      Task.fromJson({
        ...body,
        id: Math.random().toString(36).slice(2, 9),
      })
    );
  } catch (error) {
    return { error: error.message, code: 400 };
  }
}

async function updateTaskController(body, accessToken) {
  let email = await getEmailFromToken(accessToken);
  if (email?.error) {
    return email;
  }

  try {
    return await updateTask(Task.fromJson({ ...body }));
  } catch (error) {
    return { error: error.message, code: 400 };
  }
}

async function updateTaskIndexController(body, accessToken) {
  let email = await getEmailFromToken(accessToken);
  if (email?.error) {
    return email;
  }

  try {
    return await updateTaskIndexes(body.indexes, body.parent);
  } catch (error) {
    return { error: error.message, code: 400 };
  }
}

async function deleteTaskController(body, accessToken) {
  let email = await getEmailFromToken(accessToken);
  if (email?.error) {
    return email;
  }

  try {
    return await deleteTask(Task.fromJson(body));
  } catch (error) {
    return { error: error.message, code: 400 };
  }
}

module.exports = {
  taskController,
  addTaskController,
  updateTaskController,
  updateTaskIndexController,
  deleteTaskController,
};
