import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users2,
  UserPlus,
  Trash2,
  HeartPulse,
  Ticket,
  Plus,
  ShieldCheck,
  X
} from 'lucide-react';
import { FamilyContext } from '../../context/FamilyContext';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Select from '../../components/Select';
import LoadingSpinner from '../../components/LoadingSpinner';

const Family = () => {
  const navigate = useNavigate();
  const { familyMembers, loading, addMember, deleteMember } = useContext(FamilyContext);

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    relationship: 'Parent',
    age: '',
    gender: 'Male',
    bloodGroup: 'B+',
    conditions: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.age) return;

    setSubmitting(true);
    try {
      await addMember({
        ...formData,
        age: Number(formData.age)
      });
      setShowAddModal(false);
      setFormData({
        name: '',
        relationship: 'Parent',
        age: '',
        gender: 'Male',
        bloodGroup: 'B+',
        conditions: ''
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Users2 className="w-3.5 h-3.5" /> Family Health Directory
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Family Member Health Profiles
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Book instant OPD queue tokens on behalf of your parents, spouse, or children
          </p>
        </div>

        <Button variant="primary" size="md" onClick={() => setShowAddModal(true)}>
          <UserPlus className="w-4 h-4 mr-1.5" /> Add Family Member
        </Button>
      </div>

      {/* Family Cards Grid */}
      {loading ? (
        <LoadingSpinner message="Loading family health profiles..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {familyMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
                    {member.relationship}
                  </span>
                  <button
                    onClick={() => deleteMember(member.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Remove Profile"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-lg font-black text-slate-900 mb-1">{member.name}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                  <span>Age: <strong>{member.age} yrs</strong></span>
                  <span>•</span>
                  <span>Gender: <strong>{member.gender}</strong></span>
                  <span>•</span>
                  <span>Blood: <strong className="text-rose-600 font-bold">{member.bloodGroup}</strong></span>
                </div>

                {member.conditions && (
                  <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200/60 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-0.5">
                      Known Medical Conditions
                    </span>
                    <p className="text-xs text-amber-900 font-medium">{member.conditions}</p>
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => navigate(`/book-token?patient=${encodeURIComponent(member.name)}`)}
                >
                  <Ticket className="w-4 h-4 mr-1.5 text-sky-600" />
                  Book OPD Token for {member.name.split(' ')[0]}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-1">Add Family Member</h3>
            <p className="text-xs text-slate-500 mb-6">
              Create a digital profile to reserve OPD tokens for your dependent.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <Input
                label="Full Name"
                placeholder="e.g. Suresh Kumar"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Relationship"
                  value={formData.relationship}
                  onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                  options={[
                    { value: 'Father', label: 'Father' },
                    { value: 'Mother', label: 'Mother' },
                    { value: 'Spouse', label: 'Spouse' },
                    { value: 'Child', label: 'Child / Dependent' },
                    { value: 'Sibling', label: 'Sibling' },
                    { value: 'Other', label: 'Other Relative' }
                  ]}
                />
                <Input
                  label="Age"
                  type="number"
                  placeholder="58"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Gender"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  options={[
                    { value: 'Male', label: 'Male' },
                    { value: 'Female', label: 'Female' },
                    { value: 'Other', label: 'Other' }
                  ]}
                />
                <Select
                  label="Blood Group"
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  options={[
                    { value: 'A+', label: 'A+' },
                    { value: 'A-', label: 'A-' },
                    { value: 'B+', label: 'B+' },
                    { value: 'B-', label: 'B-' },
                    { value: 'O+', label: 'O+' },
                    { value: 'O-', label: 'O-' },
                    { value: 'AB+', label: 'AB+' }
                  ]}
                />
              </div>

              <Input
                label="Chronic Conditions / Allergies (Optional)"
                placeholder="e.g. Diabetes, Penicillin Allergy"
                value={formData.conditions}
                onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
              />

              <div className="flex gap-2 pt-3">
                <Button variant="ghost" size="md" className="flex-1" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="md" className="flex-1" disabled={submitting}>
                  {submitting ? 'Adding...' : 'Save Profile'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Family;
