import express from "express";
import cors from "cors";
import { db, File, Case } from "./db/db.js";

const server = express();
server.use(express.json());
server.use(cors());
const port = 3001;
server.get("/", (req, res) => {
	res.send(`Server is running on port ${port}`);
});
server.listen(port, () => {
	console.log("Server is listening for requests");
});
