import { apiConnector } from "../apiConnector";
import { complainEndpoints } from "../api";
import toast from "react-hot-toast";
const {
    GET_ALL_COMPLAIN_API,
    GET_DASHBOARD_DATA_API,
    ASSIGN_COMPLAIN_API
} = complainEndpoints;
export const getAllComplainsAPI = async()=>{
    const toastId = toast.loading("Loading...");
    try{
        const response = await apiConnector("GET",
            GET_ALL_COMPLAIN_API,
            null,
            {
                Authorization : `Bearer ${localStorage.getItem("token")}`
            }
        )

        console.log("COMPLAINS", response);
        if(!response.data.success){
            throw new Error(response.data.message);
        }
        return response;
    }catch(err){
        console.log(err);
        toast.error(err.response?.data?.message || err.message || "Failed to All Complain data")
        return null
    }finally{
        toast.dismiss(toastId);
    }
}
export const getDashboardDataAPI = async()=>{
     const toastId = toast.loading("Loading...");
    try{
        const response = await apiConnector("GET",
            GET_DASHBOARD_DATA_API,
            null,
            {
                Authorization : `Bearer ${localStorage.getItem("token")}`
            }
        )

        console.log("DASHBOARD DATA", response);
        if(!response.data.success){
            throw new Error(response.data.message);
        }
        return response;
    }catch(err){
        console.log(err);
        toast.error(err.response?.data?.message || err.message || "Failed to All Complain data")
        return null
    }finally{
        toast.dismiss(toastId);
    }
}
export const assignComplainAPI = async(official, department)=>{
    const toastId = toast.loading("Loading...");
    // console.log(official,department);
    try{
        const response = await apiConnector("PUT", ASSIGN_COMPLAIN_API,
            {
                officialId : official,
                departmentId : department
            },
            {
                Authorization : `Bearer ${localStorage.getItem("token")}`
            }
        )
        if(!response.data.success){
            throw new Error(response.data.message);
        }
        toast.success("Complain assing successfully");
        return response;
    }catch(err){
        console.log(err);
        toast.error(err.response.data.message || err.message || "Failed to assign complain");
        return null;
    }finally{
        toast.dismiss(toastId);
    }
}