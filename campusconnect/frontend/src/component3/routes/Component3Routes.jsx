import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StudyGroups from '../pages/StudyGroups';

const Component3Routes = () => {
  return (
    <Routes>
      <Route path="/" element={<StudyGroups />} />
      <Route path="groups" element={<StudyGroups />} />
    </Routes>
  );
};

export default Component3Routes;