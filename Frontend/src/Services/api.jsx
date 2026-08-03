const BASE_URL = "http://localhost:4000/api/v1/"

export const endpoints = {
    SIGNUP_API : `${BASE_URL}auth/signup`,
    LOGIN_API : `${BASE_URL}auth/login`
}
export const complainEndpoints = {
    CREATE_COMPLAIN_API : `${BASE_URL}complain/createComplain`,
    GET_USER_COMPLAIN_API : `${BASE_URL}complain/myComplains`,
    GET_COMPLAIN_API : `${BASE_URL}complain/getComplainDetails`,
    DELETE_COMPLAIN_API : `${BASE_URL}complain/deleteMyComplains`,
    GET_ALL_COMPLAIN_API : `${BASE_URL}complain/getAllComplains`,
    GET_DASHBOARD_DATA_API : `${BASE_URL}complain/getDashboardData`,
    ASSIGN_COMPLAIN_API : `${BASE_URL}complain/assignComplain`,
    REJECT_COMPLAIN_API : `${BASE_URL}complain/rejectComplain`
}
export const departmentEndpoints = {
    GET_ALL_DEPARTMENT_API : `${BASE_URL}dept/getAllDepartment`
}
export const officialEndpoints = {
    GET_ALL_OFFICIAL_COMPLAIN_API : `${BASE_URL}complain/getAssignedComplain`,
    UPDATE_COMPLAIN_API : `${BASE_URL}complain/updateComplainStatus`,
    UPDATE_LEAVE_STATUS_API : `${BASE_URL}complain/updateLeaveStatus`,
    GET_OFFICIAL_PROFILE_API : `${BASE_URL}complain/officialProfile`
}