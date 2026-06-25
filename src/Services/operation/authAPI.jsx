import { apiConnector } from "../apiConnector";
import { endpoints } from "../api";
import toast from 'react-hot-toast';
const {SIGNUP_API,LOGIN_API} = endpoints;
export const signUp = async (name, email, password, confirmPassword, role, navigate) =>{ 
        const toastId = toast.loading("Loading")
        try{    
            const response = await apiConnector("POST",SIGNUP_API,{
                name,
                email,
                password, 
                confirmPassword,
                role
            })
            console.log("USER",response);
            if(!response.data.success){
                toast.error("User cannot be created");
                navigate("/signup");
                throw new Error("USER CANNOT BE CREATED",response.data.message);
            }
             toast.success("User created successfully");
            navigate("/login");  
        }catch(err){
            console.log("USER ERROR", err);
            toast.error( err.response?.data?.message || err.message || "Failed to create user");
        }
        finally{

            toast.dismiss(toastId);
        }
    }
export const login = async({email , password,navigate}) =>{
    const toastId = toast.loading("Loading");
    try{
        const response = await apiConnector("POST",LOGIN_API,{
            email,
            password,
        })
        console.log("USER" ,response);
        if(!response.data.success){
            throw new Error("SOMETHING WENT WORNG",response.data.message);
            return;
        }
        const data = response.data;
        localStorage.setItem("token", data.token);
        localStorage.setItem(
        "user",
        JSON.stringify(data.userObj)
        );

        toast.success("Logged in successfully");

        if (data.userObj.role === "Admin") {
            console.log("wennf1");
            navigate("/admin");
        } else if (data.userObj.role === "Official") {
            console.log("wennf2");
            navigate("/official");
        } else {
            console.log("wennf3");
            navigate("/dashboard");
        }
        return data;
    }catch(err){
        console.log(err);
        toast.error( err.response?.data?.message || err.message || "Failed to login");
        return null;
    }
    finally{
        toast.dismiss(toastId);
    }
}