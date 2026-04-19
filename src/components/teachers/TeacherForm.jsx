import React, { useState, useEffect } from "react";
import {
  Upload,
  User,
  Hash,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  MapPin,
  Lock,
  UserCheck,
} from "lucide-react";
import Button from "../common/Button";
import Input from "../common/Input";
import Select from "../common/Select";
import TextArea from "../common/TextArea";

// Helper to get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Helper to create the initial empty state
const getInitialState = () => ({
  first_name: "",
  last_name: "",
  username: "",
  password: "",
  gender: "",
  date_of_birth: "",
  address: "",
  photo: null,
  unique_no: "", 
  employee_no: "", 
  email: "",
  phone_no: "",
  position: "",
  qualification: "",
  basic_salary: "",
  parent_staff_id: "",
  type: "permanent",
  hire_date: getTodayDate(),
  is_active: 1,
});

const TeacherForm = ({ teacher, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState(getInitialState());
  const [photoPreview, setPhotoPreview] = useState("");
  
  // NEW: Local state for the split Employee ID
  const [empPrefix, setEmpPrefix] = useState("TPS-PER-");
  const [empNum, setEmpNum] = useState("");

  useEffect(() => {
    if (teacher) {
      // Logic to split the existing employee_no into prefix and number
      let prefix = "TPS-PER-";
      let num = "";
      
      if (teacher.employee_no) {
        if (teacher.employee_no.startsWith("TPS-TEM-")) {
          prefix = "TPS-TEM-";
          num = teacher.employee_no.replace("TPS-TEM-", "");
        } else if (teacher.employee_no.startsWith("TPS-PER-")) {
          prefix = "TPS-PER-";
          num = teacher.employee_no.replace("TPS-PER-", "");
        } else if (teacher.employee_no.startsWith("TPS-")) {
           // Handle legacy data if it just says TPS-
          prefix = "TPS-PER-";
          num = teacher.employee_no.replace("TPS-", "");
        } else {
          num = teacher.employee_no;
        }
      }

      setEmpPrefix(prefix);
      setEmpNum(num);

      setFormData({
        first_name: teacher.firstName || "",
        last_name: teacher.lastName || "",
        username: teacher.username || "",
        password: "", 
        gender: teacher.gender || "",
        date_of_birth: teacher.date_of_birth || "",
        address: teacher.address || "",
        photo: null,
        unique_no: teacher.unique_no || "",
        employee_no: prefix + num, // Ensure it syncs
        email: teacher.email || "",
        phone_no: teacher.phone || "",
        position: teacher.designation || "",
        qualification: teacher.qualification || "",
        basic_salary: teacher.basic_salary || "",
        parent_staff_id: teacher.parent_staff_id || "",
        type: teacher.type || "permanent",
        hire_date: teacher.hire_date || getTodayDate(),
        is_active:
          teacher.status === "active" ||
          teacher.is_active === true ||
          teacher.is_active === 1
            ? 1
            : 0,
      });
      setPhotoPreview("");
    } else {
      setFormData(getInitialState());
      setEmpPrefix("TPS-PER-");
      setEmpNum("");
      setPhotoPreview("");
    }
  }, [teacher]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };

  // NEW: Handlers for the custom Employee ID fields
  const handleEmpPrefixChange = (e) => {
    const newPrefix = e.target.value;
    setEmpPrefix(newPrefix);
    setFormData((prev) => ({ ...prev, employee_no: newPrefix + empNum }));
  };

  const handleEmpNumChange = (e) => {
    const newNum = e.target.value;
    setEmpNum(newNum);
    setFormData((prev) => ({ ...prev, employee_no: empPrefix + newNum }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, photo: null }));
      setPhotoPreview("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 md:space-y-6 max-h-[80vh] overflow-y-auto p-1"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        
        {/* --- SECTION 1: PERSONAL INFORMATION --- */}
        <div className="md:col-span-2 border-b border-gray-100 pb-2 mb-2">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <User size={20} className="text-blue-600" />
            Personal Information
          </h3>
        </div>

        {/* ==========================================
            HIDDEN FOR SIMPLICITY: PHOTO UPLOAD 
        ========================================== */}
        {/* <div className="md:col-span-2 flex flex-col sm:flex-row items-center gap-4 mb-4">
          <div className="flex-shrink-0">
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" className="h-20 w-20 rounded-full object-cover border-4 border-gray-50 shadow-sm" />
            ) : (
              <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300">
                <Upload size={24} className="text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
          </div>
        </div> 
        */}

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

        {/* ==========================================
            HIDDEN FOR SIMPLICITY: GENDER
        ========================================== */}
        {/* <Select label="Gender" name="gender" value={formData.gender} onChange={handleChange}>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </Select> 
        */}

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

        {/* ==========================================
            HIDDEN FOR SIMPLICITY: LOGIN CREDENTIALS
        ========================================== */}
        {/* <div className="md:col-span-2 border-b border-gray-100 pb-2 mb-2 mt-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Lock size={20} className="text-blue-600" />
            Login Credentials
          </h3>
        </div>

        <Input label="Username *" name="username" value={formData.username} onChange={handleChange} required disabled={!!teacher} icon={UserCheck} />
        
        <Input label={teacher ? "New Password" : "Password *"} name="password" type="password" value={formData.password} onChange={handleChange} required={!teacher} placeholder={teacher ? "Leave blank to keep current password" : ""} icon={Lock} /> 
        */}

        {/* --- SECTION 3: PROFESSIONAL DETAILS --- */}
        <div className="md:col-span-2 border-b border-gray-100 pb-2 mb-2 mt-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Briefcase size={20} className="text-blue-600" />
            Professional Details
          </h3>
        </div>

        <Select
          label="Employment Type *"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        >
          <option value="permanent">Permanent</option>
          <option value="temporary">Temporary</option>
        </Select>

        {/* 🟢 NEW CUSTOM EMPLOYEE ID FIELD 🟢 */}
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Employee ID *
          </label>
          <div className="flex items-center rounded-md border border-gray-300 shadow-sm bg-white focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 overflow-hidden">
            <select
              value={empPrefix}
              onChange={handleEmpPrefixChange}
              className="bg-gray-50 border-none border-r border-gray-300 py-2.5 pl-3 pr-8 text-sm text-gray-700 focus:ring-0 focus:outline-none cursor-pointer h-full"
            >
              <option value="TPIS-">TPIS-</option>
              <option value="TPIS-PRO-">TPIS-PRO-</option>
              <option value="TPIS-TMP-">TPIS-TMP-</option>
            </select>
            <div className="pl-3 pr-2 text-gray-400">
              <Hash size={18} />
            </div>
            <input
              type="text"
              value={empNum}
              onChange={handleEmpNumChange}
              required
              placeholder="00012"
              className="flex-1 block w-full py-2.5 px-2 border-none focus:ring-0 sm:text-sm text-gray-900 bg-transparent placeholder-gray-400"
            />
          </div>
        </div>

        {!!teacher && (
          <Input
            label="Unique ID (System/RFID)"
            name="unique_no"
            value={formData.unique_no}
            onChange={handleChange}
            disabled={true}
            icon={Hash}
          />
        )}

        <Input
          label="Email Address *"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          icon={Mail}
        />

        {/* ==========================================
            HIDDEN FOR SIMPLICITY: PHONE, POSITION, QUALIFICATIONS
        ========================================== */}
        {/* <Input label="Phone Number *" name="phone_no" value={formData.phone_no} onChange={handleChange} required icon={Phone} /> 
        */}

        {/* <Input label="Position / Designation" name="position" value={formData.position} onChange={handleChange} placeholder="e.g. Senior Teacher" icon={Briefcase} /> 
        */}

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

        {/* <div className="md:col-span-2">
          <TextArea label="Qualifications" name="qualification" value={formData.qualification} onChange={handleChange} rows={3} placeholder="Enter academic degrees, certifications, etc." />
        </div> 
        */}

        {/* Status Toggle */}
        <div className="md:col-span-2 bg-gray-50 p-3 rounded-lg flex items-center border border-gray-200 mt-4">
          <input
            type="checkbox"
            id="is_active"
            name="is_active"
            checked={formData.is_active === 1}
            onChange={handleChange}
            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
          />
          <label
            htmlFor="is_active"
            className="ml-3 block text-sm font-medium text-gray-900 cursor-pointer select-none"
          >
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
        <Button type="submit" loading={loading} className="w-full sm:w-auto">
          {teacher ? "Update Staff Member" : "Create Staff Member"}
        </Button>
      </div>
    </form>
  );
};

export default TeacherForm;