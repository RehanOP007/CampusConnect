// Component 4: Batch Rep Requests - Manages pending batch representative approvals
import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { colors } from '../../contexts/ColorContext';
import { ClipboardList, CheckCircle, XCircle, Clock } from 'lucide-react';

const BatchRepRequests = ({ data }) => {
  const { isDark } = useTheme();
  const theme = isDark ? colors.dark : colors.light;

  const [requests, setRequests] = useState(data?.batchRepRequests || [
    { id: 1, name: 'Alice Johnson', batch: 'Batch A', email: 'alice@example.com', status: 'pending',  date: '2026-03-24' },
    { id: 2, name: 'Bob Smith',     batch: 'Batch B', email: 'bob@example.com',   status: 'pending',  date: '2026-03-23' },
    { id: 3, name: 'Carol White',   batch: 'Batch A', email: 'carol@example.com', status: 'pending',  date: '2026-03-22' },
    { id: 4, name: 'David Lee',     batch: 'Batch C', email: 'david@example.com', status: 'approved', date: '2026-03-20' },
    { id: 5, name: 'Emma Davis',    batch: 'Batch B', email: 'emma@example.com',  status: 'rejected', date: '2026-03-19' },
  ]);
  const [filter, setFilter] = useState('all');

  const pendingCount  = requests.filter(r => r.status === 'pending').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const rejectedCount = requests.filter(r => r.status === 'rejected').length;
  const filtered      = filter === 'all' ? requests : requests.filter(r => r.status === filter);

  const batchStats = {};
  requests.filter(r => r.status === 'pending').forEach(r => {
    batchStats[r.batch] = (batchStats[r.batch] || 0) + 1;
  });

  const handleApprove = (id) => setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
  const handleReject  = (id) => setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));

  const STAT_CARDS = [
    { label: 'Pending',  value: pendingCount,  color: 'text-amber-400',  bg: 'bg-amber-500/10 border-amber-500/20',  icon: Clock       },
    { label: 'Approved', value: approvedCount, color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/20',  icon: CheckCircle },
    { label: 'Rejected', value: rejectedCount, color: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/20',      icon: XCircle     },
  ];

  const FILTERS = [
    { key: 'all',      label: 'All',      active: 'bg-[#5478FF] text-white',  idle: isDark ? 'bg-white/5 text-white/40 border border-white/10' : 'bg-gray-100 text-gray-500 border border-gray-200' },
    { key: 'pending',  label: 'Pending',  active: 'bg-amber-500 text-white',  idle: isDark ? 'bg-white/5 text-white/40 border border-white/10' : 'bg-gray-100 text-gray-500 border border-gray-200' },
    { key: 'approved', label: 'Approved', active: 'bg-green-500 text-white',  idle: isDark ? 'bg-white/5 text-white/40 border border-white/10' : 'bg-gray-100 text-gray-500 border border-gray-200' },
    { key: 'rejected', label: 'Rejected', active: 'bg-red-500 text-white',    idle: isDark ? 'bg-white/5 text-white/40 border border-white/10' : 'bg-gray-100 text-gray-500 border border-gray-200' },
  ];

  return (
    <div className={`${theme.cardBg} rounded-2xl border ${theme.border} p-6 space-y-5`}>
      <h2 className={`text-lg font-black flex items-center gap-2 ${theme.text}`}>
        <ClipboardList size={18} className="text-[#5478FF]" /> Batch Representative Requests
      </h2>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {STAT_CARDS.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`text-center p-4 rounded-xl border ${s.bg}`}>
              <Icon size={18} className={`mx-auto mb-1 ${s.color}`}/>
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className={`text-[10px] font-semibold mt-0.5 ${theme.textSecondary}`}>{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${filter === f.key ? f.active : f.idle}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Pending per batch */}
      {Object.keys(batchStats).length > 0 && (
        <div className={`p-4 rounded-xl border ${theme.border} ${isDark ? 'bg-[#0D1235]' : 'bg-gray-50'}`}>
          <p className={`text-xs font-semibold mb-3 ${theme.textSecondary}`}>📊 Pending per Batch</p>
          <div className="flex gap-3 flex-wrap">
            {Object.entries(batchStats).map(([batch, count]) => (
              <div key={batch} className="text-center">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#FFDE42] to-[#FB923C] flex items-center justify-center shadow-sm">
                  <span className="text-white font-black text-sm">{count}</span>
                </div>
                <p className={`text-[10px] mt-1 font-semibold ${theme.textSecondary}`}>{batch}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Request list */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <p className={`text-center py-8 text-sm ${theme.textSecondary}`}>No {filter === 'all' ? '' : filter} requests</p>
        ) : (
          filtered.map(req => (
            <div key={req.id}
              className={`flex justify-between items-center p-4 rounded-xl border ${theme.border} ${isDark ? 'bg-[#0D1235]' : 'bg-gray-50'} gap-4`}>
              {/* Left */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#5478FF] to-[#53CBF3] flex items-center justify-center text-white font-black text-sm shrink-0">
                  {req.name.charAt(0)}
                </div>
                <div>
                  <p className={`font-bold text-sm ${theme.text}`}>{req.name}</p>
                  <p className={`text-xs ${theme.textSecondary}`}>{req.batch} · {req.email}</p>
                  <p className={`text-[10px] mt-0.5 ${isDark ? 'text-white/20' : 'text-gray-400'}`}>{req.date}</p>
                </div>
              </div>
              {/* Right */}
              <div className="shrink-0">
                {req.status === 'pending' ? (
                  <div className="flex gap-2">
                    <button onClick={() => handleApprove(req.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold hover:bg-green-500/20 transition-colors">
                      <CheckCircle size={12}/> Approve
                    </button>
                    <button onClick={() => handleReject(req.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-colors">
                      <XCircle size={12}/> Reject
                    </button>
                  </div>
                ) : (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${req.status === 'approved' ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}>
                    {req.status.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info note */}
      <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#5478FF]/5 border-[#5478FF]/20 text-[#53CBF3]' : 'bg-blue-50 border-blue-200 text-blue-700'} text-xs font-medium flex items-center gap-2`}>
        ℹ️ Maximum 4 batch representatives allowed per batch
      </div>
    </div>
  );
};

export default BatchRepRequests;

// Component 4: Batch Statistics - Displays batch-wise student metrics