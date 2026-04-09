import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { colors } from '../../contexts/ColorContext';
import { analyticsApi } from '../utils/Analyticsapi';
import RecommendationCard from '../pages/RecommendationCard';
import { Star, BookOpen, RefreshCw } from 'lucide-react';

const Recommendations = () => {
  const { isDark } = useTheme();
  const theme = isDark ? colors.dark : colors.light;

  const [recommendations, setRecommendations] = useState([]);
  const [popularBatches,  setPopularBatches]  = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [activeTab,       setActiveTab]       = useState('programs');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const [recs, popular] = await Promise.all([
        analyticsApi.getRecommendations(currentUser.id || 1),
        analyticsApi.getPopularBatches(),
      ]);
      setRecommendations(recs);
      setPopularBatches(popular);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme.background}`}>
        <div className={`${theme.cardBg} border ${theme.border} rounded-2xl p-10 flex flex-col items-center gap-4 shadow-2xl`}>
          <div className="h-12 w-12 rounded-full border-4 border-[#5478FF] border-t-transparent animate-spin"/>
          <p className={`text-sm font-semibold ${theme.textSecondary}`}>Loading recommendations…</p>
        </div>
      </div>
    );
  }

  const TABS = [
    { id: 'programs', label: 'Program Recommendations', icon: BookOpen },
    { id: 'batches',  label: 'Popular Batches',         icon: Star     },
  ];

  return (
    <div className={`min-h-screen ${theme.background} p-6`} style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className={`text-2xl font-black ${theme.text}`}>🎯 Your Recommendations</h1>
          <p className={`text-sm mt-1 ${theme.textSecondary}`}>Personalized suggestions based on your interests and preferences</p>
        </div>

        {/* Tabs */}
        <div className={`flex gap-1.5 mb-6 p-1.5 rounded-2xl border ${theme.border} ${isDark ? 'bg-[#111640]/50' : 'bg-white'} shadow-sm w-fit`}>
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

        {/* Programs grid */}
        {activeTab === 'programs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recommendations.length > 0 ? (
              recommendations.map((rec, i) => <RecommendationCard key={i} recommendation={rec}/>)
            ) : (
              <div className={`col-span-3 ${theme.cardBg} border ${theme.border} rounded-2xl py-16 text-center`}>
                <BookOpen size={40} className={`mx-auto mb-3 ${theme.textSecondary}`}/>
                <p className={`font-bold ${theme.text}`}>No recommendations yet</p>
                <p className={`text-sm mt-1 ${theme.textSecondary}`}>Complete your profile to get personalized suggestions</p>
              </div>
            )}
          </div>
        )}

        {/* Popular batches */}
        {activeTab === 'batches' && (
          <div className={`${theme.cardBg} rounded-2xl border ${theme.border} overflow-hidden shadow-sm`}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={`${isDark ? 'bg-[#0D1235]/80 text-[#53CBF3]' : 'bg-gray-50 text-gray-500'} text-xs uppercase tracking-wider border-b ${theme.border}`}>
                    {['Batch Name', 'Program', 'Students', 'Popularity'].map(h => (
                      <th key={h} className="px-5 py-3 text-left font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {popularBatches.length > 0 ? (
                    popularBatches.map((batch, i) => (
                      <tr key={i}
                        className={`border-t ${theme.border} ${i % 2 === 1 ? (isDark ? 'bg-[#0D1235]/60' : 'bg-gray-50/50') : ''} ${isDark ? 'hover:bg-[#5478FF]/10' : 'hover:bg-blue-50/40'} transition-colors`}>
                        <td className={`px-5 py-3 font-bold text-xs ${theme.text}`}>{batch.batchName || 'N/A'}</td>
                        <td className={`px-5 py-3 text-xs ${theme.textSecondary}`}>{batch.programName || 'N/A'}</td>
                        <td className="px-5 py-3 text-xs">
                          <span className={`font-semibold ${theme.text}`}>👥 {batch.studentCount || 0}</span>
                        </td>
                        <td className="px-5 py-3 text-xs">
                          <div className="flex items-center gap-1.5">
                            <div className={`flex-1 h-1.5 rounded-full ${isDark ? 'bg-white/10' : 'bg-gray-200'} w-20`}>
                              <div className="h-1.5 rounded-full bg-gradient-to-r from-[#FFDE42] to-[#FB923C]"
                                style={{ width: `${((batch.popularityScore || 0) / 5) * 100}%` }}/>
                            </div>
                            <span className={`font-bold text-[#FFDE42]`}>★ {batch.popularityScore || 0}</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className={`px-5 py-10 text-center text-sm ${theme.textSecondary}`}>No batch data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendations;