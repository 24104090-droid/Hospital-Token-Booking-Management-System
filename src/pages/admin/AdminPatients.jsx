import React, { useState } from 'react';
import {
  Users,
  Search,
  Phone,
  Mail,
  MapPin,
  CalendarCheck,
  ShieldCheck
} from 'lucide-react';
import Input from '../../components/Input';

const samplePatients = [
  {
    id: 'pat-101',
    name: 'Ramesh Kumar',
    mobile: '+91 98765 43210',
    email: 'ramesh.kumar@example.com',
    age: 34,
    gender: 'Male',
    bloodGroup: 'B+',
    address: 'Palayamkottai, Tirunelveli',
    totalTokensBooked: 4,
    lastVisit: '2026-08-24'
  },
  {
    id: 'pat-102',
    name: 'Anitha Sundar',
    mobile: '+91 94432 11098',
    email: 'anitha.s@example.com',
    age: 28,
    gender: 'Female',
    bloodGroup: 'O+',
    address: 'Vannarpettai, Tirunelveli',
    totalTokensBooked: 2,
    lastVisit: '2026-08-23'
  },
  {
    id: 'pat-103',
    name: 'Muruganathan P.',
    mobile: '+91 97890 22345',
    email: 'murugan.p@example.com',
    age: 64,
    gender: 'Male',
    bloodGroup: 'A+',
    address: 'High Grounds, Tirunelveli',
    totalTokensBooked: 7,
    lastVisit: '2026-08-22'
  },
  {
    id: 'pat-104',
    name: 'Kavitha Rajendran',
    mobile: '+91 98421 99887',
    email: 'kavitha.r@example.com',
    age: 42,
    gender: 'Female',
    bloodGroup: 'AB+',
    address: 'KTC Nagar, Tirunelveli',
    totalTokensBooked: 3,
    lastVisit: '2026-08-21'
  }
];

const AdminPatients = () => {
  const [search, setSearch] = useState('');

  const filtered = samplePatients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.mobile.includes(search) ||
    p.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Patient Health Records Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Registered patient health IDs and consultation token history
          </p>
        </div>

        <div className="w-full sm:w-72">
          <Input
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={Search}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <th className="p-4">Patient Name & ID</th>
              <th className="p-4">Contact</th>
              <th className="p-4">Age / Gender / Blood</th>
              <th className="p-4">Address</th>
              <th className="p-4">Total Tokens</th>
              <th className="p-4">Last OPD Visit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/50">
                <td className="p-4">
                  <span className="font-bold text-slate-900 block">{p.name}</span>
                  <span className="font-mono text-[11px] text-slate-400">{p.id}</span>
                </td>

                <td className="p-4">
                  <span className="block font-semibold text-slate-800">{p.mobile}</span>
                  <span className="text-[11px] text-slate-400">{p.email}</span>
                </td>

                <td className="p-4">
                  <span>{p.age} yrs • {p.gender}</span>
                  <span className="block text-rose-600 font-bold">{p.bloodGroup}</span>
                </td>

                <td className="p-4 text-slate-600">
                  {p.address}
                </td>

                <td className="p-4">
                  <span className="font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full">
                    {p.totalTokensBooked} Tokens
                  </span>
                </td>

                <td className="p-4 text-slate-500 font-medium">
                  {p.lastVisit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPatients;
