import { useNavigate } from 'react-router-dom';
import { LoverSetup } from '../components/LoverSetup';
import { getLoverProfileList } from '../request/api';

export function SetupPage() {
  const navigate = useNavigate();

  const handleProfileComplete = async () => {
    try {
      let userId = localStorage.getItem('userId');
      if (!userId) {
        userId = `user-${Date.now()}`;
        localStorage.setItem('userId', userId);
      }
      const loverProfiles = await getLoverProfileList(userId);
      console.log('Refreshed lover profiles:', loverProfiles);
    } catch (error) {
      console.error('Failed to refresh lovers:', error);
    }
    navigate('/lovers');
  };

  const handleBack = () => {
    navigate('/lovers');
  };

  return (
    <LoverSetup
      onComplete={handleProfileComplete}
      onBack={handleBack}
    />
  );
}
