import React, { useState, useEffect } from 'react';
import StudyGroupList from '../components/StudyGroupList';
import { useTheme } from '../../contexts/ThemeContext';
import { colors } from '../../contexts/ColorContext';

const StudyGroups = () => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const { isDark } = useTheme();
  const theme = isDark ? colors.dark : colors.light;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUserId(user.id || 4);
  }, []);

  if (!currentUserId) {
    return (
      <div className={`flex justify-center items-center h-64 ${theme.background}`}>
        <div className={theme.textSecondary}>Please login to view study groups</div>
      </div>
    );
  }

  return (
    <div className={`min-h-full ${t.pageBg} p-6`}>
      <button onClick={onBack}
        className="flex items-center gap-2 mb-5 px-3 py-1.5 rounded-xl border border-[#5478FF]/40 text-[#53CBF3] bg-[#5478FF]/10 hover:bg-[#5478FF]/20 text-sm font-semibold">
        <ArrowLeft size={15}/> Back
      </button>
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Users size={64} className={`${t.textMuted} opacity-30`}/>
        <p className={`font-black text-xl ${t.textPrimary} opacity-40`}>Study Groups</p>
        <p className={`text-sm ${t.textMuted} opacity-50`}>Study groups for {semester?.label} — coming soon</p>
      </div>
    </div>
  );
};

export default StudyGroups;