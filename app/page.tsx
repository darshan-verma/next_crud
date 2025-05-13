"use client";
import { useEffect, useState } from "react";
import { Todo } from "@/types/todos";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";

export default function Home() {
	const [title, setTitle] = useState("");
	const [todos, setTodos] = useState<Todo[]>([]);
	const [editingTodo, setEditingTodo] = useState<Todo | null>(null); // State for editing
	const [token, setToken] = useState<string | null>(null); // State for token
    const [showRegister, setShowRegister] = useState(true); // Show register form by default

	useEffect(() => {
		if (token) {
			console.log("Fetching todos from the API...");
			fetch("/api/todos", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`, // Include the token in the request
				},
			})
				.then((response) => {
					console.log("API response:", response);
					if (!response.ok) {
						throw new Error("Network response was not ok");
					}
					return response.json();
				})
				.then((data) => {
					console.log("Todos fetched successfully:", data);
					setTodos(data);
				})
				.catch((error) => console.error("Error fetching todos:", error));
		}
	}, [token]);
	useEffect(() => {
		const storedToken = localStorage.getItem("token");
		if (storedToken) {
			setToken(storedToken);
		}
	}, []);

	const addTodo = async () => {
		if (editingTodo) {
			// Update todo logic
			console.log("Updating todo...");
			const res = await fetch(`/api/todos/${editingTodo._id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ title }),
			});
			const updatedTodo = await res.json();
			console.log("Todo updated:", updatedTodo);

			// Update the todos state
			setTodos(
				todos.map((todo) => (todo._id === updatedTodo._id ? updatedTodo : todo))
			);
			setEditingTodo(null); // Clear editing state
		} else {
			// Add todo logic
			console.log("Adding a new todo...");
			const res = await fetch("/api/todos", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ title, completed: false }),
			});
			const newTodo = await res.json();
			console.log("New todo added:", newTodo);
			setTodos([...todos, newTodo]);
		}
		setTitle(""); // Clear the input field
	};

	const deleteTodo = async (id: string | undefined) => {
		if (!id) return;
		console.log(`Deleting todo with id: ${id}`);
		await fetch(`/api/todos/${id}`, { method: "DELETE" });
		setTodos(todos.filter((todo) => todo._id !== id));
		console.log(`Todo with id ${id} deleted successfully`);
	};

	const editTodo = (todo: Todo) => {
		setTitle(todo.title); // Set the title in the input field
		setEditingTodo(todo); // Set the todo being edited
	};

	const handleLogin = (token: string) => {
		setToken(token);
	};
	const logout = () => {
		setToken(null);
		localStorage.removeItem("token");
	};
	if (!token) {
        return showRegister ? (
            <RegisterForm onRegister={() => setShowRegister(false)} />
        ) : (
            <LoginForm onLogin={handleLogin} />
        );
    }
	return (
		<main className="p-8 max-w-2xl mx-auto">
			<h1 className="text-3xl font-bold mb-6 text-center">
				Todo's to Learn CRUD in Next.js
			</h1>
			<button
				onClick={logout}
				className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mb-4"
			>
				Logout
			</button>
			<div className="flex items-center mb-4">
				<input
					className="flex-1 border border-gray-300 rounded p-2 mr-2"
					placeholder="Enter a new todo"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
				<button
					className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
					onClick={addTodo}
				>
					{editingTodo ? "Update" : "Add"}
				</button>
			</div>
			<ul className="mt-6 space-y-4">
				{todos.map((todo, index) => (
					<li
						key={todo._id || index}
						className="flex items-center justify-between p-4 border rounded shadow-sm"
					>
						<span>{todo.title}</span>
						<div className="space-x-2">
							<button
								onClick={() => editTodo(todo)}
								className="text-blue-500 hover:text-blue-700"
							>
								Edit
							</button>
							<button
								onClick={() => deleteTodo(todo._id)}
								className="text-red-500 hover:text-red-700"
							>
								Delete
							</button>
						</div>
					</li>
				))}
			</ul>
		</main>
	);
}
