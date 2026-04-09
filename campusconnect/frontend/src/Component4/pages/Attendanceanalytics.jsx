import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { colors } from '../../contexts/ColorContext';
import { CheckCircle, AlertTriangle } from 'lucide-react';

const AttendanceAnalytics = ({ data }) => {
  const { isDark } = useTheme();
  const theme = isDark ? colors.dark : colors.light;

  const attendanceData = data?.attendance || { averageRate: 78, totalRecords: 245, sessionsWithAttendance: 66 };
  const studentData    = data?.studentAttendance || [
    { name: 'John Doe',       attendance: 95, sessions: 12, status: 'active'   },
    { name: 'Jane Smith',     attendance: 88, sessions: 10, status: 'active'   },
    { name: 'Mike Johnson',   attendance: 92, sessions: 11, status: 'active'   },
    { name: 'Sarah Williams', attendance: 45, sessions: 6,  status: 'inactive' },
    { name: 'David Brown',    attendance: 35, sessions: 4,  status: 'inactive' },
    { name: 'Emily Chen',     attendance: 98, sessions: 14, status: 'active'   },
    { name: 'Robert Lee',     attendance: 72, sessions: 8,  status: 'active'   },
    { name: 'Lisa Wong',      attendance: 28, sessions: 3,  status: 'inactive' },
  ];

  const mostActive  = [...studentData].sort((a, b) => b.attendance - a.attendance).slice(0, 3);
  const leastActive = [...studentData].sort((a, b) => a.attendance - b.attendance).slice(0, 3);

  const rate    = attendanceData.averageRate || 0;
  const isGood  = rate >= 75;
  const rateColor = rate >= 80 ? 'text-green-400' : rate >= 60 ? 'text-amber-400' : 'text-red-400';

  const STATS = [
    { label: 'Average Rate',      value: `${rate}%`,               color: rateColor,         bg: isGood ? 'bg-green-500/10 border-green-500/20' : 'bg-amber-500/10 border-amber-500/20' },
    { label: 'Total Records',     value: attendanceData.totalRecords, color: 'text-[#5478FF]', bg: 'bg-[#5478FF]/10 border-[#5478FF]/20' },
    { label: 'Sessions Tracked',  value: attendanceData.sessionsWithAttendance, color: 'text-[#A78BFA]', bg: 'bg-purple-500/10 border-purple-500/20' },
  ];

  return (
    <div className={`${theme.cardBg} rounded-2xl border ${theme.border} p-6 space-y-6`}>
      <h2 className={`text-lg font-black flex items-center gap-2 ${theme.text}`}>
        <CheckCircle size={18} className="text-[#5478FF]" /> Attendance Analytics
      </h2>

      {/* Main stats */}
      <div className="grid grid-cols-3 gap-3">
        {STATS.map(s => (
          <div key={s.label} className={`text-center p-4 rounded-xl border ${s.bg}`}>
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            <p className={`text-[10px] font-semibold mt-1 ${theme.textSecondary}`}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between mb-2">
          <span className={`text-xs font-semibold ${theme.text}`}>Overall Attendance Rate</span>
          <span className={`text-xs font-bold ${rateColor}`}>{rate}%</span>
        </div>
        <div className={`w-full h-3 rounded-full ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
          <div
            className={`h-3 rounded-full transition-all duration-700 ${isGood ? 'bg-gradient-to-r from-green-500 to-[#53CBF3]' : 'bg-gradient-to-r from-amber-500 to-orange-500'}`}
            style={{ width: `${rate}%` }}
          />
        </div>
        <p className={`text-xs mt-1.5 flex items-center gap-1 ${isGood ? 'text-green-400' : 'text-amber-400'}`}>
          {isGood ? <CheckCircle size={11}/> : <AlertTriangle size={11}/>}
          {isGood ? 'Good attendance rate' : 'Needs improvement'}
        </p>
      </div>

      {/* Most active */}
      <div>
        <p className={`text-xs font-semibold mb-3 flex items-center gap-1.5 ${theme.textSecondary}`}>
          🏆 Most Active Students
        </p>
        <div className="space-y-2">
          {mostActive.map((u, i) => (
            <div key={i} className={`flex justify-between items-center p-3 rounded-xl border border-green-500/20 ${isDark ? 'bg-green-500/5' : 'bg-green-50'}`}>
              <div className="flex items-center gap-2">
                <span className="text-base">{['🥇','🥈','🥉'][i]}</span>
                <span className={`font-semibold text-sm ${theme.text}`}>{u.name}</span>
              </div>
              <div className="text-right">
                <span className="text-green-400 font-black text-sm">{u.attendance}%</span>
                <span className={`text-[10px] ml-2 ${theme.textSecondary}`}>({u.sessions} sessions)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Needs improvement */}
      <div>
        <p className={`text-xs font-semibold mb-3 flex items-center gap-1.5 ${theme.textSecondary}`}>
          <AlertTriangle size={11} className="text-amber-400"/> Needs Improvement
        </p>
        <div className="space-y-2">
          {leastActive.map((u, i) => (
            <div key={i} className={`flex justify-between items-center p-3 rounded-xl border border-red-500/20 ${isDark ? 'bg-red-500/5' : 'bg-red-50'}`}>
              <span className={`font-semibold text-sm ${theme.text}`}>{u.name}</span>
              <div className="text-right">
                <span className="text-red-400 font-black text-sm">{u.attendance}%</span>
                <span className={`text-[10px] ml-2 ${theme.textSecondary}`}>({u.sessions} sessions)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttendanceAnalytics;