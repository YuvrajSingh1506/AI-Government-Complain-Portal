import { apiConnector } from "../apiConnector";
import { officialEndpoints } from "../api";
import toast from "react-hot-toast";
const {
    GET_ALL_OFFICIAL_COMPLAIN_API,
    UPDATE_COMPLAIN_API,
    UPDATE_LEAVE_STATUS_API,
    GET_OFFICIAL_PROFILE_API
} = officialEndpoints;

export const getAllOfficialComplain = async()=>{
    try{
        const response = await apiConnector("GET",
            GET_ALL_OFFICIAL_COMPLAIN_API,
            null,
            {
                Authorization : `Bearer ${localStorage.getItem("token")}`
            }
        )
        if(!response.data.success){
            throw new Error(response.data.message);
        }
        // console.log(response);
        return response.data.complain;
    }catch(err){
        console.log(err);
        toast.error(err.response?.data?.message || err.message || "failed to load complain");
        return null;
    }
}
export const updateComplainStatus = async(formData) =>{
    try{
        const response = await apiConnector("PUT",
            UPDATE_COMPLAIN_API,
            formData,
            {
                Authorization : `Bearer ${localStorage.getItem("token")}`
            }
        )
        if(!response.data.success){
            throw new Error(response.data.message);
        }
    }catch(err){
        console.log(err);
        toast.error(err.response?.data?.message || err.message || "Failed to update complain")
    }
}

export const getOfficialProfileApi = async () => {
    try {
        const response = await apiConnector("GET",
            GET_OFFICIAL_PROFILE_API,
            null,
            {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        );
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        return response.data.official;
    } catch (err) {
        console.log(err);
        toast.error(err.response?.data?.message || err.message || "Failed to fetch official profile");
        return null;
    }
}

export const updateLeaveStatusApi = async () => {
    const toastId = toast.loading("Updating leave status...");
    try {
        const response = await apiConnector("PUT",
            UPDATE_LEAVE_STATUS_API,
            null,
            {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        );
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        toast.success(response.data.message || "Leave status updated");
        return response.data;
    } catch (err) {
        console.log(err);
        toast.error(err.response?.data?.message || err.message || "Failed to update leave status");
        return null;
    } finally {
        toast.dismiss(toastId);
    }
}