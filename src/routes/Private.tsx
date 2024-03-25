import { ReactNode, useState, useEffect } from 'react'
import { auth } from '../services/firebaseConnection'
import { onAuthStateChanged } from 'firebase/auth'
import { Navigate } from 'react-router-dom'


interface PrivateProps{
    children: ReactNode;
}

export function Private({ children }: PrivateProps): any{
    const [loading, setLoading] = useState(true)
    const [signed, setSigend] = useState(false)

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if(user) {
                const userData = {
                    uid: user?.uid,
                    email: user.email
                }
                localStorage.setItem('@reactlinks', JSON.stringify(userData))
                setLoading(false)
                setSigend(true)

            }else{
                setLoading(false)
                setSigend(false)
            }
        })

        return() => {
            unsub()
        }

    }, [])

    if(loading){
        return <></>
    }

    if(!signed){
        return<Navigate to='/login' /> 
    }

    return children
}