import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import  {UserAuthContext}  from '../../Helper/Context'

export default function LogIn() {
    const navigate = useNavigate()
    const {userAuth, setUserAuth, setToken, setTokenExpiration} = useContext(UserAuthContext)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const auth_User = async (e)=>{
        e.preventDefault()
        const API_URL = import.meta.env.VITE_REACT_APP_API_URL
        try {
            const userDataRes = await fetch(`${API_URL}/auth/signin`,{
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body:JSON.stringify({
                'user':{
                    "email": email,
                    "password": password
                }
                })
            })
            const res = await userDataRes.json()
            if(res.status == 'success'){
                const body = res.body
                sessionStorage.setItem("token", JSON.stringify(body.user.token));
                sessionStorage.setItem("token_expiration", JSON.stringify(body.user.token_expiration))
                setToken(body.user.token)
                setTokenExpiration(body.user.token_expiration)
                setUserAuth(true)
                navigate('/')
            }
            else{
                console.log(res)
            }
        } catch (error) {
            console.log(error)
        }   
    }

    return (
        <div>
            <form action="">
            <label htmlFor="email">Email</label>
            <input value={email} type="email" name='email' onChange={e => {
                setEmail(e.target.value)
                }}/>
            <label htmlFor="password">Password</label>
            <input value={password} type="password" name='password' id='password' onChange={e=>setPassword(e.target.value)}/>
            <button type='submit' onClick={(e)=>auth_User(e)}>Sign up</button>
            </form>
            <p>No account? <Link to='/auth/signup'>Register</Link></p>
        </div>
    )
}
