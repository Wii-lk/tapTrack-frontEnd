import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download } from "lucide-react";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import studentService from "../services/studentService";
import { feeService } from "../services/feeService";
import Alert from "../components/common/Alert";
import LoadingSpinner from "../components/common/LoadingSpinner";

const StudentDetails = () => {
  const [student, setStudent] = useState(null);
  const [fees, setFees] = useState({ summary: {}, records: [], payments: [] });
  // const [attendance, setAttendance] = useState([]); // <-- TEMPORARILY COMMENTED OUT
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const [stuRes, feeRes, payRes, advRes] = await Promise.all([
          studentService.getStudentById(id),
          feeService.getOutstandingFees(id),
          feeService.getPaymentHistory({ student_id: id }),
          feeService.getAdvanceBalance(id),
        ]);

        setStudent(stuRes.data);

        // Process fee data
        const studentFeeData = feeRes.data?.students?.[0] || {};

        // Process Payment History
        const paymentHistory = payRes.data?.payments || [];

        // Process Advance Balance
        const advanceBalance = advRes.data?.total_advance_balance || 0;

        setFees({
          summary: {
            total: studentFeeData.total_outstanding || 0,
            advance: advanceBalance,
          },
          records: studentFeeData.fees || [],
          payments: paymentHistory,
        });
      } catch (err) {
        setError(err?.message || "Failed to load student details");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const downloadReport = () => {
    const rows = [];
    rows.push(["Student Info"]);
    rows.push(["ID", student.id]);
    rows.push([
      "Full Name",
      student.fullName || `${student.firstName} ${student.lastName}`,
    ]);
    rows.push(["Admission No", student.admissionNo || ""]);
    rows.push(["Class", student.class || ""]);
    rows.push(["Phone", student.guardianPhone || ""]);
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
    const csvContent = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${student?.fullName || "student"}_report.csv`;
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
    return <Alert type="error" message={error} onClose={() => setError("")} />;
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
            <div>{student.address || "-"}</div>
          </div>
          <div>
            <h4 className="text-sm text-gray-500">DOB</h4>
            <div>{student.dateOfBirth || "-"}</div>
          </div>
        </div>
      </Card>

      {/* <-- TEMPORARILY MODIFIED: Grid is now 1 column */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-lg font-semibold mb-3">Fees Summary</h3>
          {(() => {
            const totalDue = fees.records.reduce(
              (sum, f) => sum + parseFloat(f.total_amount || 0),
              0,
            );
            const outstanding = fees.records.reduce(
              (sum, f) => sum + parseFloat(f.outstanding || 0),
              0,
            );
            const advance = parseFloat(fees.summary.advance || 0);

            return (
              <div className="grid grid-cols-3 gap-4 border-b pb-4 mb-4 border-gray-100">
                <div>
                  <p className="text-sm text-gray-500">Total Outstanding</p>
                  <p
                    className={`text-xl font-semibold ${outstanding > 0 ? "text-red-600" : "text-gray-800"}`}
                  >
                    {outstanding.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Advance Balance</p>
                  <p
                    className={`text-xl font-semibold ${advance > 0 ? "text-green-600" : "text-gray-800"}`}
                  >
                    {advance.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Payment</p>
                  <p className="text-lg font-medium">
                    {fees.payments && fees.payments.length > 0
                      ? fees.payments[0].payment_date?.split("T")[0]
                      : "-"}
                  </p>
                </div>
              </div>
            );
          })()}

          <div className="space-y-6">
            {/* Outstanding Invoices Section */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Outstanding Invoices
              </h4>
              {fees.records.length === 0 ? (
                <p className="text-sm text-gray-500 italic bg-gray-50 p-2 rounded">
                  No outstanding invoices.
                </p>
              ) : (
                <div className="space-y-2">
                  {fees.records.map((f) => (
                    <div
                      key={f.id}
                      className="flex justify-between items-center text-sm p-3 bg-white border border-gray-100 rounded-lg shadow-sm"
                    >
                      <div>
                        <div className="font-medium text-gray-900">
                          {f.month_name || `Month ${f.month}`} {f.year}
                        </div>
                        <div className="text-xs text-red-500">
                          Due: {f.due_date}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {parseFloat(f.outstanding).toLocaleString()}
                        </div>
                        <div className="text-xs text-orange-600 font-medium uppercase">
                          {f.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payment History Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Recent Payments (Last 5)
                </h4>
              </div>

              {fees.payments && fees.payments.length === 0 ? (
                <p className="text-sm text-gray-500 italic bg-gray-50 p-3 rounded-lg border border-gray-100">
                  No payments found for this student.
                </p>
              ) : (
                <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                  {fees.payments?.slice(0, 5).map((p, index) => (
                    <div
                      key={p.id || index}
                      className={`
                        flex flex-col sm:flex-row sm:items-center justify-between p-4 
                        border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors
                        ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}
                      `}
                    >
                      <div className="flex items-start gap-3 mb-2 sm:mb-0">
                        <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 font-bold text-xs shrink-0 border border-green-100">
                          {p.payment_method === "cash" ? "💵" : "🏦"}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="font-semibold text-gray-900">
                              {parseFloat(p.amount).toLocaleString("en-US", {
                                style: "currency",
                                currency: "LKR",
                              })}
                            </div>
                            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-green-100 text-green-700 border border-green-200">
                              Paid
                            </span>
                          </div>

                          <div className="text-xs text-gray-500 mt-1">
                            📅 {p.payment_date?.split("T")[0]} &bull;{" "}
                            {p.payment_type || "Tuition Fee"}
                          </div>
                          {p.notes && (
                            <div className="text-xs text-gray-500 mt-0.5 italic max-w-xs truncate">
                              "{p.notes}"
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-right pl-12 sm:pl-0">
                        <div className="text-xs font-mono text-gray-400 mb-0.5">
                          RCP #{p.id}
                        </div>
                        <div className="text-xs font-medium text-gray-600">
                          {p.payment_method?.replace("_", " ").toUpperCase()}
                        </div>
                        {p.received_by && (
                          <div className="text-[10px] text-gray-400 mt-0.5">
                            By: {p.received_by}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {fees.payments?.length > 5 && (
                    <div className="bg-gray-50 p-2 text-center border-t border-gray-100">
                      <button className="text-xs text-primary-600 hover:text-primary-800 font-medium">
                        View All History ({fees.payments.length})
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>

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
