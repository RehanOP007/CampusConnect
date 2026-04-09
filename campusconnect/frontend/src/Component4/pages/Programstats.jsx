import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { colors } from '../../contexts/ColorContext';
import { BookOpen } from 'lucide-react';

const ProgramStats = ({ data }) => {
  const { isDark } = useTheme();
  const theme = isDark ? colors.dark : colors.light;

  if (!data || data.length === 0) {
    return (
      <div className={`${theme.cardBg} rounded-2xl border ${theme.border} p-6`}>
        <h2 className={`text-lg font-black mb-4 flex items-center gap-2 ${theme.text}`}>
          <BookOpen size={18} className="text-[#5478FF]" /> Program Statistics
        </h2>
        <p className={`text-center py-8 ${theme.textSecondary}`}>No program data available</p>
      </div>
    );
  }

  const maxStudents = Math.max(...data.map(p => p.studentCount || 0));

  return (
    <div className={`${theme.cardBg} rounded-2xl border ${theme.border} p-6`}>
      <h2 className={`text-lg font-black mb-5 flex items-center gap-2 ${theme.text}`}>
        <BookOpen size={18} className="text-[#5478FF]" /> Program Statistics
      </h2>
      <div className="space-y-3">
        {data.map((program, index) => {
          const pct = maxStudents > 0 ? Math.round((program.studentCount / maxStudents) * 100) : 0;
          return (
            <div key={index} className={`p-4 rounded-xl border ${theme.border} ${isDark ? 'bg-[#0D1235]' : 'bg-gray-50'}`}>
              <div className="flex justify-between items-center mb-2">
                <span className={`font-bold text-sm ${theme.text}`}>{program.programName || `Program ${index + 1}`}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${program.isActive ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}>
                  {program.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className={`w-full h-1.5 rounded-full ${isDark ? 'bg-white/10' : 'bg-gray-200'} mb-2`}>
                <div
                  className="h-1.5 rounded-full bg-gradient-to-r from-[#5478FF] to-[#A78BFA] transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="flex justify-between text-xs">
                <span className={theme.textSecondary}>📦 {program.batchCount || 0} batches</span>
                <span className={theme.textSecondary}>👥 {program.studentCount || 0} students</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgramStats;