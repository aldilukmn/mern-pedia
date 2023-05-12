import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import user from "../models/user.js";

// Register User
const register = async (req, res) => {
  try {
    if (!req.file) {
      const err = new Error("Image must be uploaded");
      err.errorStatus = 422;
      throw err;
    }
    const { firstName, lastName, email, password, friends, location, occupation } = req.body;
    const image = req.file.path;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new user({
      firstName,
      lastName,
      email,
      password: passwordHash,
      image,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login User
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await user.findOne({ email });

    if (!user) return res.status(400).json({ message: "User does not exist." });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });
    res.status(500).json({ error: error.message });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    delete user.password;

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { register, login };
