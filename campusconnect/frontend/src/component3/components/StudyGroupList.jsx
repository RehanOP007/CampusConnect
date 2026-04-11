import React, { useState, useEffect } from 'react';
//import { studyGroupApi } from '../utils/studyGroupApi';
import StudyGroupCard from './StudyGroupCard';
import CreateStudyGroup from './CreateStudyGroup';
import { useTheme } from '../../contexts/ThemeContext';
import { colors } from '../../contexts/ColorContext';

const StudyGroupList = ({ currentUserId }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { isDark } = useTheme();
  const theme = isDark ? colors.dark : colors.light;

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const data = await studyGroupApi.getAllGroups();
      setGroups(data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGroupCreated = () => {
    fetchGroups();
  };

  let filteredGroups = groups;
  if (filter === 'active') {
    filteredGroups = groups.filter(g => g.status === 'ACTIVE');
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className={`text-lg ${theme.textSecondary}`}>Loading study groups...</div>
      </div>
    );
  }

  return (
    <div className={theme.background}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <CreateStudyGroup 
            currentUserId={currentUserId} 
            onGroupCreated={handleGroupCreated}
          />
          
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded transition-all ${
                filter === 'all' 
                  ? theme.buttonPrimary 
                  : theme.buttonSecondary
              }`}
            >
              All Groups
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded transition-all ${
                filter === 'active' 
                  ? theme.buttonPrimary 
                  : theme.buttonSecondary
              }`}
            >
              Active Only
            </button>
          </div>
        </div>

        {filteredGroups.length === 0 ? (
          <div className={`text-center py-12 ${theme.cardBg} rounded-lg ${theme.border} border`}>
            <p className={theme.textSecondary}>No study groups found.</p>
            <p className={`${theme.text} text-sm mt-1`}>Click "Create New Study Group" to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map(group => (
              <StudyGroupCard
                key={group.groupId}
                group={group}
                currentUserId={currentUserId}
                onRefresh={fetchGroups}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyGroupList;