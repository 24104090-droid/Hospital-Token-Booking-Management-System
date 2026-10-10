import React, { createContext, useState, useEffect, useContext } from 'react';
import { familyService } from '../services/familyService';

export const FamilyContext = createContext();

export const FamilyProvider = ({ children }) => {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      const data = await familyService.getMembers();
      setFamilyMembers(data);
    } catch (err) {
      console.error('Failed to load family members:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const addMember = async (memberData) => {
    const created = await familyService.addMember(memberData);
    await fetchMembers();
    return created;
  };

  const updateMember = async (id, memberData) => {
    await familyService.updateMember(id, memberData);
    await fetchMembers();
  };

  const deleteMember = async (id) => {
    await familyService.deleteMember(id);
    await fetchMembers();
  };

  return (
    <FamilyContext.Provider
      value={{
        familyMembers,
        loading,
        addMember,
        updateMember,
        deleteMember,
        refreshMembers: fetchMembers
      }}
    >
      {children}
    </FamilyContext.Provider>
  );
};

export const useFamily = () => useContext(FamilyContext);
export default FamilyContext;
