const express = require("express");
const router = express.Router();
const { userValidation } = require("../../middlevares/validate.js");
const { authCheck } = require("../../middlevares/authCheck.js");
const { User } = require("../../models/authModel")
const { registration, login, logout } = require("../../models/auth")

router.post("/signup", userValidation, async (req, res, next) => {
    const userMail = req.body.email
    const existingUser = await User.findOne({ userMail });

    if (existingUser) {
        return res.status(409).json({ message: "Email in use" });
    }

    const user = await registration(req.body);

    res.status(201).json(user);
});

router.post("/signin", userValidation, async (req, res, next) => {
    const result = await login(req.body);
    if (result)
        return res.status(401).json({ message: result });
    res.json({ user: result });
});

router.get("/logout", authCheck, async (req, res, next) => {
    const result = await logout(req.id);
    res.status(204).json({ message: "No Content" });
  });

module.exports = router;