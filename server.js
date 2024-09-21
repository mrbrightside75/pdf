import express from "express";
import cors from "cors";
import { db, File, User } from "./db/db.js";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fs from "fs";

const server = express();
server.use(express.json());
server.use(cors());
const port = 3001;

// const addMultilineText = (
// 	page,
// 	text,
// 	x,
// 	y,
// 	font,
// 	fontSize,
// 	lineHeight,
// 	maxWidth
// ) => {
// 	const words = text.split(" ");
// 	let line = "";
// 	let currentY = y;

// 	words.forEach((word) => {
// 		const testLine = line + word + " ";
// 		const { width } = font.widthOfTextAtSize(testLine, fontSize);

// 		if (width > maxWidth) {
// 			page.drawText(line.trim(), {
// 				x,
// 				y: currentY,
// 				size: fontSize,
// 				font,
// 			});
// 			line = word + " ";
// 			currentY -= lineHeight;
// 		} else {
// 			line = testLine;
// 		}
// 	});

// 	// Draw the last line of text
// 	if (line) {
// 		page.drawText(line.trim(), { x, y: currentY, size: fontSize, font });
// 	}
// };

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
		/*
		- page.getSize() returns an object containing the width and height of the page.
		- For a Letter-sized page, width will be 612 points (8.5 inches × 72 points per inch).
		- height will be 792 points (11 inches × 72 points per inch). */
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

// New POST Endpoint to create the Parent Letter PDF
server.post("/create-parent-letter", async (req, res) => {
	try {
		const {
			date,
			parentName,
			parentAddress,
			cityStateZip,
			childName,
			serviceCoordinator,
			phone,
			ext,
		} = req.body;

		// Create a new PDFDocument
		const pdfDoc = await PDFDocument.create();

		// Embed the Times Roman font
		const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

		// Add a blank page to the document
		const page = pdfDoc.addPage([612, 792]); // Letter size

		// Get the width and height of the page
		const { width, height } = page.getSize();

		// Header content
		page.drawText("Onondaga County Health Department", {
			x: 50,
			y: height - 50,
			size: 12,
			font: timesRomanFont,
		});
		page.drawText("Healthy Families-Special Children Services", {
			x: 50,
			y: height - 70,
			size: 12,
			font: timesRomanFont,
		});
		page.drawText(
			"John H Mulroy Civic Center - 421 Montgomery Street, Syracuse, NY 13202",
			{ x: 50, y: height - 90, size: 12, font: timesRomanFont }
		);
		page.drawText("Phone 315.435.3230 - Fax 315.435.2678", {
			x: 50,
			y: height - 110,
			size: 12,
			font: timesRomanFont,
		});
		page.drawText("J. Ryan McMahon II, County Executive", {
			x: 50,
			y: height - 130,
			size: 12,
			font: timesRomanFont,
		});
		page.drawText("Kathryn Anderson, MD, MSPH, Commissioner of Health", {
			x: 50,
			y: height - 150,
			size: 12,
			font: timesRomanFont,
		});

		// Date
		page.drawText(`${date}`, {
			x: 50,
			y: height - 190,
			size: 12,
			font: timesRomanFont,
		});

		// Parent/Guardian Information
		page.drawText(`${parentName}`, {
			x: 50,
			y: height - 210,
			size: 12,
			font: timesRomanFont,
		});
		page.drawText(`${parentAddress}`, {
			x: 50,
			y: height - 230,
			size: 12,
			font: timesRomanFont,
		});
		page.drawText(`${cityStateZip}`, {
			x: 50,
			y: height - 250,
			size: 12,
			font: timesRomanFont,
		});

		// RE: Child Name
		page.drawText(`RE: ${childName}`, {
			x: 50,
			y: height - 270,
			size: 12,
			font: timesRomanFont,
		});

		// Body
		page.drawText("Dear Parent/Guardian,", {
			x: 50,
			y: height - 290,
			size: 12,
			font: timesRomanFont,
		});
		// First paragraph
		page.drawText(
			"I would like to take this opportunity to welcome you to Early Intervention.",
			{ x: 50, y: height - 310, size: 12, font: timesRomanFont }
		);
		page.drawText(
			"Every family involved in Early Intervention is assigned a service coordinator",
			{ x: 50, y: height - 330, size: 12, font: timesRomanFont }
		);
		page.drawText("to provide assistance. Your service coordinator is:", {
			x: 50,
			y: height - 350,
			size: 12,
			font: timesRomanFont,
		});
		page.drawText(`${serviceCoordinator}`, {
			x: 50,
			y: height - 370,
			size: 12,
			font: timesRomanFont,
		});

		// Second paragraph
		page.drawText(
			"Your service coordinator will be contacting you to set up an appointment",
			{ x: 50, y: height - 390, size: 12, font: timesRomanFont }
		);
		page.drawText(
			"to tell you about the Early Intervention program and obtain some information",
			{ x: 50, y: height - 410, size: 12, font: timesRomanFont }
		);
		page.drawText(
			"from you about your child. Please read the enclosed information which tells",
			{ x: 50, y: height - 430, size: 12, font: timesRomanFont }
		);
		page.drawText("you about Early Intervention and insurance.", {
			x: 50,
			y: height - 450,
			size: 12,
			font: timesRomanFont,
		});

		// Bullet points
		page.drawText("• having insurance card(s) available", {
			x: 70,
			y: height - 470,
			size: 12,
			font: timesRomanFont,
		});
		page.drawText("• Filling out the insurance form that is enclosed", {
			x: 70,
			y: height - 490,
			size: 12,
			font: timesRomanFont,
		});

		// Continue with the rest of the letter...
		page.drawText(
			"If you cannot fill out the insurance form ahead of time, please have the",
			{ x: 50, y: height - 510, size: 12, font: timesRomanFont }
		);
		page.drawText("information ready for your service coordinator.", {
			x: 50,
			y: height - 530,
			size: 12,
			font: timesRomanFont,
		});

		// Closing
		page.drawText("Sincerely,", {
			x: 50,
			y: height - 550,
			size: 12,
			font: timesRomanFont,
		});
		page.drawText("Jenny Dickinson, MPA", {
			x: 50,
			y: height - 570,
			size: 12,
			font: timesRomanFont,
		});
		page.drawText("Director, Special Children Services", {
			x: 50,
			y: height - 590,
			size: 12,
			font: timesRomanFont,
		});
		page.drawText("Onondaga County Health Department", {
			x: 50,
			y: height - 610,
			size: 12,
			font: timesRomanFont,
		});

		// Serialize the PDFDocument to bytes (a Uint8Array)
		const pdfBytes = await pdfDoc.save();

		// Save the PDF data as a Blob in the database
		const newFile = await File.create({
			name: "parent_letter.pdf",
			data: pdfBytes, // Store binary data
		});

		res.status(201).json({
			message: "Parent Letter PDF created and saved to the database!",
			file: newFile,
		});
	} catch (error) {
		console.error("Error creating or saving Parent Letter PDF:", error);
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
		res.send(Buffer.from(file.data));
	} catch (error) {
		console.error("Error fetching the PDF:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

server.listen(port, () => {
	console.log("Server is listening for requests");
});
