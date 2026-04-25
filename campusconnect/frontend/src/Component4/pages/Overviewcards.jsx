// Component 4: Overview Cards - Shows key metrics summary (students, faculties, programs, batches)
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { colors } from '../../contexts/ColorContext';
import { Users, BookOpen, Calendar, UserCheck, Clock } from 'lucide-react';

const CARDS = [
  { key: 'totalUsers',        label: 'Total Users',        icon: Users,      accent: 'from-[#5478FF] to-[#111FA2]', light: 'from-[#5478FF]/10 to-[#111FA2]/10', change: '+12%',        changeColor: 'text-green-500' },
  { key: 'totalStudyGroups',  label: 'Study Groups',       icon: BookOpen,   accent: 'from-[#53CBF3] to-[#5478FF]', light: 'from-[#53CBF3]/10 to-[#5478FF]/10', change: '+5%',         changeColor: 'text-green-500' },
  { key: 'totalSessions',     label: 'Total Sessions',     icon: Calendar,   accent: 'from-[#A78BFA] to-[#5478FF]', light: 'from-[#A78BFA]/10 to-[#5478FF]/10', change: '+8%',         changeColor: 'text-green-500' },
  { key: 'activeBatchReps',   label: 'Active Batch Reps',  icon: UserCheck,  accent: 'from-[#FFDE42] to-[#FB923C]', light: 'from-[#FFDE42]/10 to-[#FB923C]/10', change: '4 per batch', changeColor: 'text-[#53CBF3]' },
  { key: 'pendingRequests',   label: 'Pending Requests',   icon: Clock,      accent: 'from-[#F87171] to-[#FB923C]', light: 'from-[#F87171]/10 to-[#FB923C]/10', change: 'Need review', changeColor: 'text-amber-500' },
];

const OverviewCards = ({ data }) => {
  const { isDark } = useTheme();
  const theme = isDark ? colors.dark : colors.light;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {CARDS.map((card) => {
        const Icon = card.icon;
        const value = data?.[card.key] ?? 0;
        return (
          <div key={card.key}
            className={`${theme.cardBg} rounded-2xl border ${theme.border} p-5 hover:shadow-lg hover:shadow-[#5478FF]/10 transition-all duration-300 group relative overflow-hidden`}>
            {/* Gradient accent bar top */}
            <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${card.accent}`}/>
            {/* Icon */}
            <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${isDark ? card.accent : card.light} flex items-center justify-center mb-4 shadow-sm`}>
              <Icon size={20} className={isDark ? 'text-white' : `text-[#5478FF]`} />
            </div>
            <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${theme.textSecondary}`}>{card.label}</p>
            <p className={`text-3xl font-black ${theme.text}`}>{value}</p>
            <p className={`text-xs mt-1 font-medium ${card.changeColor}`}>{card.change}</p>
          </div>
        );
      })}
    </div>
  );
};

export default OverviewCards;