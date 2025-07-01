
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';

import LoginPage from './login/login';
import { ToastProvider } from './login/toast';
import BookSlot from './user/bookSlot';
import StaffHome from './staff/staffhome';
import AdminHome from './admin/adminHome';
import UserHome from './user/UserHome';
import { AdminRoute, UserRoute, StaffRoute } from './protect/ProtectRoute';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ToastProvider>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/user" element={<UserRoute><UserHome /></UserRoute>} />
        <Route path="/user/booking" element={<UserRoute><BookSlot /></UserRoute>} />
        <Route path="/staff" element={<StaffRoute><StaffHome /></StaffRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminHome /></AdminRoute>} />
        <Route path="*" element={<App />} />
      </Routes>
    </Router>
  </ToastProvider>
);