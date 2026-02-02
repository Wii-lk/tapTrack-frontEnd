import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import Pagination from '../components/common/Pagination';
import Alert from '../components/common/Alert';
import StudentFilters from '../components/students/StudentFilters';
import StudentTable from '../components/students/StudentTable';
import StudentForm from '../components/students/StudentForm';
import DeleteConfirmModal from '../components/students/DeleteConfirmModal';
import studentService from '../services/studentService';

const StudentManagement = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Pagination
  // Pagination (single source of truth)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  // Filters
  // *** CORRECTED: State names now match the API ***
  const [filters, setFilters] = useState({
    search: '',
    grade_id: '',
    is_active: '',
  });

  useEffect(() => {
    // This effect is correct. It runs when 'currentPage' or 'filters' change.
    // Since search updates 'filters', it will trigger this call.
    fetchStudents();
  }, [currentPage, filters]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await studentService.getStudents(
        currentPage,
        10,
        filters
      );

      setStudents(response.data.students || []);
      setTotalPages(response.data.pagination?.last_page || 1);
    } catch (err) {
      setError(err.message || 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };



  const handleAddNew = () => {
    setSelectedStudent(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setIsFormModalOpen(true);
  };

  const handleDelete = (student) => {
    setSelectedStudent(student);
    setIsDeleteModalOpen(true);
  };

  const handleView = (student) => {
    navigate(`/students/${student.id}`);
  };

  const handleFormSubmit = async (formData, callback) => {
    try {
      setFormLoading(true);
      setError('');

      if (selectedStudent) {
        await studentService.updateStudent(selectedStudent.id, formData);
        setSuccess('Student updated successfully!');
      } else {
        await studentService.createStudent(formData);
        setSuccess('Student added successfully!');
      }

      fetchStudents();

      // Show RFID modal first
      if (callback) callback();

      // Only close the form modal after RFID modal is closed
      // You can do this in the StudentForm by closing RFID modal first
    } catch (err) {
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  };




  const handleDeleteConfirm = async () => {
    try {
      setFormLoading(true);
      setError('');
      await studentService.deleteStudent(selectedStudent.id);
      setSuccess('Student deleted successfully!');
      setIsDeleteModalOpen(false);
      fetchStudents();
    } catch (err) {
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    // *** CORRECTED: Reset matches the new state structure ***
    setFilters({
      search: '',
      grade_id: '',
      is_active: '',
    });
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
  if (page >= 1 && page <= totalPages) {
    setCurrentPage(page);
  }
};


  return (
    <div className="space-y-6">
      {/* Header */}
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 sm:pt-0">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Student Management</h2>
          <p className="text-sm text-gray-600 mt-1">Manage all students in the system</p>
        </div>
        <Button
          onClick={handleAddNew}
          size="small"
          className="w-full sm:w-auto" // Mobile: Full width, Desktop: Auto
        >
          <UserPlus size={15} className="mr-2 inline" />
          New Student
        </Button>
      </div>

      {/* Alerts */}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && (
        <Alert type="success" message={success} onClose={() => setSuccess('')} />
      )}

      {/* Filters */}
      <StudentFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Table */}
      <StudentTable
        students={students}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        loading={loading}
      />

      {/* Pagination */}
      {!loading && students.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}


      {/* Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={selectedStudent ? 'Edit Student' : 'Add New Student'}
        size="lg"
      >
        <StudentForm
          student={selectedStudent}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormModalOpen(false)}
          loading={formLoading}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        studentName={selectedStudent?.fullName}
        loading={formLoading}
      />
    </div>
  );
};

export default StudentManagement;
