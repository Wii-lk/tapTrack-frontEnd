import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from '../common/Button';
import Modal from '../common/Modal'; // Assuming you have a Modal component

const DeleteAttendanceModal = ({ isOpen, onClose, onConfirm, recordInfo, loading }) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Attendance Record" size="md">
        <div className="flex">
          <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div className="ml-4 text-left">
            <h3 className="text-lg font-medium text-gray-900">
              Delete this record?
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Are you sure you want to delete the attendance record for 
                <strong className="text-gray-900"> {recordInfo?.user_name}</strong> on
                <strong className="text-gray-900"> {recordInfo?.date}</strong>?
                This action cannot be undone.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="danger" // Use your danger/red button style
            onClick={onConfirm}
            loading={loading}
          >
            Delete
          </Button>
        </div>
    </Modal>
  );
};

export default DeleteAttendanceModal;