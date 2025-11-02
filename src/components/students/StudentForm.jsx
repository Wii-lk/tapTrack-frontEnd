import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react';

const StudentForm = ({ student, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'Male',
    email: '',
    phone: '',
    address: '',
    guardianName: '',
    guardianPhone: '',
    guardianEmail: '',
    class: '',
    section: '',
    rollNumber: '',
    admissionDate: '',
    bloodGroup: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (student) {
      setFormData({
        firstName: student.firstName || '',
        lastName: student.lastName || '',
        dateOfBirth: student.dateOfBirth || '',
        gender: student.gender || 'Male',
        email: student.email || '',
        phone: student.phone || '',
        address: student.address || '',
        guardianName: student.guardianName || '',
        guardianPhone: student.guardianPhone || '',
        guardianEmail: student.guardianEmail || '',
        class: student.class || '',
        section: student.section || '',
        rollNumber: student.rollNumber || '',
        admissionDate: student.admissionDate || '',
        bloodGroup: student.bloodGroup || '',
      });
    }
  }, [student]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\+94\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be in format +94XXXXXXXXX';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }

    if (!formData.class) {
      newErrors.class = 'Class is required';
    }

    if (!formData.section) {
      newErrors.section = 'Section is required';
    }

    if (!formData.guardianName.trim()) {
      newErrors.guardianName = 'Guardian name is required';
    }

    if (!formData.guardianPhone.trim()) {
      newErrors.guardianPhone = 'Guardian phone is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="max-h-[70vh] overflow-y-auto">
      <div className="space-y-6">
        {/* Personal Information */}
        <div>
          <h4 className="text-md font-semibold text-gray-800 mb-4">
            Personal Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
              placeholder="Enter first name"
              icon={User}
            />

            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
              placeholder="Enter last name"
              icon={User}
            />

            <Input
              label="Date of Birth"
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              error={errors.dateOfBirth}
              icon={Calendar}
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <Input
              label="Blood Group"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              placeholder="e.g., O+, A+, B+"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h4 className="text-md font-semibold text-gray-800 mb-4">
            Contact Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="student@example.com"
              icon={Mail}
            />

            <Input
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              placeholder="+94771234567"
              icon={Phone}
            />

            <div className="md:col-span-2">
              <Input
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter full address"
                icon={MapPin}
              />
            </div>
          </div>
        </div>

        {/* Guardian Information */}
        <div>
          <h4 className="text-md font-semibold text-gray-800 mb-4">
            Guardian Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Guardian Name"
              name="guardianName"
              value={formData.guardianName}
              onChange={handleChange}
              error={errors.guardianName}
              placeholder="Enter guardian name"
              icon={User}
            />

            <Input
              label="Guardian Phone"
              name="guardianPhone"
              value={formData.guardianPhone}
              onChange={handleChange}
              error={errors.guardianPhone}
              placeholder="+94771234567"
              icon={Phone}
            />

            <Input
              label="Guardian Email"
              type="email"
              name="guardianEmail"
              value={formData.guardianEmail}
              onChange={handleChange}
              placeholder="guardian@example.com"
              icon={Mail}
            />
          </div>
        </div>

        {/* Academic Information */}
        <div>
          <h4 className="text-md font-semibold text-gray-800 mb-4">
            Academic Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class <span className="text-red-500">*</span>
              </label>
              <select
                name="class"
                value={formData.class}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.class ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Class</option>
                <option value="Grade 8">Grade 8</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 11">Grade 11</option>
              </select>
              {errors.class && (
                <p className="mt-1 text-sm text-red-600">{errors.class}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Section <span className="text-red-500">*</span>
              </label>
              <select
                name="section"
                value={formData.section}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.section ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Section</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
              {errors.section && (
                <p className="mt-1 text-sm text-red-600">{errors.section}</p>
              )}
            </div>

            <Input
              label="Roll Number"
              name="rollNumber"
              value={formData.rollNumber}
              onChange={handleChange}
              placeholder="Enter roll number"
            />

            <Input
              label="Admission Date"
              type="date"
              name="admissionDate"
              value={formData.admissionDate}
              onChange={handleChange}
              icon={Calendar}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-4 border-t">
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={loading}>
            {student ? 'Update Student' : 'Add Student'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudentForm;