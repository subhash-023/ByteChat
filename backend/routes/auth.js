const express = require('express')
const router = express.Router();
const controller = require("../controllers/authController");
const { authenticateToken } = require('../middlewares/auth');


router.post('/login', controller.login);
router.post('/register', controller.register);
router.post('/logout', controller.logout)
router.get('/verify-token', authenticateToken,async (req, res) => {
    await new Promise((resolve) => setTimeout(resolve, 100))
    res.json(req.user)
})

module.exports = router;