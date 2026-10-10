import React, { useState } from 'react';
import { mockFamilyMembers } from '../../data/mockData';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Input from '../common/Input';
import toast from 'react-hot-toast';
import { FaUsers, FaPlus, FaUser, FaTrash, FaCheck, FaHeartbeat } from 'react-icons/fa';

const FamilyMembers = () => {
  const [members, setMembers] = useState(mockFamilyMembers);
  const [showModal, setShowModal] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    relationship: 'Child',
    gender: 'Male',
    age: '',
    bloodGroup: 'O+',
    mobile: '9876543210'
  });

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMember.name) {
      toast.error('Please enter family member name');
      return;
    }
    const member = {
      id: 'fam-' + Date.now(),
      name: newMember.name,
      relationship: newMember.relationship,
      gender: newMember.gender,
      age: parseInt(newMember.age, 10) || 20,
      bloodGroup: newMember.bloodGroup,
      mobile: '+91 ' + newMember.mobile,
      isDefault: false
    };
    setMembers(prev => [...prev, member]);
    setShowModal(false);
    setNewMember({ name: '', relationship: 'Child', gender: 'Male', age: '', bloodGroup: 'O+', mobile: '9876543210' });
    toast.success(`${member.name} added to family circle!`);
  };

  const handleDelete = (id) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    toast.success('Family member removed');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <FaUsers className="text-sky-600" /> Family Health Circle
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage linked dependents to quickly book tokens for parents, spouse, or children
          </p>
        </div>
        <Button onClick={() => setShowModal(true)} size="sm" className="font-bold text-xs" icon={FaPlus}>
          Add Family Member
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {members.map((m) => (
          <Card key={m.id} className="p-4 flex flex-col justify-between border border-slate-200">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                    <FaUser size={16} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">{m.name}</h3>
                    <span className="badge badge-primary text-[9px] font-bold mt-0.5">{m.relationship}</span>
                  </div>
                </div>

                {!m.isDefault && (
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="text-slate-400 hover:text-rose-500 p-1"
                    title="Remove"
                  >
                    <FaTrash size={12} />
                  </button>
                )}
              </div>

              <div className="mt-3 bg-slate-50 p-2.5 rounded-xl text-xs space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>Age / Gender:</span>
                  <strong>{m.age} yrs • {m.gender}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Blood Group:</span>
                  <strong className="text-rose-600">{m.bloodGroup}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Contact:</span>
                  <span>{m.mobile}</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              {m.isDefault ? (
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <FaCheck /> Primary Account
                </span>
              ) : (
                <span className="text-slate-400">Dependent Member</span>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Add Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Family Member to Health Circle">
        <form onSubmit={handleAddMember} className="flex flex-col gap-4">
          <Input
            label="Full Name"
            value={newMember.name}
            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
            placeholder="e.g. Meenakshi"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Relationship</label>
              <select
                value={newMember.relationship}
                onChange={(e) => setNewMember({ ...newMember, relationship: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs bg-white"
              >
                <option value="Spouse">Spouse</option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Child">Child</option>
                <option value="Sibling">Sibling</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Gender</label>
              <select
                value={newMember.gender}
                onChange={(e) => setNewMember({ ...newMember, gender: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Age</label>
              <input
                type="number"
                value={newMember.age}
                onChange={(e) => setNewMember({ ...newMember, age: e.target.value })}
                placeholder="25"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Blood Group</label>
              <select
                value={newMember.bloodGroup}
                onChange={(e) => setNewMember({ ...newMember, bloodGroup: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs bg-white"
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="Mobile Number (Optional)"
            type="tel"
            value={newMember.mobile}
            onChange={(e) => setNewMember({ ...newMember, mobile: e.target.value })}
            placeholder="9876543210"
          />

          <Button type="submit" size="lg" className="mt-2 font-bold text-xs">
            Save Family Member
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default FamilyMembers;
