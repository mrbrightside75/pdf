import { DataTypes } from "sequelize";

// Define the File model
const File = (db) => {
	return db.define(
		"File",
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false, // You can adjust this based on your needs
			},
			data: {
				type: "BYTEA", // Store PDF as binary data (blob)
				allowNull: false,
			},
		},
		{
			timestamps: true, // Adds createdAt and updatedAt fields
			tableName: "Files", // Explicitly set the table name if you want
		}
	);
};

// Synchronize the model with the database (create table if it doesn't exist)

export default File;
