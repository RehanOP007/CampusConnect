import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Analytics from '../pages/Analytics';
import Recommendations from '../pages/Recommendations';

const Component4Routes = () => {
  return (
    <Routes>
      <Route path="analytics" element={<Analytics />} />
      <Route path="recommendations" element={<Recommendations />} />
      <Route path="/" element={<Analytics />} />
    </Routes>
  );
};

export default Component4Routes;