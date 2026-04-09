import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { colors } from '../../contexts/ColorContext';
import { TrendingUp, Building2 } from 'lucide-react';

const UserAnalytics = ({ data }) => {
  const { isDark } = useTheme();
  const theme = isDark ? colors.dark : colors.light;
  const [timeRange, setTimeRange] = useState('weekly');

  const roleData  = data?.usersByRole  || [{ role: 'Admin', count: 5 }, { role: 'Student', count: 320 }, { role: 'Batch Rep', count: 48 }];
  const campusData = data?.usersPerCampus || [{ campus: 'Main Campus', count: 180 }, { campus: 'City Campus', count: 95 }, { campus: 'North Campus', count: 78 }];
  const batchData  = data?.usersPerBatch  || [{ batch: 'Batch A', count: 45 }, { batch: 'Batch B', count: 52 }, { batch: 'Batch C', count: 38 }, { batch: 'Batch D', count: 41 }];
  const weeklyData  = data?.userRegistrationTrend?.weekly  || [25, 32, 28, 45, 52, 48, 56];
  const monthlyData = data?.userRegistrationTrend?.monthly || [85, 102, 98, 125, 145, 168, 182, 195];

  const chartData = timeRange === 'weekly' ? weeklyData : monthlyData;
  const maxVal    = Math.max(...chartData);
  const labels    = timeRange === 'weekly' ? ['M','T','W','T','F','S','S'] : ['J','F','M','A','M','J','J','A'];

  const roleColors  = ['text-red-400', 'text-[#5478FF]', 'text-green-400'];
  const roleBgs     = ['bg-red-500/10 border-red-500/20', 'bg-[#5478FF]/10 border-[#5478FF]/20', 'bg-green-500/10 border-green-500/20'];
  const roleEmojis  = { Admin:'👑', Student:'🎓', 'Batch Rep':'👔' };
  const maxCampus   = Math.max(...campusData.map(c => c.count));
  const maxBatch    = Math.max(...batchData.map(b => b.count));

  return (
    <div className={`${theme.cardBg} rounded-2xl border ${theme.border} p-6 space-y-6`}>
      <h2 className={`text-lg font-black flex items-center gap-2 ${theme.text}`}>
        <TrendingUp size={18} className="text-[#5478FF]" /> User Analytics
      </h2>

      {/* Time range toggle */}
      <div className="flex gap-2">
        {['weekly', 'monthly'].map(r => (
          <button key={r} onClick={() => setTimeRange(r)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all capitalize ${timeRange === r ? 'bg-[#5478FF] text-white shadow-md shadow-[#5478FF]/30' : `${isDark ? 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}`}>
            {r}
          </button>
        ))}
      </div>

      {/* Bar chart */}
      <div>
        <p className={`text-xs font-semibold mb-3 ${theme.textSecondary}`}>Registrations Over Time</p>
        <div className="flex items-end gap-1.5 h-28">
          {chartData.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className={`text-[9px] font-bold ${theme.textSecondary}`}>{v}</span>
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-[#5478FF] to-[#53CBF3] transition-all duration-500 hover:from-[#53CBF3] hover:to-[#FFDE42]"
                style={{ height: `${Math.max(4, (v / maxVal) * 80)}px` }}
              />
              <span className={`text-[9px] ${theme.textSecondary}`}>{labels[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Users by role */}
      <div>
        <p className={`text-xs font-semibold mb-3 ${theme.textSecondary}`}>Users by Role</p>
        <div className="grid grid-cols-3 gap-3">
          {roleData.map((role, i) => (
            <div key={i} className={`text-center p-3 rounded-xl border ${roleBgs[i % roleBgs.length]}`}>
              <div className={`text-2xl mb-1`}>{roleEmojis[role.role] || '👤'}</div>
              <p className={`text-xl font-black ${roleColors[i % roleColors.length]}`}>{role.count}</p>
              <p className={`text-[10px] font-semibold mt-0.5 ${theme.textSecondary}`}>{role.role}s</p>
            </div>
          ))}
        </div>
      </div>

      {/* Campus distribution */}
      <div>
        <p className={`text-xs font-semibold mb-3 flex items-center gap-1.5 ${theme.textSecondary}`}>
          <Building2 size={12} /> Users per Campus
        </p>
        <div className="space-y-2.5">
          {campusData.map((c, i) => (
            <div key={i}>
              <div className="flex justify-between text-xs mb-1">
                <span className={`font-medium ${theme.text}`}>{c.campus}</span>
                <span className="text-[#53CBF3] font-bold">{c.count}</span>
              </div>
              <div className={`w-full h-1.5 rounded-full ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
                <div className="h-1.5 rounded-full bg-gradient-to-r from-[#5478FF] to-[#53CBF3] transition-all duration-700"
                  style={{ width: `${(c.count / maxCampus) * 100}%` }}/>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Per Batch */}
      <div>
        <p className={`text-xs font-semibold mb-3 ${theme.textSecondary}`}>🎓 Users per Batch</p>
        <div className="space-y-2">
          {batchData.map((b, i) => (
            <div key={i} className={`flex items-center justify-between p-2.5 rounded-xl ${isDark ? 'bg-[#0D1235]' : 'bg-gray-50'} border ${theme.border}`}>
              <span className={`font-semibold text-sm ${theme.text}`}>{b.batch}</span>
              <div className="flex items-center gap-2">
                <span className={`text-xs ${theme.textSecondary}`}>{b.count} students</span>
                <div className={`w-20 h-1.5 rounded-full ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
                  <div className="h-1.5 rounded-full bg-[#5478FF] transition-all duration-700" style={{ width: `${(b.count / maxBatch) * 100}%` }}/>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserAnalytics;