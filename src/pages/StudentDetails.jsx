import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import studentService from '../services/studentService';
import Alert from '../components/common/Alert';
import LoadingSpinner from '../components/common/LoadingSpinner';

const StudentDetails = () => {
  const [student, setStudent] = useState(null);
  // const [fees, setFees] = useState([]); // <-- TEMPORARILY COMMENTED OUT
  // const [attendance, setAttendance] = useState([]); // <-- TEMPORARILY COMMENTED OUT
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError('');
        
        // <-- TEMPORARILY MODIFIED: Removed fees and attendance calls
        // We only fetch the student data now
        const stuRes = await studentService.getStudentById(id);
        
        /* // Original Promise.all
        const [stuRes, attRes] = await Promise.all([
          studentService.getStudentById(id),
          // studentService.getStudentFeeRecords(id), // <-- TEMPORARILY COMMENTED OUT
          // studentService.getStudentAttendance(id), // <-- TEMPORARILY COMMENTED OUT
        ]);
        */
        
        setStudent(stuRes.data);
        // setFees(feesRes.data || []); // <-- TEMPORARILY COMMENTED OUT
        // setAttendance(attRes.data || []); // <-- TEMPORARILY COMMENTED OUT
      } catch (err) {
        setError(err?.message || 'Failed to load student details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  /* <-- TEMPORARILY COMMENTED OUT
  const feesSummary = () => {
    const total = fees.reduce((s, f) => s + Number(f.amount || 0), 0);
    const paid = fees.reduce((s, f) => s + Number(f.paidAmount || 0), 0);
    const outstanding = total - paid;
    return { total, paid, outstanding };
  };
  */

  const downloadReport = () => {
    const rows = [];
    rows.push(['Student Info']);
    rows.push(['ID', student.id]);
    rows.push(['Full Name', student.fullName || `${student.firstName} ${student.lastName}`]);
    rows.push(['Admission No', student.admissionNo || '']);
    rows.push(['Class', student.class || '']);
    rows.push(['Phone', student.guardianPhone || '']);
    rows.push([]);
    
    /* <-- TEMPORARILY COMMENTED OUT (Fees)
    rows.push(['Fees Summary']);
    const sum = feesSummary();
    rows.push(['Total Fees', sum.total]);
    rows.push(['Paid', sum.paid]);
    rows.push(['Outstanding', sum.outstanding]);
    rows.push([]);
    rows.push(['Fees Records']);
    rows.push(['Fee Type', 'Amount', 'Paid', 'Due Date', 'Status']);
    fees.forEach((f) => {
      rows.push([f.feeType || '', f.amount || '', f.paidAmount || '', f.dueDate || '', f.status || '']);
    });
    rows.push([]);
    */

    /* <-- TEMPORARILY COMMENTED OUT (Attendance)
    rows.push(['Attendance Records']);
    rows.push(['Date', 'Status', 'Notes']);
    attendance.forEach((a) => {
      rows.push([a.date || '', a.status || '', a.notes || '']);
    });
    */

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
        <LoadingSpinner /> 
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
          <Button onClick={() => navigate(-1)}>Back</Button>
        </div>
      </div>
    );
  }

  // const sum = feesSummary(); // <-- TEMPORARILY COMMENTED OUT

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button variant="secondary" onClick={() => navigate(-1)}>
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
            <div className="text-lg font-semibold">{student.fullName}</div>
          </div>
          <div>
            <h4 className="text-sm text-gray-500">Admission No</h4>
            <div className="text-lg font-semibold">{student.admissionNo}</div>
          </div>
          <div>
            <h4 className="text-sm text-gray-500">Class / Section</h4>
            <div className="text-lg font-semibold">{student.class}</div>
          </div>
          <div>
            <h4 className="text-sm text-gray-500">Parent Phone</h4>
            <div>{student.guardianPhone}</div>
          </div>
          <div>
            <h4 className="text-sm text-gray-500">Address</h4>
            <div>{student.address || '-'}</div>
          </div>
          <div>
            <h4 className="text-sm text-gray-500">DOB</h4>
            <div>{student.dateOfBirth || '-'}</div>
          </div>
        </div>
      </Card>

      {/* <-- TEMPORARILY MODIFIED: Grid is now 1 column */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        
        {/*
        // <-- TEMPORARILY COMMENTED OUT (Fees Card)
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
                    <div>{f.feeType || 'Invoice'}</div>
                    <div>{f.amount} ({f.status || ''})</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
        */}

        {/*
        // <-- TEMPORARILY COMMENTED OUT (Attendance Card)
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
                  {attendance.map((a, index) => (
                    <tr key={a.id || index}>
                      <td className="px-3 py-2">{a.date}</td>
                      <td className="px-3 py-2">{a.status}</td>
                      <td className="px-3 py-2">{a.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
        */}

      </div>
    </div>
  );
};

export default StudentDetails;