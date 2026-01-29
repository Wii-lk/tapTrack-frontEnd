import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Edit2, Layers, BookOpen, CheckCircle, XCircle } from 'lucide-react';
import Card from '../components/common/Card';
import { gradeService } from '../services/gradeService'; // Import the service created above

const ClassManagement = () => {
  const [activeTab, setActiveTab] = useState('grades'); // 'grades' or 'subjects'
  const [loading, setLoading] = useState(true);
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    monthly_fee: '',
    parent_grade_id: '',
    is_active: true
  });

  // --- Data Fetching ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const [gradesRes, subjectsRes] = await Promise.all([
        gradeService.getAllGrades(),
        gradeService.getAllSubjects()
      ]);
      
      if (gradesRes.success) setGrades(gradesRes.data.grades);
      if (subjectsRes.success) setSubjects(subjectsRes.data.subjects);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Handlers ---
  const handleOpenModal = (item = null) => {
    if (item) {
      setEditMode(true);
      setCurrentItem(item);
      setFormData({
        name: item.name,
        description: item.description || '',
        monthly_fee: item.monthly_fee || '',
        parent_grade_id: item.parent_grade_id || '',
        is_active: item.is_active
      });
    } else {
      setEditMode(false);
      setCurrentItem(null);
      setFormData({
        name: '',
        description: '',
        monthly_fee: '',
        parent_grade_id: '',
        is_active: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response; // Store response to check success

      if (activeTab === 'grades') {
        const payload = {
          ...formData,
          monthly_fee: parseFloat(formData.monthly_fee),
          parent_grade_id: formData.parent_grade_id ? parseInt(formData.parent_grade_id) : null
        };

        if (editMode) {
          response = await gradeService.updateGrade(currentItem.id, payload);
        } else {
          response = await gradeService.createGrade(payload);
        }
      } else {
        // Subjects Logic
        const payload = {
          name: formData.name,
          description: formData.description,
          is_active: formData.is_active
        };
        response = await gradeService.createSubject(payload);
      }
      
      // Check if the service returned a success indicator
      if (response && response.success) {
        setIsModalOpen(false);
        fetchData(); // Refresh list
      } else {
        // If API returns success: false, throw error to catch block
        throw new Error(response?.message || "Operation failed on server.");
      }

    } catch (error) {
      console.error("Operation failed details:", error);
      alert(`Error: ${error.message || "Something went wrong. Please check your inputs."}`);
    }
  };

  // --- Memoized Data Helpers ---
  
  // Filter only main grades for the "Parent Grade" dropdown
  const parentGrades = useMemo(() => {
    return grades.filter(g => g.parent_grade_id === null);
  }, [grades]);

  return (
    <div className="space-y-6">
      <Card 
        title="Academic Configuration" 
        subtitle="Manage your classes, sections, and subjects"
      >
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('grades')}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors duration-200 ${
              activeTab === 'grades' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Layers size={18} />
            Classes & Sections
          </button>
          <button
            onClick={() => setActiveTab('subjects')}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors duration-200 ${
              activeTab === 'subjects' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <BookOpen size={18} />
            Subjects
          </button>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {activeTab === 'grades' ? 'Grade List' : 'Subject List'}
          </h2>
          <button
            onClick={() => handleOpenModal()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={18} />
            Add {activeTab === 'grades' ? 'Grade' : 'Subject'}
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading data...</div>
        ) : (
          <div className="overflow-x-auto">
            {/* GRADES TABLE */}
            {/* GRADES SECTION */}
            {activeTab === 'grades' && (
              <>
                {/* Mobile Cards for Grades */}
                <div className="block md:hidden space-y-3">
                  {grades.map((grade) => (
                    <div key={grade.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-800 flex items-center">
                            {grade.parent_grade_id && <span className="text-gray-400 mr-2">↳</span>}
                            {grade.name}
                          </h4>
                          <span className="text-xs text-gray-500">{grade.parent_grade_id ? 'Section' : 'Main Grade'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                             <StatusBadge isActive={grade.is_active} />
                             <button 
                                onClick={() => handleOpenModal(grade)}
                                className="p-1 text-gray-400 hover:text-blue-600 bg-gray-50 rounded"
                              >
                                <Edit2 size={16} />
                              </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 border-t border-gray-50 pt-2 mt-2">
                          <div>
                            <span className="block text-gray-400">Monthly Fee</span>
                             {grade.monthly_fee ? parseFloat(grade.monthly_fee).toFixed(2) : '-'}
                          </div>
                          <div>
                            <span className="block text-gray-400">Students</span>
                            {grade.student_count || 0}
                          </div>
                      </div>
                    </div>
                  ))}
                  {grades.length === 0 && <div className="text-center py-8 text-gray-500">No grades found.</div>}
                </div>

                {/* Desktop Table for Grades */}
                <div className="hidden md:block">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
                        <th className="p-4 border-b">Class Name</th>
                        <th className="p-4 border-b">Type</th>
                        <th className="p-4 border-b">Monthly Fee</th>
                        <th className="p-4 border-b">Students</th>
                        <th className="p-4 border-b">Status</th>
                        <th className="p-4 border-b text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {grades.map((grade) => (
                        <tr key={grade.id} className="hover:bg-gray-50 transition">
                          <td className="p-4 font-medium text-gray-800">
                            {grade.parent_grade_id && <span className="text-gray-400 mr-2">↳</span>}
                            {grade.name}
                          </td>
                          <td className="p-4 text-sm text-gray-600">
                            {grade.parent_grade_id ? 'Section' : 'Main Grade'}
                          </td>
                          <td className="p-4 text-sm text-gray-600">
                            {grade.monthly_fee ? parseFloat(grade.monthly_fee).toFixed(2) : '-'}
                          </td>
                          <td className="p-4 text-sm text-gray-600">
                            {grade.student_count || 0}
                          </td>
                          <td className="p-4">
                            <StatusBadge isActive={grade.is_active} />
                          </td>
                          <td className="p-4 text-right">
                            <button 
                              onClick={() => handleOpenModal(grade)}
                              className="text-gray-400 hover:text-blue-600"
                            >
                              <Edit2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {grades.length === 0 && (
                        <tr><td colSpan="6" className="p-8 text-center text-gray-500">No grades found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* SUBJECTS TABLE */}
            {/* SUBJECTS SECTION */}
            {activeTab === 'subjects' && (
              <>
                {/* Mobile Cards for Subjects */}
                <div className="block md:hidden space-y-3">
                  {subjects.map((subject) => (
                    <div key={subject.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-800">{subject.name}</h4>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{subject.description || 'No description'}</p>
                        </div>
                        <StatusBadge isActive={subject.is_active} />
                      </div>
                    </div>
                  ))}
                   {subjects.length === 0 && <div className="text-center py-8 text-gray-500">No subjects found.</div>}
                </div>

                {/* Desktop Table for Subjects */}
                <div className="hidden md:block">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
                        <th className="p-4 border-b">Subject Name</th>
                        <th className="p-4 border-b">Description</th>
                        <th className="p-4 border-b">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {subjects.map((subject) => (
                        <tr key={subject.id} className="hover:bg-gray-50 transition">
                          <td className="p-4 font-medium text-gray-800">{subject.name}</td>
                          <td className="p-4 text-sm text-gray-600">{subject.description || '-'}</td>
                          <td className="p-4">
                            <StatusBadge isActive={subject.is_active} />
                          </td>
                        </tr>
                      ))}
                      {subjects.length === 0 && (
                        <tr><td colSpan="3" className="p-8 text-center text-gray-500">No subjects found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}
      </Card>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-bold text-gray-800">
                {editMode ? 'Edit' : 'Add New'} {activeTab === 'grades' ? 'Grade' : 'Subject'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500">
                <XCircle size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder={activeTab === 'grades' ? "e.g., Grade 10-A" : "e.g., Mathematics"}
                />
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              {/* Specific Fields for GRADES */}
              {activeTab === 'grades' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Fee</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.monthly_fee}
                      onChange={(e) => setFormData({...formData, monthly_fee: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Parent Grade (Optional)</label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.parent_grade_id}
                      onChange={(e) => setFormData({...formData, parent_grade_id: e.target.value})}
                    >
                      <option value="">None (Main Grade)</option>
                      {parentGrades.map(pg => (
                        // Don't show current grade in dropdown if we are editing it
                        (editMode && currentItem.id === pg.id) ? null : 
                        <option key={pg.id} value={pg.id}>{pg.name}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Select if this is a section (e.g., 7-A belongs to Grade 7)</p>
                  </div>
                </>
              )}

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">Is Active</label>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editMode ? 'Update Changes' : 'Create Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper sub-component for Status
const StatusBadge = ({ isActive }) => (
  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
    isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }`}>
    {isActive ? <CheckCircle size={12} /> : <XCircle size={12} />}
    {isActive ? 'Active' : 'Inactive'}
  </span>
);

export default ClassManagement;