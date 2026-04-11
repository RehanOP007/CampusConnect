import React, { useState, useEffect } from 'react';
//import { studyGroupApi } from '../utils/studyGroupApi';
import { useTheme } from '../../contexts/ThemeContext';
import { colors } from '../../contexts/ColorContext';

const StudyGroupCard = ({ group, currentUserId, onRefresh }) => {
  const [members, setMembers] = useState([]);
  const [showMembers, setShowMembers] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isDark } = useTheme();
  const theme = isDark ? colors.dark : colors.light;

  useEffect(() => {
    fetchMembers();
  }, [group.groupId]);

  const fetchMembers = async () => {
    try {
      const data = await studyGroupApi.getGroupMembers(group.groupId);
      setMembers(data);
      setIsJoined(data.some(m => m.userId === currentUserId));
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleJoin = async () => {
    setLoading(true);
    try {
      await studyGroupApi.joinGroup(group.groupId, currentUserId);
      await fetchMembers();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to join group');
    } finally {
      setLoading(false);
    }
  };

  const handleLeave = async () => {
    setLoading(true);
    try {
      await studyGroupApi.leaveGroup(group.groupId, currentUserId);
      await fetchMembers();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to leave group');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      try {
        await studyGroupApi.deleteGroup(group.groupId);
        onRefresh();
      } catch (error) {
        alert('Failed to delete group');
      }
    }
  };

  const isCreator = group.createdByUserId === currentUserId;
  const memberCount = members.length;

  return (
    <div className={`${theme.cardBg} rounded-lg shadow-md p-5 hover:shadow-lg transition-all ${theme.border} border`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className={`text-xl font-bold ${theme.text}`}>{group.groupName}</h3>
          <div className="flex gap-2 mt-1 flex-wrap">
            <span className={`text-xs ${theme.accentBg} ${isDark ? 'text-[#0A0F2C]' : 'text-[#111FA2]'} px-2 py-1 rounded font-medium`}>
              Subject ID: {group.subjectId}
            </span>
            <span className={`text-xs ${theme.buttonSecondary} px-2 py-1 rounded`}>
              Semester: {group.semesterId}
            </span>
            <span className={`text-xs px-2 py-1 rounded ${
              group.status === 'ACTIVE' 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
            }`}>
              {group.status}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-2xl font-bold ${theme.textSecondary}`}>{memberCount}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Members</p>
        </div>
      </div>

      {/* Meta Info */}
      <div className={`text-sm ${theme.textSecondary} mb-3`}>
        <p>Created: {new Date(group.createdAt).toLocaleDateString()}</p>
        {isCreator && <p className={`${theme.accent} text-xs mt-1`}>✨ You are the creator</p>}
      </div>

      {/* Member List Toggle */}
      <button
        onClick={() => setShowMembers(!showMembers)}
        className={`text-sm ${theme.link} mb-2`}
      >
        {showMembers ? '▼ Hide Members' : '▶ Show Members'}
      </button>

      {showMembers && (
        <div className={`${theme.inputBg} rounded p-3 mb-3 max-h-32 overflow-y-auto ${theme.border} border`}>
          {members.length === 0 ? (
            <p className={`text-sm ${theme.textSecondary}`}>No members yet</p>
          ) : (
            members.map(member => (
              <div key={member.userId} className="flex justify-between items-center text-sm py-1">
                <span>👤 User #{member.userId}</span>
                <span className="text-xs text-gray-400">
                  Joined: {new Date(member.joinedAt).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 mt-3">
        {!isJoined ? (
          <button
            onClick={handleJoin}
            disabled={loading}
            className={`flex-1 ${theme.buttonPrimary} disabled:opacity-50`}
          >
            {loading ? 'Joining...' : '+ Join Group'}
          </button>
        ) : (
          <button
            onClick={handleLeave}
            disabled={loading}
            className={`flex-1 ${theme.buttonSecondary} border ${theme.border} py-2 rounded transition disabled:opacity-50`}
          >
            {loading ? 'Leaving...' : '🚪 Leave Group'}
          </button>
        )}
        
        {isCreator && (
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
          >
            🗑️ Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default StudyGroupCard;