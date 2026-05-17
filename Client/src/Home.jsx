import React from 'react'
import Create from './Create'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { BsCircleFill, BsFillTrashFill, BsFillCheckCircleFill } from "react-icons/bs";

function Home() {

    const [todos, setTodos] = useState([])

    useEffect(() => {
        axios.get("http://localhost:3001/get")
            .then(result => setTodos(result.data))
            .catch(err => console.log(err))
    }, [])

    const handleEdit = (id) => {

        axios.put("http://localhost:3001/update" + id)
            .then(result => {
                location.reload()
            }
            )
            .catch(err => console.log(err))
    }

    const handleDelete=(id)=>
    {
         axios.delete("http://localhost:3001/delete" + id)
            .then(result => {
                location.reload()
            }
            )
            .catch(err => console.log(err))
    }
    

    return (
        <div className="container">
            <h2>Todo List</h2>

            <Create />

            {
                todos.length === 0
                    ? <div><h1>No Records</h1></div>
                    :
                    todos.map(todo => (
                        <div className="todo-task">

                            <span className="icon" onClick={() => handleEdit(todo._id)}>
                                {todo.done ? <BsFillCheckCircleFill></BsFillCheckCircleFill> :
                                    <BsCircleFill />

                                }

                            </span>

                            <span className="task-text" className={todo.done?"line_through":""}>
                                {todo.task}
                            </span>

                            <span className="delete-icon" onClick={()=>handleDelete(todo._id)}>
                                <BsFillTrashFill />
                            </span>

                        </div>
                    ))
            }
        </div>
    )
}
export default Home