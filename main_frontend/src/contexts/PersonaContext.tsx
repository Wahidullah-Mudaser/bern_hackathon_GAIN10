import React, { createContext, useContext, useState, useEffect } from 'react';

export type DisabilityType = 'wheelchair' | 'low-vision' | 'cognitive' | 'anxiety' | 'dyslexia' | 'hearing' | string | null;

interface PersonaContextType {
  disabilityType: DisabilityType;
  showAssessment: boolean;
  setDisabilityType: (type: DisabilityType) => void;
  resetAssessment: () => void;
}

const PersonaContext = createContext<PersonaContextType | undefined>(undefined);

export const PersonaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [disabilityType, setDisabilityTypeState] = useState<DisabilityType>(null);
  const [showAssessment, setShowAssessment] = useState(false);

  // Load from localStorage on mount and show assessment if no preference saved
  useEffect(() => {
    const saved = localStorage.getItem('claire-george-disability');
    const hasVisited = localStorage.getItem('claire-george-visited');
    
    if (saved && saved !== 'null') {
      setDisabilityTypeState(saved as DisabilityType);
      setShowAssessment(false);
    } else if (!hasVisited) {
      // First time visitor - show assessment
      setShowAssessment(true);
      localStorage.setItem('claire-george-visited', 'true');
    }
  }, []);

  const setDisabilityType = (type: DisabilityType) => {
    setDisabilityTypeState(type);
    setShowAssessment(false);
    localStorage.setItem('claire-george-disability', type || 'null');
  };

  const resetAssessment = () => {
    setDisabilityTypeState(null);
    setShowAssessment(true);
    localStorage.removeItem('claire-george-disability');
    // Don't remove visited flag - only remove disability preference
  };

  return (
    <PersonaContext.Provider value={{ disabilityType, showAssessment, setDisabilityType, resetAssessment }}>
      <div className={`persona-${disabilityType || 'default'}`}>
        {children}
      </div>
    </PersonaContext.Provider>
  );
};

export const usePersona = () => {
  const context = useContext(PersonaContext);
  if (!context) throw new Error('usePersona must be used within PersonaProvider');
  return context;
};