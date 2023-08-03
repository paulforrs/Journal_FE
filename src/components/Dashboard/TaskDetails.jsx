import { useState, useEffect, useContext } from "react"
import { UserAuthContext } from "../../Helper/Context"
export default   function TaskDetails(params){
    const {taskShow, getTasks, setIsTaskEmpty, categories, setShowAddCategoryModal, setTaskShow, getTasksByCategory} = params
    const {token, setUserAuth} = useContext(UserAuthContext)
    const [editedTaskName, setEditedTaskName] = useState('')
    const [editedCategoryName, setEditedCategoryName ]= useState('')
    const [editedCategoryId, setEditedCategoryId ]= useState('')
    const [editedDescription,setEditedDescription] = useState('')
    const [editedDueDate,setEditedDueDate] = useState('')
    const [category, setCategory] = useState('')
    const [isEditing, setIsEditing ]= useState(false)
    const API_URL = import.meta.env.VITE_REACT_APP_API_URL
    const id = taskShow.id
    const isComplete = taskShow.is_complete

    function editingMode(){
        setIsEditing(true)
        setEditedCategoryName(category['name'])
        setEditedCategoryId(taskShow.category_id)
        setEditedDescription(taskShow.description)
        setEditedTaskName(taskShow.name)
        setEditedDueDate((new Date(taskShow.due_date)).toUTCString().toString())
    }
    function getCategoryName(categories){
        return categories.map(category=>{
            if (category.id == taskShow.category_id){
                setCategory(category)
            }
            
        })
    }
    console.log(taskShow.category_id)
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
              getTasks()
              setTaskShow(res.body)
              getTasksByCategory()
              console.log('updated')
              
            }
            else{
              setUserAuth(false)
              alert('Token timeout')
            }
          } catch (error) {
            console.log(error)
            
          }
    }
    useEffect(()=>{
        getCategoryName(categories)
    },[taskShow])
    return(
        <div className="task-details-container">
            <div className="show-task-wrapper">
                <div className="show-task-header">
                { !isEditing ?
                    <>  <div>
                            <h1 className="task-details-name">{taskShow.name}</h1>
                        </div>
                        <div className="task-details-buttons-wrapper">
                            <button className="task-details-button edit" type='button' onClick={()=>{
                                editingMode()
                            }}>
                                Edit
                            </button>
                            <button className="task-details-button red" type='button' onClick={()=>{
                                deleteTask()
                            }}>
                                Delete
                            </button>
                            {!isComplete ? <button className="task-details-button complete" type='button' onClick={()=>{markComplete("true")}}>
                                Mark as Complete
                            </button>:
                            <button className="task-details-button" type='button' onClick={()=>{markComplete("false")}}>
                                Mark as Undone
                            </button>}
                        </div>
                       </>
                    :
                    <>
                        <div>
                            <input className="task-details-name" value={editedTaskName} onChange={(e)=>{
                                setEditedTaskName(e.target.value)
                            }}></input>
                        </div>
                        
                        <div className="task-details-buttons-wrapper">
                            <button className="task-details-button save" type='button' onClick={()=>{
                                setIsEditing(false)
                                updateTask()
                            }}>
                                Save
                            </button>
                            <button className="task-details-button red" type='button' onClick={()=>{
                                setIsEditing(false)
                            }}>
                                Discard
                            </button>
                        </div>
                    </>
                     }
                </div>
                {!isEditing ? 
                    <>
                        <div className="task-category-wrapper">
                            <h3 className="task-details-category">Catergory: {category['name']}</h3>
                        </div>
                        <div className="task-due-date-wrapper">
                            <h4>Due by {dueDate()}</h4>
                        </div>
                        <div className="task-description-wrapper">
                            <h3>Task Description</h3>
                            <p className="task-details-description">{taskShow.description}</p>
                        </div>
                    </>
                    : 
                    <>
                    <div className="task-category-wrapper">
                        <label htmlFor="category">
                            Select Category:
                            <select className="task-details-category" id='category'value={editedCategoryName} onChange={(e)=>{onChangeCategory(e)}}>
                                {categoryList(categories)}
                            </select>
                        </label>
                        <button onClick={()=>setShowAddCategoryModal(true)}>Add Category</button>
                    </div>
                    <div className="task-due-date-wrapper">
                    <label htmlFor="">Due Date</label>
                        <input value={editedDueDate}type="datetime-local" id="due-date" onChange={(e)=>{
                            console.log(e.target.value)
                            setEditedDueDate(e.target.value)}}/>
                    </div>
                    <div className="task-description-wrapper">
                        <label htmlFor="">
                            Task Description
                            <input className="task-details-description" value={editedDescription}type="text" onChange={(e)=>{
                            setEditedDescription(e.target.value)
                            }}/>
                        </label>
                    </div>
                   </>}  
            </div>
        </div>
    )

  }
