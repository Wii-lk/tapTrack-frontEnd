// src/pages/StudentDetails.jsx
import React, { useEffect, useState } from 'react';
import { ArrowLeft, Download } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import studentService from '../services/studentService';
import Alert from '../components/common/Alert';

const StudentDetails = ({ studentId, onBack }) => {
  const [student, setStudent] = useState(null);
  const [fees, setFees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!studentId) return;
    const fetch = async () => {
      try {
        setLoading(true);
        setError('');
        const [stuRes, feesRes, attRes] = await Promise.all([
          studentService.getStudentById(studentId),
          studentService.getStudentFees(studentId),
          studentService.getStudentAttendance(studentId),
        ]);
        setStudent(stuRes.data);
        setFees(feesRes.data || []);
        setAttendance(attRes.data || []);
      } catch (err) {
        setError(err?.message || 'Failed to load student details');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [studentId]);

  const feesSummary = () => {
    const total = fees.reduce((s, f) => s + Number(f.amount || 0), 0);
    const paid = fees.reduce((s, f) => s + Number(f.paid || 0), 0);
    const outstanding = total - paid;
    return { total, paid, outstanding };
  };

  const downloadReport = () => {
    // Combine student, fees and attendance into CSV
    const rows = [];
    rows.push(['Student Info']);
    rows.push(['ID', student.id]);
    rows.push(['Full Name', student.fullName || `${student.firstName} ${student.lastName}`]);
    rows.push(['Admission No', student.admissionNo || '']);
    rows.push(['Class', student.class || '']);
    rows.push(['Section', student.section || '']);
    rows.push(['Phone', student.phone || '']);
    rows.push([]);
    rows.push(['Fees Summary']);
    const sum = feesSummary();
    rows.push(['Total Fees', sum.total]);
    rows.push(['Paid', sum.paid]);
    rows.push(['Outstanding', sum.outstanding]);
    rows.push([]);
    rows.push(['Fees Records']);
    rows.push(['Invoice', 'Amount', 'Paid', 'Due Date', 'Status']);
    fees.forEach((f) => {
      rows.push([f.invoice || '', f.amount || '', f.paid || '', f.dueDate || '', f.status || '']);
    });
    rows.push([]);
    rows.push(['Attendance Records']);
    rows.push(['Date', 'Status', 'Notes']);
    attendance.forEach((a) => {
      rows.push([a.date || '', a.status || '', a.notes || '']);
    });

    // CSV creation
    const csvContent = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${student?.fullName || 'student'}_report.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading student details...</p>
      </div>
    );
  }

  if (error) {
    return <Alert type="error" message={error} onClose={() => setError('')} />;
  }

  if (!student) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-600">Student not found</p>
        <div className="mt-4">
          <Button onClick={onBack}>Back</Button>
        </div>
      </div>
    );
  }

  const sum = feesSummary();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button variant="secondary" onClick={onBack}>
            <ArrowLeft size={16} className="mr-2 inline" />
            Back
          </Button>
          <h2 className="text-2xl font-bold text-gray-800">Student Details</h2>
        </div>

        <div className="flex items-center space-x-2">
          <Button onClick={downloadReport}>
            <Download size={16} className="mr-2 inline" />
            Download Report
          </Button>
        </div>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="text-sm text-gray-500">Full Name</h4>
            <div className="text-lg font-semibold">{student.fullName || `${student.firstName} ${student.lastName}`}</div>
          </div>
          <div>
            <h4 className="text-sm text-gray-500">Admission No</h4>
            <div className="text-lg font-semibold">{student.admissionNo}</div>
          </div>
          <div>
            <h4 className="text-sm text-gray-500">Class / Section</h4>
            <div className="text-lg font-semibold">{student.class} / {student.section}</div>
          </div>

          <div>
            <h4 className="text-sm text-gray-500">Phone</h4>
            <div>{student.phone}</div>
          </div>
          <div>
            <h4 className="text-sm text-gray-500">Email</h4>
            <div>{student.email}</div>
          </div>
          <div>
            <h4 className="text-sm text-gray-500">DOB</h4>
            <div>{student.dateOfBirth || '-'}</div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-lg font-semibold mb-3">Fees Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-xl font-semibold">{sum.total}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Paid</p>
              <p className="text-xl font-semibold">{sum.paid}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Outstanding</p>
              <p className="text-xl font-semibold text-red-600">{sum.outstanding}</p>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-sm text-gray-600 mb-2">Recent Fees</h4>
            {fees.length === 0 ? (
              <p className="text-sm text-gray-500">No fee records</p>
            ) : (
              <div className="space-y-2">
                {fees.slice(0, 5).map((f) => (
                  <div key={f.id} className="flex justify-between text-sm">
                    <div>{f.invoice || 'Invoice'}</div>
                    <div>{f.amount} ({f.status || ''})</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-3">Attendance</h3>
          {attendance.length === 0 ? (
            <p className="text-sm text-gray-500">No attendance records</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left">Date</th>
                    <th className="px-3 py-2 text-left">Status</th>
                    <th className="px-3 py-2 text-left">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((a) => (
                    <tr key={a.id}>
                      <td className="px-3 py-2">{a.date}</td>
                      <td className="px-3 py-2">{a.status}</td>
                      <td className="px-3 py-2">{a.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default StudentDetails;
