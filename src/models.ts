export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
}

export interface Task {
    id: number;
    title: string;
    description: string;
    status: "pending" | "completed";
    due_date: string;
    user_id: number;
}