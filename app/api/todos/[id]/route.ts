import { connectDB } from "@/lib/db";
import Todo from "@/models/Todo";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const user = JSON.parse(req.headers.get("user") || "{}");
    if (user.role !== "admin" && user.role !== "user") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    await connectDB();
    const body = await req.json();
    const updatedTodo = await Todo.findByIdAndUpdate(params.id, body, { new: true });
    return NextResponse.json(updatedTodo);
}
export async function DELETE (_: Request, {params}:{params: {id: string}}){
    await connectDB();
    await Todo.findByIdAndDelete(params.id);
    return NextResponse.json({message: "Todo deleted"});
}
// export async function UPDATE (req: Request, {params}:{params: {id: string}}){
//     await connectDB();
//     const data = await req.json();
//     const updated = await Todo.findByIdAndUpdate(params.id, data,{new: true});
//     return NextResponse.json(updated);
// }