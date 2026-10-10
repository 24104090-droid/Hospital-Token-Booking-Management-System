import React, { useState, useMemo } from 'react';
import { useQueue } from '../context/QueueContext';
import { HospitalCard } from '../components/HospitalCard';
import { DEFAULT_LOCATION } from '../data/mockData';

export const Hospitals = () => {
  const { hospitals, selectedSpecialty, setSelectedSpecialty, selectedHealthProblem, setSelectedHealthProblem } = useQueue();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All'); // All, Government, Private
  const [selectedCrowd, setSelectedCrowd] = useState('All'); // All, Low, Medium, High
  const [sortBy, setSortBy] = useState('distance'); // distance, waitingTime, rating, availableTokens

  // Extract unique departments
  const allDepartments = useMemo(() => {
    const set = new Set();
    hospitals.forEach(h => h.departments.forEach(d => set.add(d)));
    return Array.from(set).sort();
  }, [hospitals]);

  // Filter & Sort Logic
  const filteredHospitals = useMemo(() => {
    return hospitals
      .filter(h => {
        // Search term
        const matchesSearch =
          h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          h.address.toLowerCase().includes(searchTerm.toLowerCase());

        // Type
        const matchesType = selectedType === 'All' || h.type === selectedType;

        // Crowd
        const matchesCrowd = selectedCrowd === 'All' || h.crowdLevel === selectedCrowd;

        // Department
        const matchesDept =
          !selectedSpecialty ||
          h.departments.some(d => d.toLowerCase().includes(selectedSpecialty.toLowerCase()));

        return matchesSearch && matchesType && matchesCrowd && matchesDept;
      })
      .sort((a, b) => {
        if (sortBy === 'distance') return a.distance - b.distance;
        if (sortBy === 'waitingTime') return a.waitingTime - b.waitingTime;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'availableTokens') return b.availableTokens - a.availableTokens;
        return 0;
      });
  }, [hospitals, searchTerm, selectedType, selectedCrowd, selectedSpecialty, sortBy]);

  const clearSpecialtyFilter = () => {
    setSelectedSpecialty('');
    setSelectedHealthProblem('');
  };

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      {/* Page Header */}
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h2>🏥 Hospitals & OPD Clinics in {DEFAULT_LOCATION}</h2>
          <p className="text-muted" style={{ fontSize: '0.92rem' }}>
            Compare live OPD counters, waiting times, and book official digital queue tokens.
          </p>
        </div>
      </div>

      {/* Specialty Filter Banner if active */}
      {selectedSpecialty && (
        <div
          style={{
            background: '#e0f2fe',
            border: '1px solid #7dd3fc',
            padding: '0.85rem 1.25rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          <div className="flex">
            <i className="fas fa-filter" style={{ color: '#0284c7' }}></i>
            <span>
              Filtered for <strong>{selectedSpecialty}</strong>
              {selectedHealthProblem && ` (Based on "${selectedHealthProblem}")`}
            </span>
          </div>
          <button onClick={clearSpecialtyFilter} className="btn btn-sm btn-outline-primary">
            <i className="fas fa-xmark"></i> Clear Filter & View All
          </button>
        </div>
      )}

      {/* Filter Control Bar */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
        <div className="grid-4" style={{ gap: '1rem' }}>
          {/* Search Box */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: '0.78rem' }}>Search Hospital / Area</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="e.g. TVMCH, Palayamkottai..."
                className="form-control"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '2.2rem' }}
              />
              <i
                className="fas fa-search"
                style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }}
              ></i>
            </div>
          </div>

          {/* Type Filter */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: '0.78rem' }}>Hospital Type</label>
            <select
              className="form-select"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="All">All Types (Govt & Private)</option>
              <option value="Government">Government Hospitals</option>
              <option value="Private">Private Multi-Speciality</option>
            </select>
          </div>

          {/* Department Filter */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: '0.78rem' }}>Department / Specialty</label>
            <select
              className="form-select"
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
            >
              <option value="">All Departments</option>
              {allDepartments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: '0.78rem' }}>Sort Hospitals By</label>
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="distance">Distance (Nearest First)</option>
              <option value="waitingTime">Waiting Time (Shortest First)</option>
              <option value="rating">Rating (Highest First)</option>
              <option value="availableTokens">Available Tokens (Most First)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Hospitals Listing */}
      {filteredHospitals.length > 0 ? (
        <div className="grid-2" style={{ marginBottom: '3rem' }}>
          {filteredHospitals.map((h) => (
            <HospitalCard
              key={h.id}
              hospital={h}
              highlightedDepartment={selectedSpecialty}
            />
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 1rem', marginBottom: '3rem' }}>
          <i className="fas fa-hospital-slash" style={{ fontSize: '3rem', color: 'var(--text-light)', marginBottom: '1rem' }}></i>
          <h3>No Hospitals Found</h3>
          <p className="text-muted" style={{ maxWidth: '400px', margin: '0.5rem auto 1.5rem' }}>
            No healthcare facilities matched your filters. Try resetting the department or search query.
          </p>
          <button onClick={clearSpecialtyFilter} className="btn btn-primary">
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
