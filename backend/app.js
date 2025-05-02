require('dotenv').config()
const express = require('express');
const cookieParser = require("cookie-parser")
const cors = require("cors")
const app = express()
const port = process.env.PORT || 3000
const { authenticateToken } = require("../backend/middlewares/auth")
const authRoutes = require('./routes/auth')
const apiRoutes = require('./routes/api');

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true })) 
app.use(
    cors({
      origin: 'http://localhost:5173',
      credentials: true,
    })
  );

app.use('/auth', authRoutes)
app.use('/api', apiRoutes);

app.get('/',authenticateToken, (req, res) => {
    res.json({ user: req.user })
})

app.listen(port, () => {
    console.log(`Server started listening on port ${port}`)
})