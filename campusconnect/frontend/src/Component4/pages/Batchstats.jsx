// Component 4: Batch Statistics - Displays student count and rep distribution
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { colors } from '../../contexts/ColorContext';
import { BarChart2 } from 'lucide-react';

const BatchStats = ({ data }) => {
  const { isDark } = useTheme();
  const theme = isDark ? colors.dark : colors.light;

  if (!data || data.length === 0) {
    return (
      <div className={`${theme.cardBg} rounded-2xl border ${theme.border} p-6`}>
        <h2 className={`text-lg font-black mb-4 flex items-center gap-2 ${theme.text}`}>
          <BarChart2 size={18} className="text-[#5478FF]" /> Batch Statistics
        </h2>
        <p className={`text-center py-8 ${theme.textSecondary}`}>No batch data available</p>
      </div>
    );
  }

  const maxStudents = Math.max(...data.map(b => b.studentCount || 0));

  return (
    <div className={`${theme.cardBg} rounded-2xl border ${theme.border} p-6`}>
      <h2 className={`text-lg font-black mb-5 flex items-center gap-2 ${theme.text}`}>
        <BarChart2 size={18} className="text-[#5478FF]" /> Batch Statistics
      </h2>
      <div className="space-y-5">
        {data.map((batch, index) => {
          const pct = batch.percentage || 0;
          const repFull = (batch.representativeCount || 0) >= 4;
          return (
            <div key={index} className={`p-4 rounded-xl border ${theme.border} ${isDark ? 'bg-[#0D1235]' : 'bg-gray-50'}`}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className={`font-bold text-sm ${theme.text}`}>{batch.batchName || `Batch ${index + 1}`}</span>
                  <p className={`text-xs mt-0.5 ${theme.textSecondary}`}>
                    {batch.startDate || 'N/A'} — {batch.endDate || 'Present'}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${repFull ? 'bg-green-500/15 text-green-400 border border-green-500/30' : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'}`}>
                    {batch.representativeCount || 0}/4 Reps
                  </span>
                </div>
              </div>
              {/* Bar */}
              <div className={`w-full h-2 rounded-full ${isDark ? 'bg-white/10' : 'bg-gray-200'} mb-2`}>
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-[#5478FF] to-[#53CBF3] transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="flex justify-between text-xs">
                <span className={theme.textSecondary}>👥 {batch.studentCount || 0} students</span>
                <span className="text-[#53CBF3] font-bold">{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BatchStats;