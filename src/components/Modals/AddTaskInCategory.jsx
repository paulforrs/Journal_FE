import React, { useContext, useEffect, useState } from 'react'
import Select from "react-select"
import { UserAuthContext } from '../../Helper/Context'

export default function AddTaskInCategory(params) {
    const {categoryShowId, setShowAddTaskModal, getTasks, getTasksByCategory} = params
    const {token, setUserAuth} = useContext(UserAuthContext)
    const [taskName, setTaskName] = useState('')
    const [categoryName, setCategoryName] = useState('default')
    const [description, setDescription] = useState('')
    const [categoryId, setCategoryId] = useState("")

    const [dueDate, setDueDate] = useState('')
    const API_URL = import.meta.env.VITE_REACT_APP_API_URL

    async function addTask(){
        console.log('add task')
        const addTaskResponse = await fetch(`${API_URL}/users/id/tasks`,{
            method: "POST",
            headers:{"Content-Type": "application/json",
                        "Authorization" : `Token ${token}`
            },
            body:JSON.stringify({
                "tasks":{
                    "category_id": categoryShowId,
                    "name": taskName,
                    "due_date": (new Date(dueDate)).toUTCString(),
                    "description": description
                }
            })
            })
            const res = await addTaskResponse.json()
            if(res.status == 'success'){
                console.log(res.body)
                getTasks()
                getTasksByCategory()
                setShowAddTaskModal(false)
            }
            else{
                console.log(res)
            }
        }
    const onChangeDueDate=(e)=>{
        console.log(e.target.value)
        console.log((new Date(e.target.value)).toUTCString())
        setDueDate(e.target.value)
    }
    const verifyParams=()=>{
        if(dueDate.length != 0){
            addTask()
        }
    }
    useEffect(()=>{
        setCategoryName('default')
    },[])
    return (
        <div className='overlay' onClick={(e)=>{
            if(e.target.className=="overlay"){
            setShowAddTaskModal(false)
        }}}>
            <div className='modal'>
                {/* <select value={categoryName} name="categories" id="categories" onChange={(e)=>onChangeCategory(e)}>
                    <option disabled hidden>Select an Category</option>
                    {categoryList(categories)}
                </select> */}
                <h1>Add Task</h1>
                <div>
                    <label htmlFor="task[name]">Task Name: </label>
                    <input value={taskName} type="text" name="task[name]" id="task[name]" onChange={(e)=>setTaskName(e.target.value)}/>
                </div>
                <div>
                    <label htmlFor="due-date">Due Date: </label>
                    <input value={dueDate}type="datetime-local" id="due-date" onChange={(e)=>onChangeDueDate(e)}/>
                </div>
                <div>
                    <label htmlFor="description">Task Description: </label>
                    <input value={description}type="text" name="description" id="description" onChange={(e)=>{
                        console.log(e.target.value)
                        setDescription(e.target.value)
                    }}/>
                </div>
                
                
                <button onClick={verifyParams}>Add Task</button>
            </div>
        </div>
    )
}
