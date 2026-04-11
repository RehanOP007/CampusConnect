import React, { useState } from 'react';
//import { studyGroupApi } from '../utils/studyGroupApi';
import { useTheme } from '../../contexts/ThemeContext';
import { colors } from '../../contexts/ColorContext';

const CreateStudyGroup = ({ currentUserId, onGroupCreated }) => {
  const [formData, setFormData] = useState({
    groupName: '',
    status: 'ACTIVE',
    subjectId: '',
    semesterId: '',
    createdByUserId: currentUserId
  });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { isDark } = useTheme();
  const theme = isDark ? colors.dark : colors.light;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await studyGroupApi.createGroup({
        ...formData,
        subjectId: parseInt(formData.subjectId),
        semesterId: parseInt(formData.semesterId)
      });
      alert('Study group created successfully!');
      setFormData({
        groupName: '',
        status: 'ACTIVE',
        subjectId: '',
        semesterId: '',
        createdByUserId: currentUserId
      });
      setShowForm(false);
      onGroupCreated();
    } catch (error) {
      alert('Failed to create study group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className={theme.buttonPrimary}
        >
          <span className="text-xl mr-1">+</span> Create New Study Group
        </button>
      ) : (
        <div className={`${theme.cardBg} rounded-lg shadow p-6 ${theme.border} border`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-xl font-bold ${theme.text}`}>Create New Study Group</h3>
            <button
              onClick={() => setShowForm(false)}
              className={`${theme.textSecondary} hover:${theme.text} text-xl`}
            >
              ✕
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme.text}`}>Group Name *</label>
                <input
                  type="text"
                  name="groupName"
                  value={formData.groupName}
                  onChange={handleChange}
                  required
                  className={`w-full ${theme.inputBg} ${theme.text} border ${theme.border} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5478FF]`}
                  placeholder="e.g., DSA Study Group"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme.text}`}>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={`w-full ${theme.inputBg} ${theme.text} border ${theme.border} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5478FF]`}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme.text}`}>Subject ID *</label>
                <input
                  type="number"
                  name="subjectId"
                  value={formData.subjectId}
                  onChange={handleChange}
                  required
                  className={`w-full ${theme.inputBg} ${theme.text} border ${theme.border} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5478FF]`}
                  placeholder="Enter subject ID"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme.text}`}>Semester ID *</label>
                <input
                  type="number"
                  name="semesterId"
                  value={formData.semesterId}
                  onChange={handleChange}
                  required
                  className={`w-full ${theme.inputBg} ${theme.text} border ${theme.border} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5478FF]`}
                  placeholder="Enter semester ID"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`mt-4 ${theme.buttonPrimary} disabled:opacity-50`}
            >
              {loading ? 'Creating...' : 'Create Group'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreateStudyGroup;