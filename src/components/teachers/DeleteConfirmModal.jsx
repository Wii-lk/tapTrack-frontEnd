import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, teacherName, loading }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Teacher"
      size="md"
    >
      <div className="text-center">
        <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Delete Teacher
        </h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete <strong>{teacherName}</strong>? This action cannot be undone.
        </p>
        
        <div className="flex justify-center space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            loading={loading}
          >
            Delete Teacher
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;