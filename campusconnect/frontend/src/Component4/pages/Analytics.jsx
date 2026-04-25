import React from 'react';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import Chatbot from '../components/Chatbot';  // ← Add this

const Analytics = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AnalyticsDashboard />
      <Chatbot />  {/* ← Add this */}
    </div>
  );
};

export default Analytics;


// Component 4: Analytics Page - Wrapper component for Analytics Dashboard
// Component 4: Analytics Dashboard - Developed by [Yo