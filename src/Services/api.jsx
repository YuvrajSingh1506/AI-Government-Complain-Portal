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
}