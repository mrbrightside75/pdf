import { Sequelize } from "sequelize";
import defineFile from "./File.js";
import defineUser from "./User.js";

let db;
if (process.env.DATABASE_URL === undefined) {
	console.log("Connected locally!");
	db = new Sequelize("postgres://localhost:5432/pdf", {
		logging: false,
	});
} else {
	db = new Sequelize(process.env.DATABASE_URL, {
		logging: false,
	});
}

// Initialize models by passing the `db` instance
const File = defineFile(db);
const User = defineUser(db);

const connectToDB = async () => {
	try {
		await db.authenticate();
		console.log("Connected to the DB");
		// Sync the database
		await db.sync(); // Adjust with { alter: true } if needed
	} catch (error) {
		console.error(error);
		console.error("DB ISSUE! EVERYONE PANIC!");
	}
};

await connectToDB();

export { db, File, User };
