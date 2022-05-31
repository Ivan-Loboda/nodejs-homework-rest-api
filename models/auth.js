const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("./authModel");
const gravatar = require("gravatar");

const registration = async (body) => {
    const { email, password } = body;

    try {
        const user = new User({
            email,
            password: await bcrypt.hash(password, 10),
            avatarURL: gravatar.url(email, {protocol: "http", s: 250})
        });

        await user.save();
        const newUser = { email: user.email, subscription: user.subscription };
        return newUser;
    } catch (error) {
        console.log("error", error.message);
    }
};

const login = async (body) => {
    const { email, password } = body;
    try {
        const findUser = await User.findOne({ email });

        if (!findUser) return `No user with email ${email}`;
        if (!(await bcrypt.compare(password, findUser.password)))
            return "Wrong password";

        const token = jwt.sign(
            {
                _id: findUser._id,
            },
            process.env.JWT_SECRET
        );
        await User.updateOne({ _id: findUser.id }, { token });
        const user = { email, subscription: findUser.subscription, token };
        return user;
    } catch (error) {
        console.log("error", error.message);
    }
};

const logout = async (userId) => {
    try {
        return result = await User.updateOne({ _id: userId }, { token: null });
    } catch (error) {
        console.log("error", error.message);
    }
};

const current = async (userId) => {
    try {
        const user = await User.findById({ _id: userId });
        const userData = { email: user.email, subscription: user.subscription };
        return userData;
    } catch (error) {
        console.log("error", error.message);
    }
};

module.exports = {
    registration, login, logout, current,
}
