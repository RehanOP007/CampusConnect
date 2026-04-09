import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { colors } from '../../contexts/ColorContext';
import { Users, BookOpen } from 'lucide-react';

const StudyGroupAnalytics = ({ data }) => {
  const { isDark } = useTheme();
  const theme = isDark ? colors.dark : colors.light;

  const groups = data?.studyGroups || [
    { name: 'Web Dev Group',      subject: 'Web Development',        semester: 3, members: 12, sessions: 8,  active: true  },
    { name: 'Data Science Squad', subject: 'Data Science',           semester: 4, members: 8,  sessions: 12, active: true  },
    { name: 'AI Research',        subject: 'Artificial Intelligence', semester: 4, members: 6,  sessions: 10, active: true  },
    { name: 'Mobile Dev',         subject: 'Mobile Development',     semester: 2, members: 5,  sessions: 4,  active: false },
    { name: 'Cloud Computing',    subject: 'Cloud',                  semester: 3, members: 9,  sessions: 7,  active: true  },
  ];

  const activeGroups  = groups.filter(g => g.active).length;
  const totalGroups   = groups.length;
  const totalMembers  = groups.reduce((s, g) => s + g.members, 0);
  const totalSessions = groups.reduce((s, g) => s + g.sessions, 0);

  const subjects  = {};
  const semesters = {};
  groups.forEach(g => {
    subjects[g.subject]   = (subjects[g.subject]   || 0) + 1;
    semesters[g.semester] = (semesters[g.semester] || 0) + 1;
  });

  const topGroups = [...groups].sort((a, b) => b.members - a.members).slice(0, 3);

  const STAT_CARDS = [
    { label: 'Total',    value: totalGroups,  color: 'text-[#5478FF]',  bg: 'bg-[#5478FF]/10 border-[#5478FF]/20'  },
    { label: 'Active',   value: activeGroups, color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/20'  },
    { label: 'Members',  value: totalMembers, color: 'text-[#53CBF3]',  bg: 'bg-[#53CBF3]/10 border-[#53CBF3]/20'  },
    { label: 'Sessions', value: totalSessions,color: 'text-amber-400',  bg: 'bg-amber-500/10 border-amber-500/20'  },
  ];

  const semColors = ['from-[#5478FF] to-[#53CBF3]', 'from-[#A78BFA] to-[#5478FF]', 'from-[#53CBF3] to-[#34D399]', 'from-[#FFDE42] to-[#FB923C]'];

  return (
    <div className={`${theme.cardBg} rounded-2xl border ${theme.border} p-6 space-y-6`}>
      <h2 className={`text-lg font-black flex items-center gap-2 ${theme.text}`}>
        <BookOpen size={18} className="text-[#5478FF]" /> Study Group Analytics
      </h2>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {STAT_CARDS.map(s => (
          <div key={s.label} className={`text-center p-3 rounded-xl border ${s.bg}`}>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className={`text-[10px] font-semibold mt-0.5 ${theme.textSecondary}`}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Subjects */}
      <div>
        <p className={`text-xs font-semibold mb-3 ${theme.textSecondary}`}>📖 Groups per Subject</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(subjects).map(([sub, count]) => (
            <span key={sub} className={`text-xs px-3 py-1 rounded-full border font-medium ${isDark ? 'bg-[#5478FF]/10 border-[#5478FF]/30 text-[#53CBF3]' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
              {sub}: {count}
            </span>
          ))}
        </div>
      </div>

      {/* Per Semester */}
      <div>
        <p className={`text-xs font-semibold mb-3 ${theme.textSecondary}`}>🎓 Groups per Semester</p>
        <div className="flex gap-3">
          {Object.entries(semesters).map(([sem, count], i) => (
            <div key={sem} className="text-center">
              <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${semColors[i % semColors.length]} flex items-center justify-center shadow-sm`}>
                <span className="text-white font-black">{count}</span>
              </div>
              <p className={`text-[10px] mt-1 font-semibold ${theme.textSecondary}`}>Sem {sem}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top groups */}
      <div>
        <p className={`text-xs font-semibold mb-3 ${theme.textSecondary}`}>🔥 Top Active Groups</p>
        <div className="space-y-2.5">
          {topGroups.map((g, i) => (
            <div key={i}
              className={`p-4 rounded-xl border ${theme.border} ${isDark ? 'bg-gradient-to-r from-[#5478FF]/5 to-[#53CBF3]/5' : 'bg-gradient-to-r from-blue-50 to-cyan-50'}`}>
              <div className="flex justify-between items-center">
                <div>
                  <p className={`font-bold text-sm ${theme.text}`}>{g.name}</p>
                  <p className={`text-xs mt-0.5 ${theme.textSecondary}`}>{g.subject} · Semester {g.semester}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${theme.text}`}>👥 {g.members}</p>
                  <p className={`text-xs ${theme.textSecondary}`}>📅 {g.sessions} sessions</p>
                </div>
              </div>
              <div className={`mt-2 w-full h-1 rounded-full ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
                <div className="h-1 rounded-full bg-gradient-to-r from-[#5478FF] to-[#53CBF3]"
                  style={{ width: `${(g.members / topGroups[0].members) * 100}%` }}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudyGroupAnalytics;