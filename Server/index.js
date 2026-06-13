const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const TodoModel = require('./Models/Todo')

const app = express()
app.use(cors())
app.use(express.json())

// ✅ MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/WorkUpdates')
    .then(() => console.log("MongoDB Connected ✅"))
    .catch(err => console.log("MongoDB Error ❌", err))

// ✅ TEST ROUTE (important)
app.get('/', (req, res) => {
    res.send("API Working 🚀")
})

// ✅ GET TODOS
app.get('/get', (req, res) => {
    TodoModel.find()
        .then(result => res.json(result))
        .catch(err => res.json(err))
})

// ✅ ADD TODO (with validation + logs)
app.post('/add', (req, res) => {
    console.log("Incoming Data:", req.body)

    const { task } = req.body

    if (!task) {
        return res.status(400).json({ error: "Task is required ❌" })
    }

    TodoModel.create({ task })
        .then(result => {
            console.log("Saved:", result)
            res.json(result)
        })
        .catch(err => {
            console.log("Error:", err)
            res.status(500).json(err)
        })
})
app.put('/update/:id', (req, res) => {
    const { id } = req.params;
    const { task, done } = req.body;

    TodoModel.findByIdAndUpdate(
        id,
        { task, done },
        { new: true }
    )
        .then(result => res.json(result))
        .catch(err => res.status(500).json(err))
})

// ✅ FIXED DELETE ROUTE
app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;

    TodoModel.findByIdAndDelete(id)
        .then(result => res.json(result))
        .catch(err => res.json(err))
})

// ✅ SERVER
app.listen(3001, () => {
    console.log("Server is running on port 3001 🚀")
})