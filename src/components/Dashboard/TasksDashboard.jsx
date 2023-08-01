import React, { useEffect, useState } from 'react'
import TaskDetails from './TaskDetails'


export default function TasksDashboard(params) {
  const {tasks, setShowAddTaskModal, getTasks, categories, setShowAddCategoryModal} = params
  const [taskShow, setTaskShow] = useState({})
  const [showExpiredTasks, setShowExpiredTasks] = useState(false)
  const [showIncomingTasks, setShowIncomingTasks] = useState(false)
  const [showCompletedTasks, setShowCompletedTasks] = useState(false)
  const [isTaskEmpty, setIsTaskEmpty] = useState(true)
  const [completedTasks, setCompletedTasks] = useState([])
  const [expiredTasks, setExpiredTasks] = useState([])
  const [incomingTasks, setIncomingTasks] = useState([])

  function categorizeTasks(tasks){
    const completeArr = []
    const expiredArr = []
    const incomingArr = []
  
    tasks.map(task=>{
      const dateNow = Date.now()
      const dueDate = Date.parse(task.due_date)
      if(task.is_complete){
        completeArr.push(task)
      }
      else if(dueDate<dateNow){
        expiredArr.push(task)
      }
      else{
        incomingArr.push(task)
      }
    })
    setCompletedTasks(completeArr)
    setExpiredTasks(expiredArr)
    setIncomingTasks(incomingArr)
  }
  const toggleExpiredTasks =()=>{
    setShowExpiredTasks(!showExpiredTasks)
  }
  const toggleIncomingTasks =()=>{
    setShowIncomingTasks(!showIncomingTasks)
  }
  const toggleCompletedTasks =()=>{
    setShowCompletedTasks(!showCompletedTasks)
  }

  function generateTasksList(tasksList){
    let className = 'task-item'
    switch(tasksList){
      case expiredTasks:
        className = 'task-item expired'
        break;
      case incomingTasks:
        className = 'task-item incoming'
        break;
      case completedTasks:
        className = 'task-item completed'
        break;
    }
    tasksList.sort(
      (taskA, taskB) => {
        const timeA = (Date.parse(taskA.due_date))
        const timeB = (Date.parse(taskB.due_date))
        return Number(timeA) - Number(timeB)
      }
    )
    return tasksList.map((task, index)=>{
      const dueDate =()=>{
        const dateNow = new Date(Date.now()).toDateString()
        const dueDate = (new Date(task.due_date)).toDateString()
            if(dueDate == dateNow){
                return "Today"
            }
            else{
                return dueDate
            }
    }
      return (<div className={className} key={task.id} onClick={()=>{
        setIsTaskEmpty(false)
        setTaskShow(tasksList[index])}}>
        <p>{task.name}</p>
        <p>{dueDate()}</p>
      </div>)
    })
  }

  useEffect(()=>{
    // setExpiredTasks([])
    // setIncomingTasks([])
    categorizeTasks(tasks)

  },[tasks])
  return (
    <>
      <div className='task-dashboard dashboard-container'>
        <section className='task-list-container'>
          <button type="button"className='add-task-button' onClick={()=>setShowAddTaskModal(true)}>
            Add new task
          </button>
          <div className='expired-tasks-container'>
            <div className='task-item' onClick={toggleExpiredTasks}>
              <p>Expired Tasks</p> 
              <p>({expiredTasks.length})</p>
            </div>
            {showExpiredTasks &&<div>
              {generateTasksList(expiredTasks)}
            </div>}
            
          </div>
          <div>
            <div className='task-item' onClick={toggleIncomingTasks}>
              <p>Tasks</p> 
              <p>({incomingTasks.length})</p>
            </div>
              {showIncomingTasks && <div>
                {generateTasksList(incomingTasks)}
            </div>}
          </div>
          <div>
            <div className='task-item' onClick={toggleCompletedTasks}>
                  <p>Completed Tasks</p> 
                  <p>({completedTasks.length})</p>
                </div>
                {showCompletedTasks && <div>
                  {generateTasksList(completedTasks)}
              </div>}
          </div>
        </section>
        <section>
          {!isTaskEmpty && <TaskDetails taskShow={taskShow} getTasks={getTasks} setIsTaskEmpty={setIsTaskEmpty} categories={categories}
          setShowAddCategoryModal={setShowAddCategoryModal}/>}
        </section>
      </div>
      
    </>
    
  )
}
