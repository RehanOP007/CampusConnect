import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/axiosInstance";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem("auth");
    const token  = localStorage.getItem("token");

    if (stored) return JSON.parse(stored);
    if (token)  return { token };

    return null;
  });

  const [loading, setLoading] = useState(false);

  /* ── Persist auth to localStorage ── */
  useEffect(() => {
    if (auth) {
      localStorage.setItem("auth",  JSON.stringify(auth));
      if (auth.token) localStorage.setItem("token", auth.token);
    } else {
      localStorage.removeItem("auth");
      localStorage.removeItem("token");
    }
  }, [auth]);

  /* ── Login ── */
  const login = async (username, password) => {
    const res  = await api.post("/api/auth/login", { username, password });
    const data = res.data;

    const userData = {
      token:     data.token,
      userId:    data.userId,
      username:  data.username,
      email:     data.email,
      role:      data.role,
      status:    data.status,
      campusId:  data.campusId,
      facultyId: data.facultyId,   
      programId: data.programId,
      batchId:   data.batchId,
      semesterId:data.semesterId,
    };

    setAuth(userData);
    return userData;
  };

  /* ── Logout ── */
  const logout = () => setAuth(null);

  return (
    <AuthContext.Provider
      value={{
        user:       auth,
        token:      auth?.token,
        role:       auth?.role,
        status:     auth?.status,
        userId:     auth?.userId,
        username:   auth?.username,
        email:      auth?.email,
        campusId:   auth?.campusId,
        facultyId:  auth?.facultyId,
        programId:  auth?.programId,
        batchId:    auth?.batchId,
        semesterId: auth?.semesterId,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};