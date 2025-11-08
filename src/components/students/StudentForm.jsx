import React, { useEffect, useState } from 'react';import { Upload, User, Mail, Phone, MapPin, Calendar, Lock, Hash, UserCheck } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import TextArea from '../common/TextArea';

// --- ADDED ---
// Helper to get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper to create the initial empty state (matching API snake_case)
const getInitialState = () => ({
  first_name: '',
  last_name: '',
  username: '',
  password: '',
  gender: '',
  date_of_birth: '',
  address: '',
  photo: null,
  unique_no: '',
  parent_name: '',
  parent_nic: '',
  parent_phone: '',
  grade_id: '',
  enrollment_date: getTodayDate(), // <-- MODIFIED: Prefills today's date
  is_active: true,
});

// Mock grades list. In a real app, you'd fetch this from an API.
const MOCK_GRADES = [
  { id: 1, name: 'Grade 1-A' },
  { id: 2, name: 'Grade 1-B' },
  { id: 3, name: 'Grade 5-B' },
  { id: 5, name: 'Grade 6-A' },
  { id: 6, name: 'Grade 7-A' },
  { id: 9, name: 'Grade 9-B' },
  { id: 10, name: 'Grade 10-A' },
];

const StudentForm = ({ student, onSubmit, onCancel, loading }) => {
  // The form's internal state uses snake_case, matching the API
  const [formData, setFormData] = useState(getInitialState());
  const [photoPreview, setPhotoPreview] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (student) {
      // *** CORRECTED: Load form from the snake_case fields on the normalized student prop ***
      setFormData({
        first_name: student.first_name || '',
        last_name: student.last_name || '',
        username: student.username || '', 
        password: '', // Always blank on edit
        gender: student.gender || '',
        date_of_birth: student.date_of_birth || '',
        address: student.address || '',
        photo: null, // Always reset file input
        unique_no: student.unique_no || '', 
        parent_name: student.parent_name || '', 
        parent_nic: student.parent_nic || '',
        parent_phone: student.parent_phone || '',
        grade_id: student.grade_id || '',
        enrollment_date: student.enrollment_date || '', // This will override the default
        is_active: student.is_active ?? true,
      });
      setPhotoPreview(student.photoUrl || ''); // Show existing photo
    } else {
      // Reset form for "Add New" (this will have today's date)
      setFormData(getInitialState());
      setPhotoPreview('');
    }
  }, [student]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.last_name) newErrors.last_name = 'Last name is required';
    if (!formData.unique_no) newErrors.unique_no = 'Student ID is required';
    if (!formData.username) newErrors.username = 'Username is required';
    if (!student && !formData.password) newErrors.password = 'Password is required for new students';
    if (!formData.parent_name) newErrors.parent_name = 'Parent name is required';
    if (!formData.parent_phone) newErrors.parent_phone = 'Parent phone is required';
    if (!formData.grade_id) newErrors.grade_id = 'Grade is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, photo: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({ ...prev, photo: null }));
      setPhotoPreview(student ? student.photoUrl : ''); // Revert to old photo or empty
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // *** CORRECTED: Send different data formats for Create vs Edit ***

    if (student) {
      // --- EDIT MODE (Update) ---
      // Convert the snake_case state into FormData
      const formDataForApi = new FormData();
      for (const key in formData) {
        if (key === 'photo' && formData.photo) {
          if (formData.photo instanceof File) {
            formDataForApi.append('photo', formData.photo);
          }
        } else if (key === 'password' && !formData.password) {
            // Don't send empty password on update
        } else if (formData[key] !== null && formData[key] !== undefined) {
          // Convert boolean to string for FormData
          let value = formData[key];
          if (typeof value === 'boolean') {
            value = value ? 1 : 0;
          }
          formDataForApi.append(key, value);
        }
      }
      // Pass the FormData object to the parent for UPDATE
      onSubmit(formDataForApi);

    } else {
      // --- CREATE MODE ---
      // Pass the plain JavaScript state object to the parent for CREATE
      // The service layer will stringify this as JSON
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 max-h-[80vh] overflow-y-auto p-1">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        
        {/* --- Personal Information --- */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            Student Information
          </h3>
        </div>

        {/* Photo Upload */}
        <div className="md:col-span-2 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-shrink-0">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Preview"
                className="h-16 w-16 md:h-20 md:w-20 rounded-full object-cover"
              />
            ) : (
              <div className="h-16 w-16 md:h-20 md:w-20 bg-gray-200 rounded-full flex items-center justify-center">
                <User size={20} className="text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Photo (Optional - only for edit)
            </label>
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleFileChange}
              // Photo is only for update, so disable if not in edit mode
              disabled={!student} 
              className="block w-full text-sm text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
            />
          </div>
        </div>

        <Input
          label="First Name *"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          error={errors.first_name}
          icon={User}
        />
        <Input
          label="Last Name *"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          error={errors.last_name}
          icon={User}
        />
        <Input
          label="Student ID (Unique No) *"
          name="unique_no"
          value={formData.unique_no}
          onChange={handleChange}
          error={errors.unique_no}
          icon={Hash}
        />
        <Input
          label="Date of Birth *"
          name="date_of_birth"
          type="date"
          value={formData.date_of_birth}
          onChange={handleChange}
          error={errors.date_of_birth}
          icon={Calendar}
        />
         <Select
          label="Gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </Select>
        <Input
          label="Enrollment Date"
          name="enrollment_date"
          type="date"
          value={formData.enrollment_date}
          onChange={handleChange}
          icon={Calendar}
        />
        <div className="md:col-span-2">
          <TextArea
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={2}
            icon={MapPin}
          />
        </div>

        {/* --- Login Information --- */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            Login Information
          </h3>
        </div>
        <Input
          label="Username *"
          name="username"
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
          disabled={!!student} // Disable username on edit
          icon={UserCheck}
        />
        <Input
          label={student ? "New Password" : "Password *"}
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required={!student}
          placeholder={student ? 'Leave blank to keep current password' : ''}
          error={errors.password}
          icon={Lock}
        />

        {/* --- Parent Information --- */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            Parent / Guardian Information
          </h3>
        </div>
        <Input
          label="Parent Name *"
          name="parent_name"
          value={formData.parent_name}
          onChange={handleChange}
          error={errors.parent_name}
          icon={User}
        />
        <Input
          label="Parent Phone *"
          name="parent_phone"
          value={formData.parent_phone}
          onChange={handleChange}
          error={errors.parent_phone}
          icon={Phone}
        />
        <Input
          label="Parent NIC"
          name="parent_nic"
          value={formData.parent_nic}
          onChange={handleChange}
          icon={Hash}
        />

        {/* --- Academic Information --- */}
        <div className="md:col-row-2">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            Academic Information
          </h3>
        </div>
        <Select
          label="Grade *"
          name="grade_id"
          value={formData.grade_id}
          onChange={handleChange}
          error={errors.grade_id}
        >
          <option value="">Select Grade</option>
          {MOCK_GRADES.map(grade => (
            <option key={grade.id} value={grade.id}>{grade.name}</option>
          ))}
        </Select>
        
        {/* Status */}
        <div className="md:col-span-2 flex items-center">
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Active Student
          </label>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          loading={loading}
          className="w-full sm:w-auto"
        >
          {student ? 'Update Student' : 'Create Student'}
        </Button>
      </div>
    </form>
  );
};

export default StudentForm;