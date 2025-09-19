
import { useAuthActions } from "@convex-dev/auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"


const signinSchema = z.object({
    email : z.email("invalid email address"),
    password : z.string().min(6, "password should be atleast 6 word").max(40,"max length of password is 40")  
})

const signUpSchema = z.object({
    email : z.email("invalid email address"),
    password : z.string().min(6, "password should be atleast 6 word").max(40,"max length of password is 40") ,
    firstName : z.string().min(6, "name should be atleast 6 word").max(40,"max length of password is 40"), 
    lastName : z.string().min(6, "password should be atleast 6 word").max(40,"max length of password is 40")  
})

type SignInData = z.infer<typeof signinSchema>
type SignUpData = z.infer<typeof signUpSchema>


export default function useAuth(){
    const { signIn , signOut } = useAuthActions()
    const router = useRouter()
    const [ loading , setLoading ] = useState(false)


    const signinForm = useForm<SignInData>({
        resolver : zodResolver(signinSchema),
        defaultValues : {
            email : "",
            password : ""
        }
    })

    const signUpform = useForm<SignUpData>({
        resolver : zodResolver(signUpSchema),
        defaultValues : {
            email : "",
            password : "",
            firstName : "",
            lastName : ""
        }
    })    
    
    const handleSignIn = async (data : SignInData)=>{
        setLoading(true) // loading set true start loading
        // logic between loading
        try{
            await signIn("password",{
                email : data.email,
                password : data.password,
                flow  : "signIn"
            })
            router.push("dashboard")
        }catch(error){
            signinForm.setError("password",{
                message : "invalid email or password"
            })
            toast.error("invalid email or password")
        }finally{
            setLoading(false) // loading set false
        }
        
    }
    
    const handleSignUP = async (data : SignUpData)=>{
        setLoading(true) // loading set true start loading
        // logic between loading
        try{
            await signIn("password",{
                email : data.email,
                firstName : data.firstName,
                name : `${data.firstName} ${data.lastName}`,
                flow : "signup"
            })
            router.push("dashboard")
        }catch(e){
            signUpform.setError("root",{
                message : "failed to create account, email may already exist"
            })
        }
        finally{
            setLoading(false) // loading set false
        }
        
    }

    const handleSignOut = async ()=>{
        setLoading(true)
        await signOut()
        setLoading(false)
    }

    return {
        loading,
        signinForm,
        signUpform,
        handleSignIn,
        handleSignUP,
        handleSignOut,
    }
}