import { Button } from '@/components/ui/button';
import { usePersona } from '@/contexts/PersonaContext';

const TestAssessmentButton = () => {
  const { resetAssessment } = usePersona();

  const handleTestAssessment = () => {
    // Clear all localStorage for testing
    localStorage.removeItem('claire-george-disability');
    localStorage.removeItem('claire-george-visited');
    // Reload to trigger fresh assessment
    window.location.reload();
  };

  return (
    <Button 
      onClick={handleTestAssessment}
      variant="outline"
      className="fixed bottom-4 right-4 z-50 bg-yellow-100 border-yellow-400 text-yellow-800 hover:bg-yellow-200"
    >
      🧪 How may I help you, in terms of disability?
    </Button>
  );
};

export default TestAssessmentButton;