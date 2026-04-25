import api from "../../utils/axiosInstance";

/* =========================================================
   STUDY GROUP APIs
========================================================= */

// Create Study Group
export const createGroup = (data) => {
    return api.post("/api/groups/create", data);
};

// Update Study Group
export const updateGroup = (groupId, data) => {
    return api.put("/api/groups/update", data, {
        params: { id: groupId }
    });
};

// Get All Study Groups
export const getAllGroups = () => {
    return api.get("/api/groups/all");
};

// Get Group By ID
export const getGroupById = (groupId) => {
    return api.get("/api/groups/getById", {
        params: { id: groupId }
    });
};

export const getBySemester = (semesterId) => {
    return api.get("/api/groups/getBysemester", {
        params: { semesterId: semesterId }
    });
};

// Delete Study Group
export const deleteGroup = (groupId) => {
    return api.delete("/api/groups/delete", {
        params: { id: groupId }
    });
};

/* =========================================================
    GROUP MEMBER APIs
========================================================= */

// Join Group
export const joinGroup = (data) => {
    return api.post("/api/group-members/join", data);
};

// Leave Group
export const leaveGroup = (groupId, userId) => {
    return api.delete("/api/group-members/leave", {
        params: { groupId, userId }
    });
};

// Get Members of a Group
export const getGroupMembers = (groupId) => {
    return api.get("/api/group-members/getMembers", {
        params: { groupId }
    });
};


// Create Session
export const createSession = (data) => {
    return api.post("/api/sessions/create", data);
};

// Update Session
export const updateSession = (id, data) => {
    return api.put("/api/sessions/update", data, {
        params: { id }
    });
};

// Get All Sessions
export const getAllSessions = () => {
    return api.get("/api/sessions/all");
};

// Get Session By ID
export const getSessionById = (id) => {
    return api.get("/api/sessions/getById", {
        params: { id }
    });
};

// Get Sessions By Group
export const getSessionsByGroup = (groupId) => {
    return api.get("/api/sessions/getByGroup", {
        params: { groupId }
    });
};

// Delete Session
export const deleteSession = (id) => {
    return api.delete("/api/sessions/delete", {
        params: { id }
    });
};

// Mark Attendance
export const markAttendance = (data) => {
    return api.post("/api/session-attendance/mark", data);
};

// Remove Attendance
export const removeAttendance = (sessionId, userId) => {
    return api.delete("/api/session-attendance/remove", {
        params: { sessionId, userId }
    });
};

// Get By Session
export const getAttendanceBySession = (sessionId) => {
    return api.get("/api/session-attendance/getBySession", {
        params: { sessionId }
    });
};

// Get By User
export const getAttendanceByUser = (userId) => {
    return api.get("/api/session-attendance/getByUser", {
        params: { userId }
    });
};