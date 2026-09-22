// backend.js
import express from "express";
import cors from "cors";
import userService from "./services/user-service.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
const mongoUri = MONGO_CONNECTION_STRING + "users";

// Reuse the existing default connection instead of opening it more than once.
if (mongoose.connection.readyState === 0) {
    mongoose
        .connect(mongoUri) // connect to Db "users"
        .catch((error) => console.log(error));
}

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
    const name = req.query.name;
    const job = req.query.job;

    userService.getUsers(name, job)
        .then((result) => res.send({ users_list: result }))
        .catch((error) => res.status(500).send(error));
});




app.get("/users/:id", (req, res) => {
    const id = req.params["id"]; //or req.params.id
    userService.findUserById(id)
        .then((result) => {
            if (!result) {
                res.status(404).send("Resource not found.");
            } else {
                res.send(result);
            }
        })
        .catch((error) => res.status(500).send(error));
});

app.post("/users", (req, res) => {
    if (typeof userService.addUser !== "function") {
        return res.status(501).send("User creation is not supported.");
    }
    userService.addUser(req.body)
        .then((newUser) => res.status(201).send(newUser))
        .catch((error) => res.status(500).send(error));
});

app.delete("/users/:id", (req, res) => {
    userService.deleteUser(req.params.id)
        .then((result) => {
            if (!result) {
                res.status(404).send("Resource not found.");
            } else {
                res.status(204).send();
            }
        })
        .catch((error) => res.status(500).send(error));
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});