import { apiConnector } from "../apiConnector"
import { complainEndpoints } from "../api"
import toast from "react-hot-toast";
const {CREATE_COMPLAIN_API,
     GET_USER_COMPLAIN_API,
     GET_COMPLAIN_API,
    DELETE_COMPLAIN_API} = complainEndpoints;
export const createComplainApi = async(formData) =>{
    const toastId = toast.loading("Loading");
    try{
        const response = await apiConnector("POST",
            CREATE_COMPLAIN_API,
            formData,
            {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        )
        console.log("COMPLAIN", response);
        if(!response.data.success){
            throw new Error(response.data.message);
        }
        toast.success("Complain created successfully");
        return response.data;
    }catch(err){
        console.log(err);
        toast.error("Failed to create complain");
        return null;
    }
    finally{
        toast.dismiss(toastId);
    }
} 
export const getUserComplain = async()=>{
    const toastId = toast.loading("Loading");
    try{
        const response = await apiConnector("GET",
            GET_USER_COMPLAIN_API,
            null,
            {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        );
        console.log("Complains",response);
        if(!response.data.success){
            throw new Error(response.data.message);
        }
        toast.success("Complains fetch successfully");
        return response;

    }catch(err){
        console.log(err);
        toast.error("Failed to get Complain");
        return null;
    }finally{
        toast.dismiss(toastId);
    }
}
export const getComplainDetail = async(complainId)=>{
    const toastId = toast.loading("Loading...");
    try{
        const response = await apiConnector("GET",
            `${GET_COMPLAIN_API}/${complainId}`,
            null,
            {
                Authorization : `Bearer ${localStorage.getItem("token")}`
            }
        )
        console.log("COMPLAIN", response);
        if(!response.data.success){
            throw new Error(response.data.message);
        }
        return response;
    }catch(err){
        console.log(err);
        toast.error("Failed to get Complain data");
        return null;
    }finally{
        toast.dismiss(toastId);
    }
}
export const deleteComplaintApi = async(complainId) =>{
    const toastId = toast.loading("Loading...");
    try{
        const response = await apiConnector("DELETE",
            `${DELETE_COMPLAIN_API}/${complainId}`,
        null,
            {
                Authorization : `Bearer ${localStorage.getItem("token")}`
            }
        );
        if(!response.data.success){
            throw new Error(response.data.message);
        }
        toast.success("Complain deleted");

    }catch(err){
        console.log(err);
        toast.error("Failed to delete complain");
    }finally{
        toast.dismiss(toastId);
    }
}