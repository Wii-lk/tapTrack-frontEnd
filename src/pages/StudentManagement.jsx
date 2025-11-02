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
  const navigate = useNavigate(); // ✅ useNavigate for navigation

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
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 10,
    total: 0,
    totalPages: 0,
  });

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    class: '',
    section: '',
    status: '',
  });

  useEffect(() => {
    fetchStudents();
  }, [currentPage, filters]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await studentService.getStudents(currentPage, 10, filters);
      setStudents(response.data.students);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.message);
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
    // ✅ Navigate to student details page
    navigate(`/students/${student.id}`);
  };

  const handleFormSubmit = async (formData) => {
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

      setIsFormModalOpen(false);
      fetchStudents();
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
    setFilters({
      search: '',
      class: '',
      section: '',
      status: '',
    });
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Student Management</h2>
          <p className="text-gray-600 mt-1">Manage all students in the system</p>
        </div>
        <Button
          onClick={handleAddNew}
          className="w-[140px]" // sets fixed width
        >
          <UserPlus size={20} className="mr-2 inline" />  
          Add New Student
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
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
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
