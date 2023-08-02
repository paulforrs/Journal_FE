import { useContext, useEffect, useState } from "react"
import { UserAuthContext } from "../../Helper/Context"
import TaskDetails from "./TaskDetails"

export default function CategoriesDashboard(params) {
  const {tasks, setShowAddTaskModal, getTasks, categories, setShowAddCategoryModal, getCategories} = params
  const {token} = useContext(UserAuthContext)
  const [taskShow, setTaskShow] = useState({})
  const [isTaskEmpty, setIsTaskEmpty] = useState(true)
  const [categoryShow, setCategoryShow]= useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [editedCategoryName, setEditedCategoryName] = useState('')
  const [categoryShowId, setCategoryShowId] = useState('')
  const [categoriesObject, setCategoriesObject] = useState([])
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL

  function setCategory(id){
    console.log('task Set')
    categoriesObject.map((category)=>{
      if(category.category_id == id){
        setCategoryShow(category)
      }
    })
  }
  
  const getTasksByCategory=async()=>{
    console.log('gentaskcat')
    try {
      const getTasksByCategoryResponse = await fetch(`${API_URL}/users/id/categories/tasks`,{
        method: "GET",
        headers:{"Content-Type": "application/json",
                  "Authorization" : `Token ${token}`
        }
      })
      const res = await getTasksByCategoryResponse.json()
      if(res.status == 'success'){
        setCategoriesObject(res.body)
      }
      else{
        // setUserAuth(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const deleteCategory= async()=>{
    try {
      const getDeleteCategoryRes = await fetch(`${API_URL}/users/id/categories/${categoryShowId}`,{
        method: "DELETE",
        headers:{"Content-Type": "application/json",
                  "Authorization" : `Token ${token}`
        }
      })
      const res = await getDeleteCategoryRes.json()
      if(res.status == 'success'){
        getTasksByCategory()
        getCategories()
        console.log(res)
        setCategoryShow([])
        // console.log(res.body)
      }
      else{
        // setUserAuth(false)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const updateCategory = async()=>{
    try {
      const getUpdateCategoryRes = await fetch(`${API_URL}/users/id/categories/${categoryShowId}`,{
        method: "PATCH",
        headers:{"Content-Type": "application/json",
                  "Authorization" : `Token ${token}`
        },
        body:JSON.stringify({
          "categories":{
              "name": editedCategoryName,
          }
      })

      })
      const res = await getUpdateCategoryRes.json()
      if(res.status == 'success'){
        getTasksByCategory()
        console.log(res.body)
        getCategories()
        console.log(res)
        setCategoryShow([])
        // console.log(res.body)
      }
      else{
        // setUserAuth(false)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const generateCategories=(categories)=>{
    return categories.map((category)=>{
      return <li key={category.id} id={category.id} onClick={()=>{
        setCategoryShowId(category.id)
        setCategory(category.id)}}>
        {category.name}
        </li>
    })
  }
  const generateTasks=(categoryShow)=>{
    console.log(categoryShow)
    if(categoryShow.length != 0){
      const tasks = categoryShow.tasks
      if(tasks.length == 0){
        return <div>No tasks</div>
      }
      else{
        return tasks.map(task=>{
          return (<div key={task.id} className="task-item" onClick={()=>{
            setTaskShow(task)
            setIsTaskEmpty(false)
          }}>
              {task.name}
          </div>)
        })
      }
    }
  }
  useEffect(()=>{
    getTasksByCategory()
    setCategory()
  },[])
  useEffect(()=>{
    console.log(categoryShow)
    setCategory(categoryShowId)
    generateTasks(categoryShow)
  }, [categoriesObject])
  return (
    <>
      <div className="categories-dashboard dashboard-container">
        <ul className="category-list">
          {generateCategories(categories)}
          <button onClick={()=>setShowAddCategoryModal(true)}>Add</button>
        </ul>
      </div>
      <div>
        <div>
          <div>
            {isEditing ? 
            <>
            <input value={editedCategoryName}type="text" onChange={(e)=>setEditedCategoryName(e.target.value)}/>
            <button onClick={()=>{
              updateCategory()
              setIsEditing(false)}}>Save</button>
            </>
            :
            <p>{categoryShow.category_name}</p>}
            <div>
              <button onClick={()=>{
                setEditedCategoryName(categoryShow.category_name)
                setIsEditing(true)}}>Edit</button>
              <button onClick={deleteCategory}>Delete</button>
            </div>
          </div>

          {generateTasks(categoryShow)}
        </div>
        {/* const {taskShow, getTasks, setIsTaskEmpty, categories, setShowAddCategoryModal, setTaskShow} = params */}
        {!isTaskEmpty && 
        <TaskDetails taskShow={taskShow} getTasks={getTasks} setIsTaskEmpty={setIsTaskEmpty} categories={categories}
        setShowAddCategoryModal={setShowAddCategoryModal}
        setTaskShow={setTaskShow} getTasksByCategory={getTasksByCategory}/>
        }
        
      </div>
    </>
  )
}
