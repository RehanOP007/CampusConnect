import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { colors } from '../../contexts/ColorContext';
import { Calendar } from 'lucide-react';

const SessionAnalytics = ({ data }) => {
  const { isDark } = useTheme();
  const theme = isDark ? colors.dark : colors.light;

  const sessions = data?.sessions || [
    { name: 'Web Dev Meeting',     group: 'Web Dev Group',      date: '2026-03-25', time: '19:00', status: 'upcoming',  attendance: null },
    { name: 'Data Science Study',  group: 'Data Science Squad', date: '2026-03-24', time: '18:30', status: 'completed', attendance: 85   },
    { name: 'AI Discussion',       group: 'AI Research',        date: '2026-03-23', time: '17:00', status: 'completed', attendance: 92   },
    { name: 'Mobile Dev Workshop', group: 'Mobile Dev',         date: '2026-03-22', time: '15:00', status: 'completed', attendance: 78   },
    { name: 'Cloud Lab',           group: 'Cloud Computing',    date: '2026-03-26', time: '20:00', status: 'upcoming',  attendance: null },
  ];
  const daysData = data?.sessionsPerDay || [
    { day: 'Mon', count: 12 }, { day: 'Tue', count: 8  }, { day: 'Wed', count: 15 },
    { day: 'Thu', count: 10 }, { day: 'Fri', count: 14 }, { day: 'Sat', count: 5  }, { day: 'Sun', count: 2  },
  ];

  const total      = sessions.length;
  const upcoming   = sessions.filter(s => s.status === 'upcoming').length;
  const completed  = sessions.filter(s => s.status === 'completed').length;
  const withAtt    = sessions.filter(s => s.attendance != null);
  const avgAtt     = withAtt.length ? Math.round(withAtt.reduce((s, x) => s + x.attendance, 0) / withAtt.length) : 0;
  const peakHour   = data?.peakSessionHour || '19:00';
  const maxDay     = Math.max(...daysData.map(d => d.count));

  const STATS = [
    { label: 'Total',     value: total,     color: 'text-[#5478FF]',  bg: 'bg-[#5478FF]/10 border-[#5478FF]/20'  },
    { label: 'Upcoming',  value: upcoming,  color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/20'  },
    { label: 'Completed', value: completed, color: 'text-white/40',   bg: isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200' },
    { label: 'Avg Att.',  value: `${avgAtt}%`, color: 'text-[#A78BFA]', bg: 'bg-purple-500/10 border-purple-500/20' },
  ];

  return (
    <div className={`${theme.cardBg} rounded-2xl border ${theme.border} p-6 space-y-6`}>
      <h2 className={`text-lg font-black flex items-center gap-2 ${theme.text}`}>
        <Calendar size={18} className="text-[#5478FF]" /> Session Analytics
      </h2>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {STATS.map(s => (
          <div key={s.label} className={`text-center p-3 rounded-xl border ${s.bg}`}>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className={`text-[10px] font-semibold mt-0.5 ${theme.textSecondary}`}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Peak hour */}
      <div className={`p-4 rounded-xl border ${theme.border} bg-gradient-to-r ${isDark ? 'from-[#A78BFA]/10 to-[#5478FF]/10' : 'from-purple-50 to-blue-50'}`}>
        <p className={`text-xs font-semibold mb-2 ${theme.textSecondary}`}>🔥 Peak Session Time</p>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#A78BFA] to-[#5478FF] flex items-center justify-center text-white text-xl">⏰</div>
          <div>
            <p className="text-2xl font-black text-[#A78BFA]">{peakHour}</p>
            <p className={`text-xs ${theme.textSecondary}`}>Most sessions scheduled at this hour</p>
          </div>
        </div>
      </div>

      {/* Bar chart by day */}
      <div>
        <p className={`text-xs font-semibold mb-3 ${theme.textSecondary}`}>📅 Sessions per Day</p>
        <div className="flex items-end gap-1.5 h-24">
          {daysData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className={`text-[9px] font-bold ${theme.textSecondary}`}>{d.count}</span>
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-[#5478FF] to-[#53CBF3] transition-all duration-500 hover:from-[#53CBF3] hover:to-[#FFDE42]"
                style={{ height: `${Math.max(4, (d.count / maxDay) * 60)}px` }}
              />
              <span className={`text-[9px] font-semibold ${theme.textSecondary}`}>{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent sessions */}
      <div>
        <p className={`text-xs font-semibold mb-3 ${theme.textSecondary}`}>📋 Recent Sessions</p>
        <div className="space-y-2">
          {sessions.slice(0, 5).map((s, i) => (
            <div key={i}
              className={`flex justify-between items-center p-3 rounded-xl border ${theme.border} ${isDark ? 'bg-[#0D1235]' : 'bg-gray-50'}`}>
              <div>
                <p className={`font-semibold text-sm ${theme.text}`}>{s.name}</p>
                <p className={`text-xs ${theme.textSecondary}`}>{s.group}</p>
              </div>
              <div className="text-right">
                <p className={`text-xs font-semibold ${theme.text}`}>{s.time}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${s.status === 'upcoming'
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : isDark ? 'bg-white/5 text-white/30 border border-white/10' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                  {s.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SessionAnalytics;