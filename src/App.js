// App.js
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
import Reports from "./pages/Reports";
// 1. Import the FeePaymentForm component
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
            
            {/* EXISTING ROUTE for the dashboard page */}
            <Route path="/fees" element={<FeesManagement />} />
            
            {/* 2. ADD THE DYNAMIC ROUTE FOR THE PAYMENT FORM HERE */}
            <Route path="/fees/pay/:studentId" element={<FeePaymentForm />} />
            
            <Route path="/payments" element={<PaymentsManagement />} />
            <Route path="/attendance" element={<AttendanceManagement />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </DashboardLayout>
      )}
    </Router>
  );
}

export default App;