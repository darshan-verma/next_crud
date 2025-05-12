import { connectDB } from "@/lib/db";
import Todo from "@/models/Todo";
import { NextResponse } from "next/server";

const SECRET_KEY = process.env.AUTH_SECRET || "default_secret_key";

export async function GET() {
    try {
        console.log("Connecting to the database...");
        await connectDB();
        console.log("Fetching todos from the database...");
        const todos = await Todo.find();
        console.log("Todos fetched successfully:", todos);
        return NextResponse.json(todos);
    } catch (error) {
        console.error("Error fetching todos:", error);
        return NextResponse.json({ error: "Failed to fetch todos" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        console.log("Connecting to the database...");
        await connectDB();

        console.log("Creating a new todo...");
        console.log("Request headers:", req.headers);
        const user = JSON.parse(req.headers.get("user") || "{}");
        console.log("User role:", user.role);
        if (user.role !== "admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await req.json();
        console.log("Received request body:", body);
        const newTodo = await Todo.create(body);
        console.log("New todo saved successfully:", newTodo);
        return NextResponse.json(newTodo);
    } catch (error) {
        console.error("Error creating todo:", error);
        return NextResponse.json({ error: "Failed to create todo" }, { status: 500 });
    }
}