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

  // Data state
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Pagination (single source of truth)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    position: '',
    is_active: '',
  });

  useEffect(() => {
    fetchTeachers();
  }, [currentPage, filters]);

  // -----------------------------
  // API
  // -----------------------------
  const fetchTeachers = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await teacherService.getTeachers(
        currentPage,
        10,
        filters
      );

      setTeachers(response.data.teachers || []);
      setTotalPages(response.data.pagination?.last_page || 1);
    } catch (err) {
      setError(err.message || 'Failed to fetch teachers');
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Handlers
  // -----------------------------
  const handleAddNew = () => {
    setSelectedTeacher(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = async (teacher) => {
    try {
      setFormLoading(true);
      setError('');

      const response = await teacherService.getTeacherById(teacher.id);
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

  const handleWriteToCard = async (teacher) => {
    try {
      setLoading(true); // Or use a specific writeLoading state if you prefer
      setError('');
      
      const response = await teacherService.switchToWriteMode(teacher.id);
      
      setSuccess(response.message || `Write mode initiated for ${teacher.fullName}`);
    } catch (err) {
      setError(err.message || 'Failed to initiate write mode');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setFormLoading(true);
      setError('');

      await teacherService.deleteTeacher(selectedTeacher.id);
      setSuccess('Teacher deleted successfully');
      setIsDeleteModalOpen(false);
      fetchTeachers();
    } catch (err) {
      setError(err.message || 'Failed to delete teacher');
    } finally {
      setFormLoading(false);
    }
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
        setSuccess('Teacher updated successfully');
      } else {
        await teacherService.createTeacher(formData);
        setSuccess('Teacher added successfully');
      }

      setIsFormModalOpen(false);
      fetchTeachers();
    } catch (err) {
      setError(err.message || 'Failed to save teacher');
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
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };



  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className="space-y-6 p-4 md:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Teacher Management
          </h2>
          <p className="text-gray-600">
            Manage all teachers in the system
          </p>
        </div>

        <Button onClick={handleAddNew} size="small">
          <UserPlus size={18} className="mr-2"/>
          Add New Teacher
        </Button>
      </div>

      {/* Alerts */}
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError('')}
        />
      )}

      {success && (
        <Alert
          type="success"
          message={success}
          onClose={() => setSuccess('')}
        />
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
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        writeMod ={handleWriteToCard} 
      />

      {/* Pagination */}
      {!loading && teachers.length > 0 && (
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
        title={selectedTeacher ? 'Edit Teacher' : 'Add New Teacher'}
        size="lg"
      >
        <TeacherForm
          teacher={selectedTeacher}
          loading={formLoading}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormModalOpen(false)}
        />
      </Modal>

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={formLoading}
        teacherName={
          selectedTeacher?.user
            ? `${selectedTeacher.user.first_name} ${selectedTeacher.user.last_name}`
            : ''
        }
      />
    </div>
  );
};

export default TeacherManagement;
