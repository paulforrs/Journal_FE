import React, { useContext, useState } from 'react'
import { UserAuthContext } from '../../Helper/Context'

export default function AddCategory(params) {
    const {setShowAddCategoryModal, getCategories} = params
    const {setUserAuth} = useContext(UserAuthContext)
    const [token, setToken] = useState(JSON.parse(sessionStorage.getItem("token")) || '')
    console.log(token)
    const [catergoryName, setCategoryName] = useState('')
    const API_URL = import.meta.env.VITE_REACT_APP_API_URL
    async function addCategory(){
        const getCategoryResponse = await fetch(`${API_URL}/users/id/categories`,{
            method: "POST",
            headers:{"Content-Type": "application/json",
                        "Authorization" : `Token ${token}`
            },
            body:JSON.stringify({
                "categories":{
                    "name": catergoryName
                }
                })
            })
            const res = await getCategoryResponse.json()
            console.log(res)
            if(res.status == "success"){
                console.log('created')
                setShowAddCategoryModal(false)
                getCategories()
            }
            else{
                setUserAuth(false)
            }
        }

    return (
        <div className='overlay category-overlay' onClick={(e)=>{
            if(e.target.className.includes('overlay')){
                
                setShowAddCategoryModal(false)}}}>

            <div className='modal'>
                <h1>Add Category</h1>
                <input type="text" name="category[name]" id="" onChange={(e)=>setCategoryName(e.target.value)}/>
                <button onClick={()=>addCategory()}>Add Category</button>
            </div>
        </div>
    )
}
