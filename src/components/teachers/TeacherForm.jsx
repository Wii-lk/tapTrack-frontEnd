import React, { useState, useEffect } from 'react';
import { Upload, User, Hash, Mail, Phone, Calendar, Briefcase, MapPin, Lock, UserCheck } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import TextArea from '../common/TextArea';

// Helper to get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper to create the initial empty state
const getInitialState = () => ({
  first_name: '',
  last_name: '',
  username: '',
  password: '',
  gender: '',
  date_of_birth: '',
  address: '',
  photo: null,
  // unique_no: '',      // Existing RFID/Unique ID
  // employee_no: '',    // <--- NEW FIELD
  email: '',
  phone_no: '',
  position: '',
  qualification: '',
  basic_salary: '',
  parent_staff_id: '',
  hire_date: getTodayDate(),
  is_active: 1,
});

const TeacherForm = ({ teacher, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState(getInitialState());
  const [photoPreview, setPhotoPreview] = useState('');

  useEffect(() => {
    if (teacher) {
      // Edit Mode: Populate form with teacher data
      setFormData({
        first_name: teacher.firstName || '',
        last_name: teacher.lastName || '',
        username: teacher.username || '',
        password: '', // Always blank on edit
        gender: teacher.gender || '',
        date_of_birth: teacher.date_of_birth || '',
        address: teacher.address || '',
        photo: null, 
        // unique_no: teacher.unique_no || '',
        // employee_no: teacher.employee_no || '', // <--- Load from prop
        email: teacher.email || '',
        phone_no: teacher.phone || '',
        position: teacher.designation || '',
        qualification: teacher.qualification || '',
        basic_salary: teacher.basic_salary || '',
        parent_staff_id: teacher.parent_staff_id || '',
        hire_date: teacher.hire_date || '',
        // Handle status conversion (Active/Inactive string -> 1/0)
        is_active: teacher.status === 'active' || teacher.is_active === true || teacher.is_active === 1 ? 1 : 0,
      });
      setPhotoPreview(''); // Clear preview or set to existing URL if you have it
    } else {
      // Create Mode: Reset form
      setFormData(getInitialState());
      setPhotoPreview('');
    }
  }, [teacher]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value,
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
    } else {
      setFormData(prev => ({ ...prev, photo: null }));
      setPhotoPreview('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 max-h-[80vh] overflow-y-auto p-1">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        
        {/* --- SECTION 1: PERSONAL INFORMATION --- */}
        <div className="md:col-span-2 border-b border-gray-100 pb-2 mb-2">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <User size={20} className="text-blue-600" />
            Personal Information
          </h3>
        </div>

        {/* Photo Upload */}
        <div className="md:col-span-2 flex flex-col sm:flex-row items-center gap-4 mb-4">
          <div className="flex-shrink-0">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Preview"
                className="h-20 w-20 rounded-full object-cover border-4 border-gray-50 shadow-sm"
              />
            ) : (
              <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300">
                <Upload size={24} className="text-gray-400" />
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
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
          </div>
        </div>

        <Input
          label="First Name *"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          required
          icon={User}
        />

        <Input
          label="Last Name *"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          required
          icon={User}
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

        {/* --- SECTION 2: LOGIN CREDENTIALS --- */}
        <div className="md:col-span-2 border-b border-gray-100 pb-2 mb-2 mt-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Lock size={20} className="text-blue-600" />
            Login Credentials
          </h3>
        </div>

        <Input
          label="Username *"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          disabled={!!teacher} // Disable username edit
          icon={UserCheck}
        />

        <Input
          label={teacher ? "New Password" : "Password *"}
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required={!teacher}
          placeholder={teacher ? 'Leave blank to keep current password' : ''}
          icon={Lock}
        />

        {/* --- SECTION 3: PROFESSIONAL DETAILS --- */}
        <div className="md:col-span-2 border-b border-gray-100 pb-2 mb-2 mt-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Briefcase size={20} className="text-blue-600" />
            Professional Details
          </h3>
        </div>

        {/* 🟢 NEW FIELD: Employee ID */}
        {/* <Input
          label="Employee ID *"
          name="employee_no"
          value={formData.employee_no}
          onChange={handleChange}
          required
          placeholder="e.g. EMP-001"
          icon={Hash}
        /> */}

        {/* Conditionally Show Unique ID (RFID) only in edit mode */}
        {/* {!!teacher && (
          <Input
            label="Unique ID (System/RFID)"
            name="unique_no"
            value={formData.unique_no}
            onChange={handleChange}
            disabled={true} 
            icon={Hash}
          />
        )} */}

        <Input
          label="Email Address *"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          icon={Mail}
        />

        <Input
          label="Phone Number *"
          name="phone_no"
          value={formData.phone_no}
          onChange={handleChange}
          required
          icon={Phone}
        />

        <Input
          label="Position / Designation"
          name="position"
          value={formData.position}
          onChange={handleChange}
          placeholder="e.g. Senior Teacher"
          icon={Briefcase}
        />

        <Input
          label="Basic Salary (LKR) *"
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
          icon={Calendar}
        />

        <div className="md:col-span-2">
          <TextArea
            label="Qualifications"
            name="qualification"
            value={formData.qualification}
            onChange={handleChange}
            rows={3}
            placeholder="Enter academic degrees, certifications, etc."
          />
        </div>

        {/* Status Toggle */}
        <div className="md:col-span-2 bg-gray-50 p-3 rounded-lg flex items-center border border-gray-200">
          <input
            type="checkbox"
            id="is_active"
            name="is_active"
            checked={formData.is_active === 1}
            onChange={handleChange}
            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
          />
          <label htmlFor="is_active" className="ml-3 block text-sm font-medium text-gray-900 cursor-pointer select-none">
            Active Staff Member
            <span className="block text-xs text-gray-500 font-normal">
              Disable this to restrict system access without deleting the record.
            </span>
          </label>
        </div>

      </div>

      {/* Form Actions */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 mt-6 border-t border-gray-100">
        <Button
          type="button"
          variant="secondary"
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
          {teacher ? 'Update Staff Member' : 'Create Staff Member'}
        </Button>
      </div>
    </form>
  );
};

export default TeacherForm;