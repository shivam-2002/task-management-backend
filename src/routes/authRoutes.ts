import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Register User
router.post("/register", async (req, res) => {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const [result] = await pool.execute(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [name, email, hashedPassword]
        );

        // MySQL returns `insertId` inside the result object
        res.json({ message: "User registered successfully", userId: (result as any).insertId });
    } catch (error) {
        res.status(500).json({ error: `User registration failed ${error}` });
    }
});

// Login User
router.post("/login", async (req: any, res: any) => {
    const { email, password } = req.body;

    try {
        const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);
        const users = rows as any[];

        if (users.length === 0) return res.status(400).json({ error: "User not found" });

        const user = users[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
});

export default router;