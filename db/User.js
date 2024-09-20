// F5 Import DataTypes from Sequelize so we can define the types of the columns
import { DataTypes } from "sequelize";

const User = (db) => {
	return db.define("User", {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		firstname: DataTypes.TEXT,
		lastname: DataTypes.TEXT,
	});
};

export default User;
