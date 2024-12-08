/** @format */

const jsonServer = require("json-server");
const express = require("express");
const multer = require("multer"); // Fayllarni yuklash uchun kerak
const path = require("path");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

// Multer konfiguratsiyasi
const upload = multer({
	dest: "uploads/", // Fayllarni 'uploads' papkasiga saqlaydi
});

// Static fayllar uchun 'uploads' papkasini ochib berish
server.use("/uploads", express.static(path.join(__dirname, "uploads")));

server.use(middlewares);

// Fayl yuklash uchun endpoint
server.post("/upload", upload.single("image"), (req, res) => {
	if (!req.file) {
		return res.status(400).send("No file uploaded");
	}
	const fileUrl = `/uploads/${req.file.filename}`;
	res.status(201).json({ message: "File uploaded successfully", url: fileUrl });
});

// API rewriter
server.use(
	jsonServer.rewriter({
		"/api/*": "/$1",
		"/blog/:resource/:id/show": "/:resource/:id",
	}),
);

server.use(router);

// JSON Serverni ishga tushirish
server.listen(3000, () => {
	console.log("JSON Server is running at http://localhost:3000");
});

// Export the Server API
module.exports = server;
