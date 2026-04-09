import api from "../../utils/axiosInstance";

// ================= CAMPUS =================
export const getAllCampus = () => {
  return api.get("/api/campus/all");
};

export const getCampusById = (campusId) => {
  return api.get(`/api/campus/getById?campusId=${campusId}`);
};

// ================= FACULTY =================
export const createFaculty = (data) => {
  return api.post("/api/faculties/create", data);
};

export const updateFaculty = (id, data) => {
  return api.put(`/api/faculties/update?id=${id}`, data);
};

export const getFaculty = (id) => {
  return api.get(`/api/faculties/get?id=${id}`);
};

export const getFacultyByCampus = (id) => {
  return api.get(`/api/faculties/getByCampus?id=${id}`);
};

export const getAllFaculties = () => {
  return api.get("/api/faculties/all");
};

export const deleteFaculty = (id) => {
  return api.delete(`/api/faculties/delete?id=${id}`);
};

// ================= PROGRAM =================
export const createProgram = (data) => {
  return api.post("/api/programs/create", data);
};

export const updateProgram = (programId, data) => {
  return api.put(`/api/programs/update?programId=${programId}`, data);
};

export const getProgram = (programId) => {
  return api.get(`/api/programs/get?programId=${programId}`);
};

export const getProgramsByFaculty = (facultyId) => {
  return api.get(`/api/programs/getByFaculty?facultyId=${facultyId}`);
};

export const getAllPrograms = () => {
  return api.get("/api/programs/all");
};

export const deleteProgram = (programId) => {
  return api.delete(`/api/programs/delete?programId=${programId}`);
};

// ================= BATCH =================
export const createBatch = (data) => {
  return api.post("/api/batches/create", data);
};

export const updateBatch = (batchId, data) => {
  return api.put(`/api/batches/update?batchId=${batchId}`, data);
};

export const getBatch = (batchId) => {
  return api.get(`/api/batches/get?batchId=${batchId}`);
};

export const getAllBatches = () => {
  return api.get("/api/batches/all");
};

export const getBatchByCurriculum = (curriculumId) => {
  return api.get(`/api/batches/getByCurriculum?curriculumId=${curriculumId}`);
};

export const deleteBatch = (batchId) => {
  return api.delete(`/api/batches/delete?batchId=${batchId}`);
};

// ================= SEMESTER =================
export const createSemester = (data) => {
  return api.post("/api/semesters/create", data);
};

export const updateSemester = (semesterId, data) => {
  return api.put(`/api/semesters/update?semesterId=${semesterId}`, data);
};

export const getSemester = (semesterId) => {
  return api.get(`/api/semesters/get?semesterId=${semesterId}`);
};

export const getAllSemesters = () => {
  return api.get("/api/semesters/all");
};

export const getSemesterByBatch = (batchId) => {
  return api.get(`/api/semesters/getByBatch?batchId=${batchId}`);
};

export const deleteSemester = (semesterId) => {
  return api.delete(`/api/semesters/delete?semesterId=${semesterId}`);
};

// ================= CURRICULUM =================
export const createCurriculum = (data) => {
  return api.post("/api/curriculums/create", data);
};

export const updateCurriculum = (curriculumId, data) => {
  return api.put(`/api/curriculums/update?curriculumId=${curriculumId}`, data);
};

export const getCurriculum = (curriculumId) => {
  return api.get(`/api/curriculums/get?curriculumId=${curriculumId}`);
};

export const getAllCurriculum = () => {
  return api.get("/api/curriculums/all");
};

export const getCurriculumByProgram = (programId) => {
  return api.get(`/api/curriculums/getByProgram?programId=${programId}`);
};

export const deleteCurriculum = (curriculumId) => {
  return api.delete(`/api/curriculums/delete?curriculumId=${curriculumId}`);
};

// ================= SUBJECT =================
export const createSubject = (data) => {
  return api.post("/api/subjects/create", data);
};

export const updateSubject = (subjectId, data) => {
  return api.put(`/api/subjects/update?subjectId=${subjectId}`, data);
};

export const getSubjectById = (subjectId) => {
  return api.get(`/api/subjects/get?subjectId=${subjectId}`);
};

export const getAllSubjects = () => {
  return api.get("/api/subjects/all");
};

export const getSubjectsBySemester = (semesterId) => {
  return api.get(`/api/subjects/getBySemester?semesterId=${semesterId}`);
};

export const deleteSubject = (subjectId) => {
  return api.delete(`/api/subjects/delete?subjectId=${subjectId}`);
};

// ================= RESOURCE =================
export const createResource = (data) => {
  return api.post("/api/resources/create", data);
};

export const updateResource = (id, data) => {
  return api.put(`/api/resources/update?resourceId=${id}`, data);
};

export const getResourceById = (id) => {
  return api.get(`/api/resources/get?resourceId=${id}`);
};

export const getAllResources = () => {
  return api.get("/api/resources/all");
};

export const getResourcesBySubject = (subjectId) => {
  return api.get(`/api/resources/getBySubject?subjectId=${subjectId}`);
};

export const deleteResource = (id) => {
  return api.delete(`/api/resources/delete?resourceId=${id}`);
};