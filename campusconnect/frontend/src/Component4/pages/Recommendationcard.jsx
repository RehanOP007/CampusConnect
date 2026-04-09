import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { colors } from '../../contexts/ColorContext';
import { Users, ArrowRight } from 'lucide-react';

const RecommendationCard = ({ recommendation }) => {
  const { isDark } = useTheme();
  const theme = isDark ? colors.dark : colors.light;

  const score = recommendation?.matchScore || 0;
  const matchColor = score >= 85
    ? 'bg-green-500/10 text-green-400 border-green-500/30'
    : score >= 70
    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
    : 'bg-orange-500/10 text-orange-400 border-orange-500/30';

  // Bar color based on score
  const barColor = score >= 85 ? 'from-green-500 to-[#53CBF3]' : score >= 70 ? 'from-amber-500 to-[#FFDE42]' : 'from-orange-500 to-red-500';

  return (
    <div className={`${theme.cardBg} rounded-2xl border ${theme.border} p-5 hover:shadow-xl hover:shadow-[#5478FF]/10 hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden`}>
      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${barColor}`}/>

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className={`font-black text-base leading-tight ${theme.text}`}>
            {recommendation?.programName || 'Program Name'}
          </h3>
          <p className={`text-xs mt-1 ${theme.textSecondary}`}>{recommendation?.faculty || 'Faculty'}</p>
        </div>
        <span className={`text-[10px] px-2 py-1 rounded-full border font-bold shrink-0 ${matchColor}`}>
          {score}% match
        </span>
      </div>

      {/* Match bar */}
      <div className={`w-full h-1.5 rounded-full ${isDark ? 'bg-white/10' : 'bg-gray-200'} mb-4`}>
        <div className={`h-1.5 rounded-full bg-gradient-to-r ${barColor} transition-all duration-700`} style={{ width: `${score}%` }}/>
      </div>

      {/* Description */}
      <p className={`text-sm leading-relaxed mb-4 ${theme.textSecondary}`}>
        {recommendation?.description || 'No description available'}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-1.5 text-xs ${theme.textSecondary}`}>
          <Users size={12}/>
          <span>{recommendation?.enrolledStudents || 0} students enrolled</span>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#5478FF] to-[#53CBF3] text-white text-xs font-bold hover:opacity-90 transition-opacity shadow-sm shadow-[#5478FF]/30">
          View Details <ArrowRight size={11}/>
        </button>
      </div>
    </div>
  );
};

export default RecommendationCard;