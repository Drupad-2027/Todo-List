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

  const handleAdd = async () => {
    if (!task.trim()) return

    try {
      await fetch("http://localhost:3001/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task })
      })

      setTask("")
      fetchTodos()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`http://localhost:3001/delete/${id}`, {
        method: "DELETE"
      })

      fetchTodos()
    } catch (err) {
      console.error(err)
    }
  }

  const startEdit = (todo: Todo) => {
    setTask(todo.task)
    setEditingId(todo._id)
  }

  const cancelEdit = () => {
    setTask("")
    setEditingId(null)
  }

  const handleUpdate = async () => {
    if (!task.trim() || !editingId) return

    try {
      await fetch(`http://localhost:3001/update/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task })
      })

      setTask("")
      setEditingId(null)
      fetchTodos()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#070B14] via-[#0B1220] to-[#0A0F1C] flex flex-col items-center py-14 px-4">

      {/* HEADER */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-white tracking-tight">
          Task<span className="text-cyan-400">Board</span>
        </h1>
        <p className="text-gray-400 mt-2">
          Minimal. Fast. Productive.
        </p>
      </div>

      {/* INPUT CARD */}
      <div className="w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex gap-3 shadow-2xl">

        <input
          className="flex-1 bg-black/30 text-white px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter a new task..."
        />

        <button
          onClick={editingId ? handleUpdate : handleAdd}
          disabled={!task.trim()}
          className={`px-6 py-3 rounded-xl font-semibold transition transform hover:scale-105 disabled:opacity-40 ${
            editingId
              ? "bg-emerald-500 hover:bg-emerald-600 text-white"
              : "bg-cyan-500 hover:bg-cyan-600 text-black"
          }`}
        >
          {editingId ? "Update" : "Add"}
        </button>

        {editingId && (
          <button
            onClick={cancelEdit}
            className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
          >
            Cancel
          </button>
        )}
      </div>

      {/* LIST */}
      <div className="mt-10 w-full max-w-2xl space-y-3">

        {todos.map((todo) => (
          <div
            key={todo._id}
            className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex justify-between items-center shadow-md hover:shadow-cyan-500/10 hover:border-cyan-500/30 transition"
          >

            {/* LEFT ACCENT BAR */}
            <div className="absolute left-0 top-0 h-full w-1 bg-cyan-500 rounded-l-2xl opacity-0 group-hover:opacity-100 transition" />

            {/* TASK */}
            <span className="text-white text-lg font-medium ml-2">
              {todo.task}
            </span>

            {/* ACTIONS */}
            <div className="flex gap-2">

              <button
                onClick={() => startEdit(todo)}
                className="px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-black font-semibold transition transform hover:scale-105"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(todo._id)}
                className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition transform hover:scale-105"
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