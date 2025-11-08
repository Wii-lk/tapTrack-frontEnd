import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, User, Mail, Phone, Calendar, MapPin } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Alert from '../components/common/Alert';
import LoadingSpinner from '../components/common/LoadingSpinner';
import teacherService from '../services/teacherService';

const TeacherDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Renamed function to be more descriptive
    const loadTeacherDetails = async () => {
      try {
        setLoading(true);
        setError('');
        // This is your service call
        const response = await teacherService.getTeacherById(id); 
        setTeacher(response.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch teacher details');
      } finally {
        setLoading(false);
      }
    };

    loadTeacherDetails();
  }, [id]); // Dependency array is correct

  const handleDownloadReport = () => {
    // Implement report download functionality
    console.log('Download report for teacher:', teacher.id);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          onClick={() => navigate('/teachers')}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to Teachers
        </Button>
        <Alert type="error" message={error} />
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900">Teacher not found</h3>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/teachers')}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {/* CHANGED: first_name -> firstName, last_name -> lastName */}
              {teacher.firstName} {teacher.lastName}
            </h2>
            <p className="text-gray-600">Teacher Details</p>
          </div>
        </div>
        <Button
          onClick={handleDownloadReport}
          className="flex items-center gap-2"
          size="small"
        >
          <Download size={16} />
          Download Report
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Teacher Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <User size={18} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">
                    {/* CHANGED: first_name -> firstName, last_name -> lastName */}
                    {teacher.firstName} {teacher.lastName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  {/* (email was already correct) */}
                  <p className="font-medium">{teacher.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  {/* CHANGED: phone_no -> phone */}
                  <p className="font-medium">{teacher.phone}</p>
                </div>
              </div>
              {teacher.date_of_birth && (
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="font-medium">
                      {/* (date_of_birth was already correct) */}
                      {new Date(teacher.date_of_birth).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
              {teacher.gender && (
                <div className="flex items-center gap-3">
                  <User size={18} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    {/* (gender was already correct) */}
                    <p className="font-medium capitalize">{teacher.gender}</p>
                  </div>
                </div>
              )}
              {teacher.address && (
                <div className="md:col-span-2 flex items-start gap-3">
                  <MapPin size={18} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    {/* (address was already correct) */}
                    <p className="font-medium">{teacher.address}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Professional Information */}
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Professional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Position</p>
                {/* CHANGED: position -> designation */}
                <p className="font-medium">{teacher.designation || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Unique ID</p>
                {/* (unique_no was already correct) */}
                <p className="font-medium">{teacher.unique_no}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Basic Salary</p>
                <p className="font-medium">
                  {/* (basic_salary was already correct) */}
                  LKR {teacher.basic_salary?.toLocaleString()}
                </p>
              </div>
              {teacher.hire_date && (
                <div>
                  <p className="text-sm text-gray-500">Hire Date</p>
                  <p className="font-medium">
                    {/* (hire_date was already correct) */}
                    {new Date(teacher.hire_date).toLocaleDateString()}
                  </p>
                </div>
              )}
              {teacher.qualification && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Qualifications</p>
                  {/* (qualification was already correct) */}
                  <p className="font-medium">{teacher.qualification}</p>
                </div>
              )}
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Status</p>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    // (is_active was already correct)
                    teacher.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {teacher.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar - Additional Information */}
        <div className="space-y-6">
          {/* COMMENT: As you requested, this "Quick Stats" section is missing
            API data. The 'getTeacherById' endpoint doesn't return this info.
            Your current code correctly shows placeholders ('-').
            You will need a separate API endpoint to get this data.
          */}
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Quick Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Classes Assigned</span>
                <span className="font-medium">-</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Students</span>
                <span className="font-medium">-</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Attendance Rate</span>
                <span className="font-medium">-</span>
              </div>
            </div>
          </Card>

          {/* COMMENT: This "Reporting To" card will correctly show/hide.
            The `parent_staff` object in your API (when not null) will also
            use camelCase, so I've updated it here.
          */}
          {teacher.parent_staff && (
            <Card>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Reporting To
              </h3>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">
                    {/* CHANGED: first_name -> firstName, last_name -> lastName */}
                    {teacher.parent_staff.firstName} {teacher.parent_staff.lastName}
                  </p>
                  <p className="text-sm text-gray-500">Supervisor</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDetails;