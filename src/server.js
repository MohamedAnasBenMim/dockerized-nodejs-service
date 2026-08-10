const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.get("/secret", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Secret Area"');
    return res.status(401).send("Authentication required");
  }

  const encodedCredentials = authHeader.split(" ")[1];
  const decodedCredentials = Buffer.from(
    encodedCredentials,
    "base64"
  ).toString("utf8");

  const [username, password] = decodedCredentials.split(":");

  if (
username !== process.env.APP_USERNAME ||
password !== process.env.APP_PASSWORD
  ) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Secret Area"');
    return res.status(401).send("Invalid username or password");
  }

  res.send(process.env.SECRET_MESSAGE);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});