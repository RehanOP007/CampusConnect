// Component 4: Faculty Statistics - Displays faculty-wise program and student counts
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { colors } from '../../contexts/ColorContext';
import { GraduationCap } from 'lucide-react';

const ACCENTS = ['from-[#5478FF] to-[#53CBF3]', 'from-[#A78BFA] to-[#5478FF]', 'from-[#53CBF3] to-[#34D399]', 'from-[#FFDE42] to-[#FB923C]'];

const FacultyStats = ({ data }) => {
  const { isDark } = useTheme();
  const theme = isDark ? colors.dark : colors.light;

  if (!data || data.length === 0) {
    return (
      <div className={`${theme.cardBg} rounded-2xl border ${theme.border} p-6`}>
        <h2 className={`text-lg font-black mb-4 flex items-center gap-2 ${theme.text}`}>
          <GraduationCap size={18} className="text-[#5478FF]" /> Faculty Statistics
        </h2>
        <p className={`text-center py-8 ${theme.textSecondary}`}>No faculty data available</p>
      </div>
    );
  }

  const maxCount = Math.max(...data.map(f => f.studentCount || 0));

  return (
    <div className={`${theme.cardBg} rounded-2xl border ${theme.border} p-6`}>
      <h2 className={`text-lg font-black mb-5 flex items-center gap-2 ${theme.text}`}>
        <GraduationCap size={18} className="text-[#5478FF]" /> Faculty Statistics
      </h2>
      <div className="space-y-3">
        {data.map((faculty, index) => {
          const pct = maxCount > 0 ? Math.round((faculty.studentCount / maxCount) * 100) : 0;
          const accent = ACCENTS[index % ACCENTS.length];
          return (
            <div key={index}
              className={`flex items-center gap-4 p-4 rounded-xl border ${theme.border} ${isDark ? 'bg-[#0D1235] hover:bg-[#5478FF]/5' : 'bg-gray-50 hover:bg-blue-50/60'} transition-colors`}>
              {/* Gradient dot */}
              <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${accent} flex items-center justify-center shrink-0 shadow-sm`}>
                <span className="text-white font-black text-xs">{(faculty.name || '?').charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1.5">
                  <span className={`font-bold text-sm truncate ${theme.text}`}>{faculty.name || `Faculty ${index + 1}`}</span>
                  <span className={`text-lg font-black text-[#5478FF] ml-2 shrink-0`}>{faculty.studentCount || 0}</span>
                </div>
                <div className={`w-full h-1.5 rounded-full ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
                  <div className={`h-1.5 rounded-full bg-gradient-to-r ${accent} transition-all duration-700`} style={{ width: `${pct}%` }}/>
                </div>
                <p className={`text-xs mt-1 ${theme.textSecondary}`}>{faculty.programCount || 0} programs</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FacultyStats;


//component 4 : faculty stats - developed by kavindu