const User = require('../models/user');
const { setUser } = require('../services/auth');

async function handleUserSignUp(req, res) {
    try {
        const { name, email, password } = req.body;
        await User.create({ name, email, password });
        console.log("User created successfully:", email);
        return res.redirect("/login");
    } catch (err) {
        console.error("Signup Error:", err);
        return res.status(500).send("Error signing up");
    }
}
async function handleUserLogin(req, res) {
    try {
        const { email, password } = req.body;
        console.log("Login request for:", email);

        const user = await User.findOne({ email, password });
        if (!user) {
            console.log("Invalid login attempt for:", email);
            return res.render("login", { error: "Invalid email or password" });
        }
        const token = setUser(user);
        res.cookie("token", token, { httpOnly: true });

        console.log("Login successful, redirecting...");
        return res.redirect("/");
    } catch (err) {
        console.error("Login Error:", err);
        return res.status(500).send("Error logging in");
    }
}
module.exports = {
    handleUserSignUp,
    handleUserLogin,
};
