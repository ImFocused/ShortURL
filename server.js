require("dotenv").config();

const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: process.env.DB_HOST?.includes("neon.tech")
        ? { rejectUnauthorized: false }
        : false
});


app.use(express.json());

app.get("/", (req, res) => {
    res.send("ShortURL backend is running!");
});

app.post("/shorten", async (req, res) => {
    const url = req.body.url?.trim();

    if (!url) {
        return res.status(400).json({
            error: "URL is required."
        });
    }

    let parsedUrl;

    try {
        parsedUrl = new URL(url);
    } catch {
        return res.status(400).json({
            error: "Invalid URL."
        });
    }

    if (
        parsedUrl.protocol !== "http:" &&
        parsedUrl.protocol !== "https:"
    ) {
        return res.status(400).json({
            error: "Only HTTP and HTTPS URLs are allowed."
        });
    }

    const shortCode = Math.random().toString(36).substring(2, 8);

    try {
        await pool.query(
            "INSERT INTO urls (original_url, short_code) VALUES ($1, $2)",
            [url, shortCode]
        );

        res.json({
            originalUrl: url,
            shortUrl: `${process.env.BASE_URL}/${shortCode}`
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Could not save URL"
        });
    }
});

app.get("/:shortCode", async (req, res) => {
    const shortCode = req.params.shortCode;

    try {
        const result = await pool.query(
            "SELECT original_url FROM urls WHERE short_code = $1",
            [shortCode]
        );

        if (result.rows.length === 0) {
            return res.status(404).send("Short URL not found");
        }

        const originalUrl = result.rows[0].original_url;

        res.redirect(originalUrl);

    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

pool.query("SELECT NOW()", (err, result) => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Database connected!");
        console.log(result.rows[0]);
    }
});

app.listen(PORT, () => {
    console.log(`Server running at ${process.env.BASE_URL}`);
});