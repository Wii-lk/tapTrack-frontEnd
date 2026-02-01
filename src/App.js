import React from "react";
import {
  BrowserRouter as Router, // We use this as Router
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import StudentManagement from "./pages/StudentManagement";
import StudentDetails from "./pages/StudentDetails";
import TeacherManagement from "./pages/TeacherManagement";
import TeacherDetails from "./pages/TeacherDetails";
import ClassManagement from "./pages/ClassManagement";
// import FeesManagement from "./pages/FeesManagement";
// import PaymentsManagement from "./pages/PaymentsManagement";
import AttendanceManagement from "./pages/AttendanceManagement";
import LeaveManagementPage from "./pages/LeaveManagementPage";
import SalaryHistoryPage from "./pages/SalaryHistoryPage";
import AttendanceHistoryPage from "./pages/AttendanceHistoryPage";
// import Reports from "./pages/Reports";
import SystemSettings from "./pages/SystemSetting";

import ManageSalaryStaffPage from "./pages/ManageSalaryStaffPage";
import ManageSalaryPage from "./pages/ManageSalaryPage";

import ManageFeesPage from "./pages/ManageFeesPage";
import FeePaymentForm from "./components/fees/FeePaymentForm";
// import GlobalLoader from "./components/common/GlobalLoader";

function App() {
  const { token } = useAuth();

  return (
    /* 🟢 ADDED basename HERE to match your server URL subfolder */
    <Router basename="/PhoenixSystem/tapTrack-FrontEnd">
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

            <Route path="/fees" element={<ManageFeesPage />} />
            <Route
              path="/fees/collect/:studentId"
              element={<FeePaymentForm />}
            />
            <Route path="/payments" element={<ManageSalaryStaffPage />} />
            <Route path="/attendance" element={<AttendanceManagement />} />
            <Route
              path="/attendance_history"
              element={<AttendanceHistoryPage />}
            />
            <Route path="/leave" element={<LeaveManagementPage />} />

            <Route path="/salary/manage" element={<ManageSalaryStaffPage />} />
            <Route
              path="/salary/manage/:userId"
              element={<ManageSalaryPage />}
            />
            <Route path="/salary-history" element={<SalaryHistoryPage />} />
            <Route path="/settings" element={<SystemSettings />} />
          </Routes>
        </DashboardLayout>
      )}
    </Router>
  );
}

export default App;