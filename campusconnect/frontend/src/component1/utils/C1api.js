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

export const verifyEmailToken = (token) => {
  return axios.get(`/auth/verify-email?token=${token}`);
};


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

// Create or Update Rating
export const createOrUpdateRating = (data) => {
    return api.post("/api/ratings", data);
};

// Get Rating by ID
export const getRatingById = (id) => {
    return api.get(`/api/ratings/${id}`);
};

// Get Ratings by Entity (SUBJECT, RESOURCE, SESSION, GROUP)
export const getRatingsByEntity = (entityType, entityId) => {
    return api.get("/api/ratings/entity", {
        params: { entityType, entityId }
    });
};

// Get Ratings by User
export const getRatingsByUser = (userId) => {
    return api.get(`/api/ratings/user/${userId}`);
};

// Get All Ratings
export const getAllRatings = () => {
    return api.get("/api/ratings");
};

// Delete Rating
export const deleteRating = (id) => {
    return api.delete(`/api/ratings/${id}`);
};

// ─── FEEDBACK API — add this block to c1.api.js ────────────────────────────
// Import this alongside userAPI, bookingAPI, ticketAPI

// Create Feedback
export const createFeedback = (data) => {
    return api.post("/api/feedbacks", data);
};

// Update Feedback
export const updateFeedback = (feedbackId, data) => {
    return api.put(`/api/feedbacks/${feedbackId}`, data);
};

// Delete Feedback
export const deleteFeedback = (feedbackId) => {
    return api.delete(`/api/feedbacks/${feedbackId}`);
};

// Get Feedback by ID
export const getFeedbackById = (feedbackId) => {
    return api.get(`/api/feedbacks/${feedbackId}`);
};

// Get Feedback by User
export const getFeedbackByUser = (userId) => {
    return api.get(`/api/feedbacks/user/${userId}`);
};

// Get Feedback by Session
export const getFeedbackBySession = (sessionId) => {
    return api.get(`/api/feedbacks/session/${sessionId}`);
};

// Get All Feedbacks (ADMIN)
export const getAllFeedbacks = () => {
    return api.get("/api/feedbacks");
};

// Filter by Faculty
export const getFeedbackByFaculty = (faculty) => {
    return api.get(`/api/feedbacks/faculty/${faculty}`);
};

// Filter by Program
export const getFeedbackByProgram = (program) => {
    return api.get(`/api/feedbacks/program/${program}`);
};

// Filter by Program + Year
export const getFeedbackByProgramYear = (program, year) => {
    return api.get(`/api/feedbacks/program/${program}/year/${year}`);
};

// Filter by Program + Year + Semester
export const getFeedbackByProgramYearSemester = (program, year, semester) => {
    return api.get(`/api/feedbacks/program/${program}/year/${year}/semester/${semester}`);
};


