import React, { useState, useEffect } from 'react';
import { Upload, User } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import TextArea from '../common/TextArea';

const TeacherForm = ({ teacher, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    password: '',
    gender: '',
    date_of_birth: '',
    address: '',
    photo: null,
    unique_no: '',
    email: '',
    phone_no: '',
    position: '',
    qualification: '',
    basic_salary: '',
    parent_staff_id: '',
    hire_date: '',
    is_active: true,
  });

  const [photoPreview, setPhotoPreview] = useState('');

  useEffect(() => {
    if (teacher) {
      setFormData({
        first_name: teacher.first_name || '',
        last_name: teacher.last_name || '',
        username: teacher.username || '',
        password: '',
        gender: teacher.gender || '',
        date_of_birth: teacher.date_of_birth || '',
        address: teacher.address || '',
        photo: null,
        unique_no: teacher.unique_no || '',
        email: teacher.email || '',
        phone_no: teacher.phone_no || '',
        position: teacher.position || '',
        qualification: teacher.qualification || '',
        basic_salary: teacher.basic_salary || '',
        parent_staff_id: teacher.parent_staff_id || '',
        hire_date: teacher.hire_date || '',
        is_active: teacher.is_active ?? true,
      });
    }
  }, [teacher]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
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
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 max-h-[80vh] overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Personal Information */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            Personal Information
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
              Profile Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>

        <Input
          label="First Name *"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          required
        />

        <Input
          label="Last Name *"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          required
        />

        <Input
          label="Username *"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          disabled={!!teacher}
        />

        <Input
          label="Password *"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required={!teacher}
          placeholder={teacher ? 'Leave blank to keep current password' : ''}
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
          label="Date of Birth"
          name="date_of_birth"
          type="date"
          value={formData.date_of_birth}
          onChange={handleChange}
        />

        {/* Professional Information */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            Professional Information
          </h3>
        </div>

        <Input
          label="Unique ID *"
          name="unique_no"
          value={formData.unique_no}
          onChange={handleChange}
          required
        />

        <Input
          label="Email *"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <Input
          label="Phone Number *"
          name="phone_no"
          value={formData.phone_no}
          onChange={handleChange}
          required
        />

        <Input
          label="Position"
          name="position"
          value={formData.position}
          onChange={handleChange}
        />

        <Input
          label="Basic Salary *"
          name="basic_salary"
          type="number"
          step="0.01"
          value={formData.basic_salary}
          onChange={handleChange}
          required
        />

        <Input
          label="Hire Date"
          name="hire_date"
          type="date"
          value={formData.hire_date}
          onChange={handleChange}
        />

        <div className="md:col-span-2">
          <TextArea
            label="Qualifications"
            name="qualification"
            value={formData.qualification}
            onChange={handleChange}
            rows={3}
            placeholder="Enter qualifications separated by commas"
          />
        </div>

        <div className="md:col-span-2">
          <TextArea
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={2}
          />
        </div>

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
            Active Teacher
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
          {teacher ? 'Update Teacher' : 'Create Teacher'}
        </Button>
      </div>
    </form>
  );
};

export default TeacherForm;