import express from "express";
import pool from "../db";
import jwt from "jsonwebtoken";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Middleware for authentication
const authenticate = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ error: "Invalid token" });
    }
};

// Get all tasks
router.get("/", authenticate, async (req: any, res) => {
    const [rows] = await pool.execute("SELECT * FROM tasks WHERE user_id = ?", [req.user.id]);
    res.json(rows);
});

// Create a new task
router.post("/", authenticate, async (req: any, res) => {
    const { title, description, dueDate } = req.body;
    const [result] = await pool.execute(
        "INSERT INTO tasks (title, description, status, due_date, user_id) VALUES (?, ?, false, ?, ?)",
        [title, description, dueDate, req.user.id]
    );
    res.json({ message: "Task created", taskId: (result as any).insertId });
});

// Update a task
router.put("/:id", authenticate, async (req: any, res) => {
    const { title, description, status } = req.body;
    const [result] = await pool.execute(
        "UPDATE tasks SET title=?, description=?, status=? WHERE id=? AND user_id=?",
        [title, description, status, req.params.id, req.user.id]
    );
    res.json({ message: "Task updated" });
});

// Delete a task
router.delete("/:id", authenticate, async (req: any, res) => {
    await pool.execute("DELETE FROM tasks WHERE id=? AND user_id=?", [req.params.id, req.user.id]);
    res.json({ message: "Task deleted" });
});

export default router;