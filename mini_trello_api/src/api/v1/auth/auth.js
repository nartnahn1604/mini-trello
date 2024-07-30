const JWT_SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.EXPIRES_IN;
const REFRESH_TOKEN_EXPIRES_IN = EXPIRES_IN * 1000;

const {
  getDocs,
  collection,
  addDoc,
  updateDoc,
  doc,
} = require("firebase/firestore/lite");
const jwt = require("jsonwebtoken");
const { db } = require("../../../config/db");
const { sendMail } = require("../../../config/mailApi");
const User = require("../model/User");

function createToken(user) {
  return {
    accessToken: jwt.sign({ user }, JWT_SECRET, {
      expiresIn: EXPIRES_IN + "s",
    }),
  };
}

function createRefreshToken(user) {
  return {
    refreshToken: jwt.sign({ user }, JWT_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN + "s",
    }),
  };
}

async function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

async function getEmailFromToken(token) {
  try {
    const { user } = await verifyToken(token);
    return user;
  } catch (error) {
    return { error: "Invalid token", code: 401 };
  }
}

async function createNewUser(email) {
  const verificationMessage =
    "Your verification code has been sent. Please check your email.";
  const users = await getDocs(collection(db, User.getCollection()));
  if (users.docs.some((user) => user.data().email === email)) {
    const user = users.docs.find((user) => user.data().email === email);
    if (user.data().expire > Date.now()) {
      throw new Error(
        "Verification code has been sent. Please check your email."
      );
    }
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    await updateDoc(doc(db, User.getCollection(), user.id), {
      verificationCode,
      expire: Date.now() + 120000,
    });
    const verificationMessage = `<div>
    Your verification code is ${verificationCode}. Please use it to verify your account.
    </div>"`;
    await sendMail(email, "Mini Trello verification code", verificationMessage);
    return { message: "Code is sent to your email." };
  }

  const verificationCode = Math.floor(100000 + Math.random() * 900000);
  await addDoc(
    collection(db, User.getCollection()),
    new User(email, verificationCode, Date.now() + 120000).toJson()
  );
  await sendMail(email, verificationCode);
  return { message: verificationMessage };
}

async function verifyCode(email, verificationCode) {
  const users = await getDocs(collection(db, User.getCollection()));
  const user = users.docs.find((user) => user.data().email === email);
  if (!user) {
    throw new Error("User not found.");
  }
  if (user.data().verificationCode !== verificationCode) {
    throw new Error("Invalid verification code.");
  }
  if (user.data().expire < Date.now()) {
    throw new Error("Verification code has expired.");
  }

  await updateDoc(doc(db, User.getCollection(), user.id), {
    verificationCode: null,
    expire: null,
  });
  return {
    ...createToken(user.data().email),
    ...createRefreshToken(user.data().email),
  };
}

async function getUserFullname(accessToken) {
  let email;
  try {
    const { user } = await verifyToken(accessToken);
    email = user;
  } catch (error) {
    return { error: "Invalid token", code: 401 };
  }
  const users = await getDocs(collection(db, User.getCollection()));
  const user = users.docs.find((user) => user.data().email === email);
  if (!user) {
    throw new Error("User not found.");
  }
  return { fullname: user.data().fullname, code: 200 };
}

async function updateUserFullname(fullname, accessToken) {
  let email = await getEmailFromToken(accessToken);
  if (email?.error) {
    return email;
  }

  const users = await getDocs(collection(db, User.getCollection()));
  const user = users.docs.find((user) => user.data().email === email);
  if (!user) {
    throw new Error("User not found.");
  }
  await updateDoc(doc(db, User.getCollection(), user.id), {
    fullname,
  });
  return { message: "Fullname updated successfully.", code: 200 };
}

async function getUserByEmail(email) {
  const users = await getDocs(collection(db, User.getCollection()));
  const user = users.docs.find((user) => user.data().email === email);
  if (!user) {
    throw new Error("User not found.");
  }
  return User.fromJson(user.data()).toJson();
}

module.exports = {
  createToken,
  createRefreshToken,
  verifyToken,
  createNewUser,
  verifyCode,
  updateUserFullname,
  getUserFullname,
  getEmailFromToken,
  getUserByEmail,
};
