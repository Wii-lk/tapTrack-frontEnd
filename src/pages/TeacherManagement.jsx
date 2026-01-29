import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import Pagination from '../components/common/Pagination';
import Alert from '../components/common/Alert';
import TeacherFilters from '../components/teachers/TeacherFilters';
import TeacherTable from '../components/teachers/TeacherTable';
import TeacherForm from '../components/teachers/TeacherForm';
import DeleteConfirmModal from '../components/teachers/DeleteConfirmModal';
import teacherService from '../services/teacherService';

const TeacherManagement = () => {
  const navigate = useNavigate();

  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

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
    position: '',
    is_active: '',
  });

  useEffect(() => {
    fetchTeachers();
  }, [currentPage, filters]);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await teacherService.getTeachers(currentPage, 10, filters);

      setTeachers(response.data.teachers || []); 
      setPagination(response.data.pagination || {});
    } catch (err) {
      setError(err.message || 'Failed to fetch teachers');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setSelectedTeacher(null);
    setIsFormModalOpen(true);
  };

  // UPDATED: Fetch full teacher details when editing
  const handleEdit = async (teacher) => {
    try {
      setFormLoading(true);
      setError('');
      
      // Fetch full teacher details by ID
      const response = await teacherService.getTeacherById(teacher.id);
      
      // Set the full teacher data
      setSelectedTeacher(response.data);
      setIsFormModalOpen(true);
    } catch (err) {
      setError(err.message || 'Failed to fetch teacher details');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = (teacher) => {
    setSelectedTeacher(teacher);
    setIsDeleteModalOpen(true);
  };

  const handleView = (teacher) => {
    navigate(`/teachers/${teacher.id}`);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      setError('');

      if (selectedTeacher) {
        await teacherService.updateTeacher(selectedTeacher.id, formData);
        setSuccess('Teacher updated successfully!');
      } else {
        await teacherService.createTeacher(formData);
        setSuccess('Teacher added successfully!');
      }

      setIsFormModalOpen(false);
      fetchTeachers();
    } catch (err) {
      setError(err.message || 'Failed to save teacher');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setFormLoading(true);
      setError('');
      await teacherService.deleteTeacher(selectedTeacher.id);
      setSuccess('Teacher deleted successfully!');
      setIsDeleteModalOpen(false);
      fetchTeachers();
    } catch (err) {
      setError(err.message || 'Failed to delete teacher');
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
      position: '',
      is_active: '',
    });
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 pt-4 sm:pt-0">
        <div className="text-left">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Teacher Management</h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage all teachers in the system</p>
        </div>
        <Button
          onClick={handleAddNew}
          className="w-full sm:w-auto"
        >
          <UserPlus size={18} className="mr-2 inline" />
          Add New Teacher
        </Button>
      </div>

      {/* Alerts */}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && (
        <Alert type="success" message={success} onClose={() => setSuccess('')} />
      )}

      {/* Filters */}
      <TeacherFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Table */}
      <TeacherTable
        teachers={teachers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        loading={loading}
      />

      {/* Pagination */}
      {!loading && teachers.length > 0 && (
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
        title={selectedTeacher ? 'Edit Teacher' : 'Add New Teacher'}
        size="lg"
      >
        {formLoading && !selectedTeacher ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <TeacherForm
            teacher={selectedTeacher}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormModalOpen(false)}
            loading={formLoading}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        teacherName={selectedTeacher ? `${selectedTeacher.first_name} ${selectedTeacher.last_name}` : ''}
        loading={formLoading}
      />
    </div>
  );
};

export default TeacherManagement;