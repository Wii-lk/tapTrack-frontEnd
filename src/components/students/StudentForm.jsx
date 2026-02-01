import React, { useEffect, useState } from 'react';
import { User, Calendar, MapPin, Lock, Hash, UserCheck } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import TextArea from '../common/TextArea';
import Modal from '../common/Modal';
import { gradeService } from '../../services/gradeService';
import RFIDPrompt from './RFIDprompt';

// Helper to get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Initial empty state
const getInitialState = () => ({
  first_name: '',
  last_name: '',
  username: '',
  password: '',
  gender: '',
  date_of_birth: '',
  address: '',
  photo: null,
  parent_name: '',
  parent_nic: '',
  parent_phone: '',
  grade_id: '',
  enrollment_date: getTodayDate(),
  is_active: true,
});

const StudentForm = ({ student, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState(getInitialState());
  const [photoPreview, setPhotoPreview] = useState('');
  const [errors, setErrors] = useState({});
  const [showRFIDModal, setShowRFIDModal] = useState(false);

  // Grades state
  const [grades, setGrades] = useState([]);
  const [loadingGrades, setLoadingGrades] = useState(false);

  // Fetch Grades
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        setLoadingGrades(true);
        const response = await gradeService.getAllGrades({ is_active: true });
        if (response.success) setGrades(response.data.grades);
      } catch (error) {
        console.error("Failed to load grades", error);
      } finally {
        setLoadingGrades(false);
      }
    };
    fetchGrades();
  }, []);

  // Populate form for editing
  useEffect(() => {
    if (student) {
      setFormData({
        first_name: student.first_name || '',
        last_name: student.last_name || '',
        username: student.username || '',
        password: '',
        gender: student.gender || '',
        date_of_birth: student.date_of_birth || '',
        address: student.address || '',
        photo: null,
        parent_name: student.parent_name || '',
        parent_nic: student.parent_nic || '',
        parent_phone: student.parent_phone || '',
        grade_id: student.grade_id || '',
        enrollment_date: student.enrollment_date || '',
        is_active: student.is_active ?? true,
      });
      setPhotoPreview(student.photoUrl || '');
    } else {
      setFormData(getInitialState());
      setPhotoPreview('');
    }
  }, [student]);

  // Auto-generate username & password for new students
  useEffect(() => {
    if (!student) {
      const { first_name, last_name, date_of_birth } = formData;
      if (first_name && last_name && date_of_birth) {
        const cleanFirst = first_name.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
        const cleanLast = last_name.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
        const cleanDob = date_of_birth.replace(/-/g, '');
        setFormData(prev => ({
          ...prev,
          username: `${cleanFirst}${cleanLast}_${cleanDob}_phoenix@edu.com`,
          password: `${cleanFirst}${cleanLast}@${cleanDob}`,
        }));
      }
    }
  }, [formData.first_name, formData.last_name, formData.date_of_birth, student]);

  // Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.last_name) newErrors.last_name = 'Last name is required';
    if (!formData.username) newErrors.username = 'Username is required';
    if (!student && !formData.password) newErrors.password = 'Password is required';
    if (!formData.parent_name) newErrors.parent_name = 'Parent name is required';
    if (!formData.parent_phone) newErrors.parent_phone = 'Parent phone is required';
    if (!formData.grade_id) newErrors.grade_id = 'Grade is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, photo: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({ ...prev, photo: null }));
      setPhotoPreview(student ? student.photoUrl : '');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    let payload;
    if (student) {
      payload = new FormData();
      for (const key in formData) {
        if (key === 'photo' && formData.photo instanceof File) {
          payload.append('photo', formData.photo);
        } else if (key === 'password' && !formData.password) {
          // skip empty password
        } else if (formData[key] !== undefined && formData[key] !== null) {
          payload.append(key, typeof formData[key] === 'boolean' ? (formData[key] ? 1 : 0) : formData[key]);
        }
      }
    } else {
      payload = formData;
    }

    // Call parent's onSubmit and show RFID modal after success
    onSubmit(payload, () => setShowRFIDModal(true));
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 max-h-[80vh] overflow-y-auto p-1">
        {/* Personal Information */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Student Information</h3>
        </div>

        {/* Photo Upload */}
        <div className="md:col-span-2 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-shrink-0">
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" className="h-16 w-16 md:h-20 md:w-20 rounded-full object-cover" />
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
              disabled={!student} 
              className="block w-full text-sm text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
            />
          </div>
        </div>

        <Input label="First Name *" name="first_name" value={formData.first_name} onChange={handleChange} error={errors.first_name} icon={User} />
        <Input label="Last Name *" name="last_name" value={formData.last_name} onChange={handleChange} error={errors.last_name} icon={User} />
        <Input label="Date of Birth *" name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} error={errors.date_of_birth} icon={Calendar} />
        <Select label="Gender" name="gender" value={formData.gender} onChange={handleChange}>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </Select>
        <Input label="Enrollment Date" name="enrollment_date" type="date" value={formData.enrollment_date} onChange={handleChange} icon={Calendar} />
        <div className="md:col-span-2">
          <TextArea label="Address" name="address" value={formData.address} onChange={handleChange} rows={2} icon={MapPin} />
        </div>

        {/* Login Information */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Login Information</h3>
        </div>
        <Input
          label="Username * (Auto-generated)"
          name="username"
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
          disabled={!!student}
          icon={UserCheck}
          placeholder="firstname.lastname_dob_phoenix@edu.com"
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

        {/* Parent Information */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Parent / Guardian Information</h3>
        </div>
        <Input label="Parent Name *" name="parent_name" value={formData.parent_name} onChange={handleChange} error={errors.parent_name} icon={User} />
        <Input label="Parent Phone *" name="parent_phone" value={formData.parent_phone} onChange={handleChange} error={errors.parent_phone} icon={Calendar} />
        <Input label="Parent NIC" name="parent_nic" value={formData.parent_nic} onChange={handleChange} icon={Hash} />

        {/* Academic Information */}
        <Select label={loadingGrades ? "Loading Grades..." : "Grade *"} name="grade_id" value={formData.grade_id} onChange={handleChange} error={errors.grade_id} disabled={loadingGrades}>
          <option value="">Select Grade</option>
          {grades.map(grade => <option key={grade.id} value={grade.id}>{grade.name}</option>)}
        </Select>

        {/* Status */}
        <div className="md:col-span-2 flex items-center">
          <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
          <label className="ml-2 block text-sm text-gray-900">Active Student</label>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button type="submit" loading={loading} className="w-full sm:w-auto">
            {student ? 'Update Student' : 'Create Student'}
          </Button>
        </div>
      </form>

      {/* RFID Modal */}
  <RFIDPrompt isOpen={showRFIDModal} onClose={() => {
  setShowRFIDModal(false);
  onCancel(); // Close main form modal after RFID
}} />

    </>
  );
};

export default StudentForm;
