import { useState, useEffect, useContext } from "react"
import { UserAuthContext } from "../../Helper/Context"
export default   function TaskDetails(params){
    const {taskShow, getTasks, setIsTaskEmpty, categories, setShowAddCategoryModal} = params
    const {token, setUserAuth} = useContext(UserAuthContext)
    const [editedTaskName, setEditedTaskName] = useState(taskShow.name)
    const [editedCategoryName, setEditedCategoryName ]= useState(categoryName(categories)[0])
    const [editedCategoryId, setEditedCategoryId ]= useState(taskShow.category_id)
    const [editedDescription,setEditedDescription] = useState(taskShow.description)
    const [editedDueDate,setEditedDueDate] = useState((new Date(taskShow.due_date)).toUTCString().toString())
    const [isEditing, setIsEditing ]= useState(false)
    const API_URL = import.meta.env.VITE_REACT_APP_API_URL
    const id = taskShow.id
    const isComplete = taskShow.is_complete

    function categoryName(categories){
        return categories.map(category=>{
            if(category.id == taskShow.category_id){
                return category.name
            } 
        })
    }
    const categoryList=(categories)=>{
        return categories.map(category =>{
            return (<option key={category.id} id={category.id} value={category.name}>{category.name}
                </option>)

        })
    }
    const onChangeCategory = (e)=>{
        const id = e.target.options[e.target.selectedIndex].id
        setEditedCategoryName(e.target.value)
        setEditedCategoryId(id)
    }
    
    const dueDate =()=>{
        const dateNow = new Date(Date.now()).toDateString()
        const dueDate = (new Date(taskShow.due_date)).toDateString()
            if(dueDate == dateNow){
                return "Today"
            }
            else{
                return dueDate
            }
    } 
    async function deleteTask(){
        
        try {
            const deleteTaskResponse = await fetch(`${API_URL}/users/id/tasks/${id}`,{
              method: "DELETE",
              headers:{"Content-Type": "application/json",
                        "Authorization" : `Token ${token}`
              }
            })
            const res = await deleteTaskResponse.json()
            if(res.status == 'success'){
              console.log(res.body)
              getTasks()
              setIsTaskEmpty(true)
            }
            else{
              setUserAuth(false)
            }
          } catch (error) {
            console.log(error)
            
          }
    }
    async function markComplete(params){
        try {
            const markCompleteResponse = await fetch(`${API_URL}/users/id/tasks/${id}`,{
              method: "PATCH",
              headers:{"Content-Type": "application/json",
                        "Authorization" : `Token ${token}`
              },
              body:JSON.stringify({
                "tasks":{
                    "category_id": taskShow.category_id,
                    "name": taskShow.name,
                    "due_date": taskShow.due_date,
                    "description": taskShow.description,
                    'is_complete': params
                }
            })
            })
            const res = await markCompleteResponse.json()
            console.log(res)
            if(res.status == 'success'){
              console.log(res.body)
              getTasks()
              setIsTaskEmpty(true)
            }
            else{
              setUserAuth(false)
            }
          } catch (error) {
            console.log(error)
            
          }
    }
    async function updateTask(){
        try {
            const updateTaskResponse = await fetch(`${API_URL}/users/id/tasks/${id}`,{
              method: "PATCH",
              headers:{"Content-Type": "application/json",
                        "Authorization" : `Token ${token}`
              },
              body:JSON.stringify({
                "tasks":{
                    "category_id": editedCategoryId,
                    "name": editedTaskName,
                    "due_date": (new Date(editedDueDate)).toUTCString(),
                    "description": editedDescription
                }
            })
            })
            const res = await updateTaskResponse.json()
            if(res.status == 'success'){
              console.log(res.body)
              getTasks()
            }
            else{
              setUserAuth(false)
              alert('Token timeout')
            }
          } catch (error) {
            console.log(error)
            
          }
    }
    
    return(
        <>
            { !isEditing ?
            <div>
                <div>
                    <button type='button' onClick={()=>{
                        setIsEditing(true)
                    }}>
                        Edit
                    </button>
                    <button type='button' onClick={()=>{
                        deleteTask()
                    }}>
                        Delete
                    </button>
                    {!isComplete ? <button type='button' onClick={()=>{markComplete("true")}}>
                        Mark as Complete
                    </button>:
                    <button type='button' onClick={()=>{markComplete("false")}}>
                        Mark as Undone
                    </button>}
                </div>
                <h1>{taskShow.name}</h1>
                <h3>{categoryName[0]}</h3>
                <h4>Due by {dueDate()}</h4>
                <p>{taskShow.description}</p>
            </div>:
            // EDIT UI
            <div>
                <div>
                    <button type='button' onClick={()=>{
                        setIsEditing(false)
                        updateTask()
                    }}>
                        Save
                    </button>
                    <button type='button' onClick={()=>{
                        setIsEditing(false)
                    }}>
                        Discard
                    </button>
                </div>
                <input value={editedTaskName} onChange={(e)=>{
                    console.log(e.target.value)
                    setEditedTaskName(e.target.value)
                }}></input>
                <select value={editedCategoryName} onChange={(e)=>{onChangeCategory(e)}}>
                    {categoryList(categories)}
                </select>
                <button onClick={()=>setShowAddCategoryModal(true)}>Add Category</button>
                {/* <h3>{categoryName[0]}</h3> */}
                {/* <h4>Due by {dueDate()}</h4> */}
                <input value={editedDueDate}type="datetime-local" id="due-date" onChange={(e)=>setEditedDueDate(e.target.value)}/>
                
                <input value={editedDescription}type="text" onChange={(e)=>{
                    setEditedDescription(e.target.value)
                }}/>
            </div>}
        </>
    )

  }
