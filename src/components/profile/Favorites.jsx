import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useHospital } from '../../context/HospitalContext';
import HospitalCard from '../hospitals/HospitalCard';
import Card from '../common/Card';
import { FaHeart, FaHospital } from 'react-icons/fa';

const Favorites = () => {
  const navigate = useNavigate();
  const { favorites, hospitals } = useHospital();

  const favoriteHospitals = hospitals.filter(h => favorites.includes(h.id));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <FaHeart className="text-rose-500" /> Saved Hospitals
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quick access to your bookmarked Tirunelveli healthcare centers
          </p>
        </div>
        <span className="badge badge-primary font-bold text-xs">
          {favoriteHospitals.length} Saved
        </span>
      </div>

      {favoriteHospitals.length === 0 ? (
        <Card className="p-12 text-center text-slate-400">
          <FaHeart size={36} className="mx-auto mb-2 opacity-30 text-rose-400" />
          <p className="text-sm font-semibold">No saved hospitals yet</p>
          <p className="text-xs text-slate-400 mt-1">Click the heart icon on any hospital card to save it here</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteHospitals.map((hosp) => (
            <HospitalCard
              key={hosp.id}
              hospital={hosp}
              onSelect={() => navigate(`/hospital/${hosp.id}`)}
              onBook={() => navigate(`/book?hospitalId=${hosp.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
