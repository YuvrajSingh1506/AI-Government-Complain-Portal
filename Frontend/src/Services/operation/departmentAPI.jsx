import { apiConnector } from "../apiConnector";
import { departmentEndpoints } from "../api";
import toast from "react-hot-toast";
const {
    GET_ALL_DEPARTMENT_API 
} = departmentEndpoints;

export const getAllDepartment = async()=>{
    try{
        const response = await apiConnector("GET",GET_ALL_DEPARTMENT_API,
            null,
            {
                Authorization: `Bearer ${localStorage.getItem("token")}`, 
            }
        )
        if(!response.data.success){
            throw new Error(response.data.message);
        }
        return response;
    }catch(err){
        console.log(err);
        toast.error(err.response?.data?.message || err.message || "Failed to get complains");
        return null;
    }
}
