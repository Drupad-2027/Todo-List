"use client"
import { useState, useEffect } from "react"

type Todo = {
  _id: string
  task: string
}

export default function Home() {
  const [task, setTask] = useState<string>("")
  const [todos, setTodos] = useState<Todo[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)

  // Fetch todos
  const fetchTodos = async () => {
    try {
      const res = await fetch("http://localhost:3001/get")
      const data: Todo[] = await res.json()
      setTodos(data)
    } catch (err) {
      console.error("Error fetching todos:", err)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  // ADD TODO
  const handleAdd = async () => {
    if (!task.trim()) return

    try {
      const res = await fetch("http://localhost:3001/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task })
      })

      if (!res.ok) throw new Error("Failed to add todo")

      setTask("")
      fetchTodos()
    } catch (err) {
      console.error(err)
    }
  }

  // DELETE TODO
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3001/delete/${id}`, {
        method: "DELETE"
      })

      if (!res.ok) throw new Error("Failed to delete todo")

      fetchTodos()
    } catch (err) {
      console.error(err)
    }
  }

  // START EDIT
  const startEdit = (todo: Todo) => {
    setTask(todo.task)
    setEditingId(todo._id)
  }

  // CANCEL EDIT
  const cancelEdit = () => {
    setTask("")
    setEditingId(null)
  }

  // UPDATE TODO
  const handleUpdate = async () => {
    if (!task.trim() || !editingId) return

    try {
      const res = await fetch(
        `http://localhost:3001/update/${editingId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ task })
        }
      )

      if (!res.ok) throw new Error("Failed to update todo")

      setTask("")
      setEditingId(null)
      fetchTodos()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="flex flex-col items-center mt-20">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>

      {/* INPUT */}
      <div className="flex gap-2">
        <input
          className="border p-2"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter task"
        />

        <button
          onClick={editingId ? handleUpdate : handleAdd}
          disabled={!task.trim()}
          className={`px-4 text-white ${
            editingId ? "bg-green-500" : "bg-blue-500"
          }`}
        >
          {editingId ? "Update" : "Add"}
        </button>

        {editingId && (
          <button
            onClick={cancelEdit}
            className="bg-gray-400 text-white px-4"
          >
            Cancel
          </button>
        )}
      </div>

      {/* LIST */}
      <div className="mt-5 w-64">
        {todos.map((todo) => (
          <div
            key={todo._id}
            className="flex justify-between items-center border p-2 mb-2"
          >
            <span>{todo.task}</span>

            <div className="flex gap-2">
              <button
                onClick={() => startEdit(todo)}
                className="bg-yellow-400 px-2"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(todo._id)}
                className="bg-red-500 text-white px-2"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}