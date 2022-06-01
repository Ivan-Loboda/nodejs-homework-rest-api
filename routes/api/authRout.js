const express = require("express");
const router = express.Router();
const { userValidation, confirmEmailSecondTimeValidation } = require("../../middlevares/validate.js");
const { authCheck } = require("../../middlevares/authCheck.js");
const { User } = require("../../models/authModel")
const { registration, login, logout, current, confirmEmail, confirmEmailSecondTime } = require("../../models/auth")
const { uploadMiddleware, changeAvatar } = require("../../models/changeAvatar")

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
    if (!result)
        return res.status(401).json({ "message": "Email or password is wrong" });
    res.status(200).json({ user: result });
});

router.get("/logout", authCheck, async (req, res, next) => {
    const result = await logout(req.id);
    res.status(204).json({ message: "No Content" });
});

router.get("/current", authCheck, async (req, res, next) => {
    const result = await current(req.id);
    res.status(200).json({ user: result });
});

router.patch("/avatars", [authCheck, uploadMiddleware.single("avatar")],
    async (req, res, next) => {
        const result = await changeAvatar(req.file);

        if (!result) {
            return res.status(401).json({ message: "Not authorized" });
        }
        const avatarUrl = await User.findOneAndUpdate(
            { _id: req.user.id },
            { avatarURL: result }
        );

        res.json({ avatarURL: `${result}` });
    }
);

router.get("/verify/:verificationToken", async (req, res, next) => {
    const { verificationToken } = req.params;
    const result = await confirmEmail(verificationToken);
    if (!result) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json({ message: "Verification successful" });
  });
  
  router.post(
    "/verify",
    confirmEmailSecondTimeValidation,
    async (req, res, next) => {
      const { email } = req.body;
      const result = await confirmEmailSecondTime(email);
      if (typeof result === "string")
        return res.status(400).json({ message: result });
      if (result) res.json({ message: "Verification email sent" });
    }
  );

module.exports = router;