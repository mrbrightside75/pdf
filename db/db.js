import { Sequelize } from "sequelize";
import File from "./File.js";
import User from "./User.js";
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

const connectToDB = async () => {
	try {
		await db.authenticate();
		console.log("Connected to the DB");
		// Sync the database (adjust with `alter: true` if needed)
		await db.sync({ alter: true }); // {alter: true}
	} catch (error) {
		console.error(error);
		console.error("DB ISSUE! EVERYONE PANIC!");
	}
};
await connectToDB();

export { db };
