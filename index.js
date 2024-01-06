const express = require("express");
const shortid = require("shortid");
const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage for demonstration purposes
const urlDatabase = {};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the HTML form for URL submission
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Shorten URL endpoint
app.post("/shorten", (req, res) => {
  const { originalUrl } = req.body;

  // Check if the URL is valid
  if (!isValidUrl(originalUrl)) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  // Generate a short code using shortid
  const shortCode = shortid.generate();

  // Save the original and short URLs in the database
  urlDatabase[shortCode] = originalUrl;

  // Construct the short URL
  const shortUrl = `${req.protocol}://${req.get("host")}/${shortCode}`;

  res.json({ originalUrl, shortUrl });
});

// Redirect from short URL to original URL
app.get("/:shortCode", (req, res) => {
  const { shortCode } = req.params;
  const originalUrl = urlDatabase[shortCode];

  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.status(404).send("Not Found");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Function to validate URL format
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}
