import express from "express";
import cors from "cors";
import { db, File, User } from "./db/db.js";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fs from "fs";

const server = express();
server.use(express.json());
server.use(cors());
const port = 3001;

server.get("/", (req, res) => {
	res.send(`Server is running on port ${port}`);
});

server.post("/user", async (req, res) => {
	try {
		const { firstname, lastname } = req.body;
		// Create a new case in the database
		const newUser = await User.create({
			firstname,
			lastname,
		});

		// Send a success response
		res.status(201).json(newUser);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Endpoint to create a new PDF and save it to the database
server.post("/create-pdf", async (req, res) => {
	try {
		// Create a new PDFDocument
		const pdfDoc = await PDFDocument.create();

		// Embed the Times Roman font
		const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

		// Add a blank page to the document
		const page = pdfDoc.addPage();

		// Get the width and height of the page
		const { width, height } = page.getSize();

		// Draw a string of text toward the top of the page
		const fontSize = 30;
		page.drawText("Creating PDFs in JavaScript is awesome!", {
			x: 50,
			y: height - 4 * fontSize,
			size: fontSize,
			font: timesRomanFont,
			color: rgb(0, 0.53, 0.71),
		});

		// Serialize the PDFDocument to bytes (a Uint8Array)
		const pdfBytes = await pdfDoc.save();

		// fs.writeFileSync("./test.pdf", pdfBytes);

		// Save the PDF data as a Blob in the database
		const newFile = await File.create({
			name: "test.pdf",
			data: pdfBytes, // Store binary data
		});

		console.log(pdfBytes.length);

		res.status(201).json({
			message: "PDF created and saved to the database!",
			file: newFile,
		});
	} catch (error) {
		console.error("Error creating or saving PDF:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

server.get("/get-pdf/:id", async (req, res) => {
	try {
		const fileId = req.params.id;

		// Find the file by its primary key (ID)
		const file = await File.findByPk(fileId);

		if (!file) {
			return res.status(404).json({ error: "File not found" });
		}

		console.log(file.data.length);

		// Set the content type to PDF
		res.setHeader("Content-Type", "application/pdf");

		// Set content disposition to 'inline' to display the PDF in the browser
		res.setHeader("Content-Disposition", `inline; filename=${file.name}`);

		// Send the PDF data as binary
		res.send(file.data);
	} catch (error) {
		console.error("Error fetching the PDF:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

server.listen(port, () => {
	console.log("Server is listening for requests");
});
