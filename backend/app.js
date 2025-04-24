require('dotenv').config()
const express = require('express');
const app = express()
const port = process.env.PORT || 3000
const cookieParser = require("cookie-parser")
const { authenticateToken } = require("../backend/middlewares/auth")
const cors = require("cors")

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
    cors({
      origin: 'http://localhost:5473',
      credentials: true,
    })
  );

app.get('/',authenticateToken, (req, res) => {
    res.json({ user: req.user })
})

app.listen(port, () => {
    console.log(`Server started listening on port ${port}`)
})