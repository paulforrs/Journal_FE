import React, { useContext, useEffect, useState } from 'react'
import Select from "react-select"
import { UserAuthContext } from '../../Helper/Context'

export default function AddTask(params) {
    const {setShowAddTaskModal,setShowAddCategoryModal, categories, getTasks} = params
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
                    "category_id": categoryId,
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
                setShowAddTaskModal(false)
            }
            else{
                setUserAuth(false)
            }
        }
    
    const categoryList=(categories)=>{
        return categories.map(category =>{
            return (<option key={category.id} id={category.id} value={category.name}>{category.name}
                </option>)

        })
    }

    const onChangeDueDate=(e)=>{
        console.log(e.target.value)
        console.log((new Date(e.target.value)).toUTCString())
        setDueDate(e.target.value)
    }
    const onChangeCategory = (e)=>{
        const id = e.target.options[e.target.selectedIndex].id
        console.log(id)
        setCategoryName(e.target.value)
        setCategoryId(id)
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
                <select value={categoryName} onChange={(e)=>{onChangeCategory(e)} }>
                    {categoryName === 'default' && <option value="default" disabled selected>
                    -- Select an option --
                    </option>}
                    
                    {categoryList(categories)}
                </select>
                <button onClick={()=>setShowAddCategoryModal(true)}>Add Category</button>
                <label htmlFor="task[name]">Task Name</label>
                <input value={taskName} type="text" name="task[name]" id="task[name]" onChange={(e)=>setTaskName(e.target.value)}/>
                <label htmlFor="due-date"></label>
                <input value={dueDate}type="datetime-local" id="due-date" onChange={(e)=>onChangeDueDate(e)}/>
                <label htmlFor="description"></label>
                <input value={description}type="text" name="description" id="description" onChange={(e)=>{
                    console.log(e.target.value)
                    setDescription(e.target.value)
                }}/>
                <button onClick={verifyParams}>Add Task</button>
            </div>
        </div>
    )
}
