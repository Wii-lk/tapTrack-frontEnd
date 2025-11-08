import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import StudentManagement from "./pages/StudentManagement";
import StudentDetails from "./pages/StudentDetails";
import TeacherManagement from "./pages/TeacherManagement";
import TeacherDetails from "./pages/TeacherDetails";
import ClassManagement from "./pages/ClassManagement";
import FeesManagement from "./pages/FeesManagement";
import PaymentsManagement from "./pages/PaymentsManagement";
import AttendanceManagement from "./pages/AttendanceManagement";

// ✅ 1. Import the new page
import AttendanceHistoryPage from "./pages/AttendanceHistoryPage"; // Assumed path

import Reports from "./pages/Reports";
import FeePaymentForm from "./components/payments/FeePaymentForm"; 

function App() {
  const { token } = useAuth();

  return (
    <Router>
      {!token ? (
        <LoginPage />
      ) : (
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/students" element={<StudentManagement />} />
            <Route path="/students/:id" element={<StudentDetails />} />
            <Route path="/teachers" element={<TeacherManagement />} />
            <Route path="/teachers/:id" element={<TeacherDetails />} />
            <Route path="/classes" element={<ClassManagement />} />
            <Route path="/sections" element={<ClassManagement />} />
            
            <Route path="/fees" element={<FeesManagement />} />
            <Route path="/fees/pay/:studentId" element={<FeePaymentForm />} />
            
            <Route path="/payments" element={<PaymentsManagement />} />

            {/* ✅ 2. Update routes */}
            {/* This route is for "Today's Attendance" */}
            <Route path="/attendance" element={<AttendanceManagement />} />
            {/* This new route points to the dedicated history page */}
            <Route path="/attendance_history" element={<AttendanceHistoryPage />} />
            
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </DashboardLayout>
      )}
    </Router>
  );
}

export default App;