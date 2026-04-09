import api from "../../utils/axiosInstance"

export const createUser = (data) => {
    return api.post(`/api/users/create`, data);
}
export const updateUser = (userId, data) => {
    return api.post(`/api/users/update?userId=${userId}`, data);
}
export const getAllUsers = () => {
    return api.get(`/api/users/all`);
}
export const getUserById = (userId) => {
    return api.get(`/api/users/get?userId=${userId}`);
}
export const deleteUser = (userId) => {
    return api.delete(`/api/users/delete?userId=${userId}`);
}

export const getAllRoles = () => {
    return api.get(`/api/roles/all`);
}


export const getPendingBatchRepRequests = () => {
    return api.get("/api/admin/batchrep/requests");
}
export const approveBatchRepRequest = (requestId) =>{
    return api.put(`/api/admin/batchrep/approve?requestId=${requestId}`);
}
export const rejectBatchRepRequest = (requestId) =>{
    return api.put(`/api/admin/batchrep/reject?requestId=${requestId}`); 
}


export const createResource = (data) => {
    return api.post("/api/resources/create", data);
}
export const updateResource = (id, data) => {
    return api.put(`/api/resources/update?resourseId=${id}`, data);
}
export const getResourceById = (id) => {
    return api.get(`/api/resources/get?resourseId=${id}`);
}
export const getAllResource = () => {
    return api.get(`/api/resources/all`);
}
export const getResourceBySubject = (id) => {
    return api.get(`/api/resources/getBySubject?subjectId=${id}`);
}
export const deleteResource = (id) => {
    return api.delete(`/api/resources/delete?resourceId=${id}`);
}
