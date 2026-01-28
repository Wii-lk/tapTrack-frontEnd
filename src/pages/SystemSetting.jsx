import React, { useState, useEffect } from 'react';
import { 
  Settings, DollarSign, Save, X, Edit2, 
  Clock, Hash, AlertCircle, Check, Loader2 
} from 'lucide-react';
import { settingsService } from '../services/settingService';

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState([]);
  const [rules, setRules] = useState([]);

  // Editing State
  const [editingKey, setEditingKey] = useState(null); 
  const [editingId, setEditingId] = useState(null);   
  const [tempValue, setTempValue] = useState('');     

  const fetchData = async () => {
    setLoading(true);
    try {
      const [settingsRes, rulesRes] = await Promise.all([
        settingsService.getAllSettings(),
        settingsService.getAllSalaryRules()
      ]);
      if (settingsRes.success) setSettings(settingsRes.data.settings || []);
      if (rulesRes.success) setRules(rulesRes.data.rules || []);
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Actions ---

  const handleSaveSetting = async (key) => {
    try {
      await settingsService.updateSetting(key, tempValue);
      setSettings(prev => prev.map(s => s.key === key ? { ...s, value: tempValue } : s));
      setEditingKey(null);
    } catch (error) {
      alert("Failed to update setting");
    }
  };

  const handleSaveRule = async (id, currentIsActive) => {
    try {
      await settingsService.updateSalaryRule(id, { 
        value: parseFloat(tempValue), 
        is_active: currentIsActive 
      });
      setRules(prev => prev.map(r => r.id === id ? { ...r, value: parseFloat(tempValue) } : r));
      setEditingId(null);
    } catch (error) {
      alert("Failed to update rule value");
    }
  };

  const handleToggleRule = async (rule) => {
    try {
      const newStatus = !rule.is_active;
      setRules(prev => prev.map(r => r.id === rule.id ? { ...r, is_active: newStatus } : r)); // Optimistic
      await settingsService.updateSalaryRule(rule.id, { 
        value: rule.value, 
        is_active: newStatus 
      });
    } catch (error) {
      setRules(prev => prev.map(r => r.id === rule.id ? { ...r, is_active: !rule.is_active } : r)); // Revert
      alert("Failed to toggle status");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">System Configuration</h1>
          <p className="text-gray-500 mt-1">Manage global application settings and financial rules</p>
        </div>
      </div>

      {/* Modern Segmented Tabs */}
      <div className="bg-gray-100 p-1 rounded-xl inline-flex w-full md:w-auto">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === 'general' 
              ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
          }`}
        >
          <Settings size={18} />
          General Settings
        </button>
        <button
          onClick={() => setActiveTab('salary')}
          className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === 'salary' 
              ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
          }`}
        >
          <DollarSign size={18} />
          Salary Rules
        </button>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Loader2 className="animate-spin mb-3" size={32} />
          <p>Loading configuration...</p>
        </div>
      ) : (
        <div className="space-y-4">
          
          {/* GENERAL SETTINGS LIST */}
          {activeTab === 'general' && settings.map((item) => (
            <SettingCard 
              key={item.key} 
              item={item} 
              isEditing={editingKey === item.key}
              tempValue={tempValue}
              onEdit={() => { setEditingKey(item.key); setTempValue(item.value); }}
              onCancel={() => setEditingKey(null)}
              onSave={() => handleSaveSetting(item.key)}
              onChange={(val) => setTempValue(val)}
            />
          ))}

          {/* SALARY RULES LIST */}
          {activeTab === 'salary' && rules.map((rule) => (
            <SalaryRuleCard 
              key={rule.id}
              rule={rule}
              isEditing={editingId === rule.id}
              tempValue={tempValue}
              onEdit={() => { setEditingId(rule.id); setTempValue(rule.value); }}
              onCancel={() => setEditingId(null)}
              onSave={() => handleSaveRule(rule.id, rule.is_active)}
              onChange={(val) => setTempValue(val)}
              onToggle={() => handleToggleRule(rule)}
            />
          ))}
          
        </div>
      )}
    </div>
  );
};

/* --- Sub Components --- */

const SettingCard = ({ item, isEditing, tempValue, onEdit, onCancel, onSave, onChange }) => {
  return (
    <div className={`group bg-white rounded-xl border transition-all duration-200 ${
      isEditing ? 'border-blue-500 ring-4 ring-blue-50 shadow-lg' : 'border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200'
    }`}>
      <div className="p-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        
        {/* Left Side: Info */}
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg ${isEditing ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
            {item.data_type === 'time' ? <Clock size={20} /> : <Hash size={20} />}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{item.description}</h3>
            <code className="text-xs text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100 mt-1 inline-block">
              {item.key}
            </code>
          </div>
        </div>

        {/* Right Side: Value & Actions */}
        <div className="w-full md:w-auto flex flex-col md:flex-row items-stretch md:items-center gap-3">
          
          {isEditing ? (
            <div className="flex items-center gap-2 w-full md:w-auto animate-in fade-in slide-in-from-right-4 duration-200">
              <input 
                type={item.data_type === 'time' ? "time" : "number"}
                step={item.data_type === 'decimal' ? "0.01" : "1"}
                value={tempValue}
                onChange={(e) => onChange(e.target.value)}
                className="w-full md:w-48 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                autoFocus
              />
              <button onClick={onSave} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                <Check size={18} />
              </button>
              <button onClick={onCancel} className="p-2 bg-white text-gray-500 border border-gray-200 rounded-lg hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors">
                <X size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
              <span className="text-lg font-medium text-gray-700 font-mono">
                {item.value}
              </span>
              <button 
                onClick={onEdit}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit Setting"
              >
                <Edit2 size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SalaryRuleCard = ({ rule, isEditing, tempValue, onEdit, onCancel, onSave, onChange, onToggle }) => {
  return (
    <div className={`group bg-white rounded-xl border transition-all duration-200 ${
      isEditing ? 'border-blue-500 ring-4 ring-blue-50 shadow-lg' : 'border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200'
    }`}>
      <div className="p-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        
        {/* Info */}
        <div className="flex items-start gap-4 flex-1">
          <div className={`p-3 rounded-lg ${rule.is_active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
            <DollarSign size={20} />
          </div>
          <div>
            {/* 🛡️ FIX 1: Add fallback for missing 'name' using 'rule_type' */}
            <h3 className="font-semibold text-gray-900">
              {rule.name || (rule.rule_type ? rule.rule_type.replace('_', ' ') : 'Unnamed Rule')}
            </h3>
            
            {/* 🛡️ FIX 2: Add safety check for missing 'calculation_type' */}
            <p className="text-sm text-gray-500 capitalize flex items-center gap-2 mt-0.5">
              Type: {(rule.calculation_type || 'standard').replace('_', ' ')}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          
          {/* Status Toggle Switch */}
          <div className="flex items-center justify-between sm:justify-start gap-3 bg-gray-50 p-2 rounded-lg border border-gray-100">
            <span className={`text-xs font-semibold uppercase tracking-wider ${rule.is_active ? 'text-green-600' : 'text-gray-400'}`}>
              {rule.is_active ? 'Active' : 'Disabled'}
            </span>
            <button 
              onClick={onToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                rule.is_active ? 'bg-green-500' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                rule.is_active ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

          {/* Edit Value Section */}
          <div className="flex items-center justify-between sm:justify-end gap-3 min-w-[200px]">
            {isEditing ? (
              <div className="flex items-center gap-2 w-full animate-in fade-in slide-in-from-right-4 duration-200">
                 <input 
                  type="number"
                  step="0.01"
                  value={tempValue}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-right font-mono"
                  autoFocus
                />
                <button onClick={onSave} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm">
                  <Check size={16} />
                </button>
                <button onClick={onCancel} className="p-2 bg-white text-gray-500 border border-gray-200 rounded-lg hover:text-red-500">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <div className="text-right">
                  <span className="block text-lg font-bold text-gray-800 font-mono">
                    {parseFloat(rule.value || 0).toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-400">Value</span>
                </div>
                <button 
                  onClick={onEdit}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors ml-2"
                >
                  <Edit2 size={18} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;