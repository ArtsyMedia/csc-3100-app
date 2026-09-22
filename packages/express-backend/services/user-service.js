import mongoose from "mongoose";
import userModel from "../models/user.js";
import dotenv from "dotenv";

mongoose.set("debug", true);
dotenv.config();

function getMongoURI(dbname) {
  const connection_string = process.env.MONGO_CONNECTION_STRING?.trim();

  if (!connection_string) {
    console.error(
      "Error: MONGO_CONNECTION_STRING is not defined in .env"
    );
    return "";
  }

  console.log("Connecting to MongoDB with the configured connection string");
  return connection_string;
}

// Mongoose 6+ does not need useNewUrlParser or useUnifiedTopology
mongoose
  .connect(getMongoURI("users"))
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch((error) => console.log("Connection Error:", error));

function addUser(user) {
  const userToAdd = new userModel(user);
  return userToAdd.save();
}

function getUsers(name, job) {
  if (name === undefined && job === undefined) {
    return userModel.find();
  } else if (name && !job) {
    return findUserByName(name);
  } else if (job && !name) {
    return findUserByJob(job);
  } else {
    return findUserByNameAndJob(name, job);
  }
}

function findUserById(id) {
  return userModel.findById(id);
}

function findUserByName(name) {
  return userModel.find({ name: name });
}

function findUserByJob(job) {
  return userModel.find({ job: job });
}

function findUserByNameAndJob(name, job) {
  return userModel.find({ name, job });
}

function removeUser(id) {
  return userModel.findByIdAndDelete(id);
}

const deleteUser = removeUser;

export default {
  addUser,
  getUsers,
  findUserById,
  findUserByName,
  findUserByJob,
  findUserByNameAndJob,
  removeUser,
  deleteUser
};
