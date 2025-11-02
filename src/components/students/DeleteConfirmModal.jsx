import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from '../common/Button';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, studentName, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all">
          <div className="p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <AlertTriangle className="text-red-600" size={24} />
            </div>

            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              Delete Student
            </h3>

            <p className="text-sm text-gray-600 text-center mb-6">
              Are you sure you want to delete <strong>{studentName}</strong>?
              This action cannot be undone and all associated data will be permanently removed.
            </p>

            <div className="flex space-x-4">
              <Button
                variant="secondary"
                onClick={onClose}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={onConfirm}
                loading={loading}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;