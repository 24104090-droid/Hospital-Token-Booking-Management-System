import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Building2, GitCompare, ArrowRight, Search, X } from 'lucide-react';
import { HospitalContext } from '../../context/HospitalContext';
import HospitalCard from '../../components/HospitalCard';
import FilterPanel from '../../components/FilterPanel';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import Button from '../../components/Button';
import { getHospitals } from '../../services/hospitalService';
import { diseaseMapping } from '../../data/diseaseMapping';
import { DEFAULT_LOCATION } from '../../utils/constants';

const Hospitals = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const querySearch = searchParams.get('search') || '';

  const {
    selectedDisease,
    setSelectedDisease,
    filters,
    setFilters,
    selectedCity,
    compareList,
    clearCompare
  } = useContext(HospitalContext);

  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localSearch, setLocalSearch] = useState(querySearch);

  const specialty = selectedDisease ? diseaseMapping[selectedDisease] : '';

  useEffect(() => {
    const fetchHospitalsList = async () => {
      setLoading(true);
      try {
        const data = await getHospitals({
          disease: selectedDisease,
          filters: { ...filters, location: selectedCity },
          search: localSearch
        });
        setHospitals(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to load hospitals for this criteria.');
      } finally {
        setLoading(false);
      }
    };

    fetchHospitalsList();
  }, [selectedDisease, filters, selectedCity, localSearch]);

  const handleClearFilter = () => {
    setSelectedDisease('');
    setLocalSearch('');
    setFilters({});
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
              Hospital Directory
            </span>
            {selectedDisease && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold bg-sky-50 text-sky-700 px-2 py-0.5 rounded-md border border-sky-200">
                Condition: {selectedDisease} ({specialty})
                <button onClick={() => setSelectedDisease('')} className="hover:text-red-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {specialty ? `${specialty} Clinics in ${selectedCity || DEFAULT_LOCATION}` : `Hospitals in ${selectedCity || DEFAULT_LOCATION}`}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {hospitals.length} medical centers with live OPD token booking
          </p>
        </div>

        {/* Search in page */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search hospitals..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Compare floating badge */}
      {compareList.length > 0 && (
        <div className="bg-indigo-900 text-white p-3.5 rounded-2xl mb-6 flex items-center justify-between shadow-lg animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2 text-xs">
            <GitCompare className="w-4 h-4 text-indigo-300" />
            <span>
              <strong>{compareList.length}</strong> hospital(s) selected for comparison
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearCompare}
              className="text-xs text-indigo-200 hover:text-white px-2 py-1"
            >
              Clear
            </button>
            <Link to="/compare">
              <Button variant="primary" size="sm" className="bg-white text-indigo-900 hover:bg-indigo-50 font-bold">
                <span>Compare Now</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Filter panel */}
      <FilterPanel />

      {/* Content */}
      {loading ? (
        <LoadingSpinner message="Filtering hospital queues in Tirunelveli..." />
      ) : error ? (
        <div className="p-6 bg-red-50 text-red-700 rounded-2xl text-center text-sm font-medium">
          {error}
        </div>
      ) : hospitals.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No Hospitals Found"
          message="No hospitals currently match your filter selections. Try clearing filters to view all clinics."
          actionLabel="Clear Filters"
          onAction={handleClearFilter}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hospitals.map((hospital) => (
            <HospitalCard
              key={hospital.id}
              hospital={hospital}
              highlightedSpecialty={specialty}
              onViewDetails={() => navigate(`/hospitals/${hospital.id}`)}
              onBookToken={() => navigate(`/book-token?hospitalId=${hospital.id}&dept=${encodeURIComponent(specialty || 'General Medicine')}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Hospitals;
