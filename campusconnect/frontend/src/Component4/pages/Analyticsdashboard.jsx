import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { colors } from '../../contexts/ColorContext';
import { analyticsApi } from '../utils/Analyticsapi';
import BatchStats          from './Batchstats';
import FacultyStats        from './Facultystats';
import ProgramStats        from './Programstats';
import OverviewCards       from './Overviewcards';
import UserAnalytics       from './Useranalytics ';
import StudyGroupAnalytics from './StudyGroupAnalytics';
import SessionAnalytics    from './SessionAnalytics';
import AttendanceAnalytics from './AttendanceAnalytics';
import BatchRepRequests    from './BatchRepRequests';
import {
  LayoutDashboard, Users, BookOpen, Calendar, CheckCircle, ClipboardList,
  RefreshCw, AlertCircle,
} from 'lucide-react';

const TABS = [
  { id: 'overview',    label: 'Overview',           icon: LayoutDashboard },
  { id: 'users',       label: 'User Analytics',     icon: Users           },
  { id: 'groups',      label: 'Study Groups',       icon: BookOpen        },
  { id: 'sessions',    label: 'Sessions',           icon: Calendar        },
  //{ id: 'attendance',  label: 'Attendance',         icon: CheckCircle     },
  //{ id: 'requests',    label: 'Batch Rep Requests', icon: ClipboardList   },
];

const AnalyticsDashboard = () => {
  const { isDark } = useTheme();
  const theme = isDark ? colors.dark : colors.light;

  const [dashboardData, setDashboardData] = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);
  const [activeTab,     setActiveTab]     = useState('overview');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true); setError(null);
      const data = await analyticsApi.getDashboardData();
      setDashboardData(data);
    } catch (err) {
      setError('Failed to load analytics data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme.background}`}>
        <div className={`${theme.cardBg} border ${theme.border} rounded-2xl p-10 flex flex-col items-center gap-4 shadow-2xl`}>
          <div className="h-12 w-12 rounded-full border-4 border-[#5478FF] border-t-transparent animate-spin"/>
          <p className={`text-sm font-semibold ${theme.textSecondary}`}>Loading analytics…</p>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme.background}`}>
        <div className={`${theme.cardBg} border border-red-500/30 rounded-2xl p-8 text-center max-w-sm shadow-xl`}>
          <AlertCircle size={40} className="text-red-400 mx-auto mb-3"/>
          <p className={`font-bold ${theme.text} mb-1`}>Failed to load data</p>
          <p className={`text-sm ${theme.textSecondary} mb-4`}>{error}</p>
          <button onClick={fetchData}
            className="flex items-center gap-2 mx-auto px-4 py-2 rounded-xl bg-[#5478FF] text-white text-sm font-bold hover:bg-[#4060ee] transition-colors">
            <RefreshCw size={14}/> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.background} p-6`} style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className={`text-2xl font-black ${theme.text}`}>Analytics Dashboard</h1>
          <p className={`text-sm mt-1 ${theme.textSecondary}`}>System-wide overview and insights</p>
        </div>

        {/* Tab bar */}
        <div className={`flex flex-wrap gap-1.5 mb-6 p-1.5 rounded-2xl border ${theme.border} ${isDark ? 'bg-[#111640]/50' : 'bg-white'} shadow-sm`}>
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${isActive
                  ? 'bg-[#5478FF] text-white shadow-md shadow-[#5478FF]/30'
                  : `${theme.textSecondary} ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-100'}`}`}>
                <Icon size={13}/>
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <>
            {/* Big 4 summary cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Total Students',  value: dashboardData?.totalStudents  || 0, change: '↑ 12%',        color: 'from-[#5478FF] to-[#111FA2]' },
                { label: 'Total Faculties', value: dashboardData?.totalFaculties || 0, change: 'Active',       color: 'from-[#53CBF3] to-[#5478FF]' },
                { label: 'Active Programs', value: dashboardData?.activePrograms || 0, change: 'Ongoing',      color: 'from-[#A78BFA] to-[#5478FF]' },
                { label: 'Total Batches',   value: dashboardData?.totalBatches   || 0, change: 'Registered',   color: 'from-[#FFDE42] to-[#FB923C]' },
              ].map((card, i) => (
                <div key={i}
                  className={`${theme.cardBg} rounded-2xl border ${theme.border} p-5 relative overflow-hidden hover:shadow-lg hover:shadow-[#5478FF]/10 transition-all`}>
                  <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${card.color}`}/>
                  <p className={`text-xs font-semibold mb-2 ${theme.textSecondary}`}>{card.label}</p>
                  <p className={`text-4xl font-black ${theme.text}`}>{card.value}</p>
                  <p className="text-[#53CBF3] text-xs font-semibold mt-1">{card.change}</p>
                </div>
              ))}
            </div>

            {/* Overview metrics */}
            <OverviewCards data={dashboardData}/>

            {/* Detailed stats grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <BatchStats   data={dashboardData?.batchStats   || []}/>
              <FacultyStats data={dashboardData?.facultyStats || []}/>
              <ProgramStats data={dashboardData?.programStats || []}/>
            </div>
          </>
        )}

        {activeTab === 'users'      && <UserAnalytics       data={dashboardData}/>}
        {activeTab === 'groups'     && <StudyGroupAnalytics data={dashboardData}/>}
        {activeTab === 'sessions'   && <SessionAnalytics    data={dashboardData}/>}
        {activeTab === 'attendance' && <AttendanceAnalytics data={dashboardData}/>}
        {activeTab === 'requests'   && <BatchRepRequests    data={dashboardData}/>}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;