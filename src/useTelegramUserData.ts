import { useEffect, useState } from 'react';
import WebApp from "@twa-dev/sdk";

// Define the UserData interface
interface UserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code: string;
  is_premium?: boolean;
}

const useTelegramUserData = () => {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    function getTelegramUserData() {
      if (typeof window !== 'undefined') {
        if (WebApp.initDataUnsafe && WebApp.initDataUnsafe.user) {
          // If actual Telegram data is available
          setUserData(WebApp.initDataUnsafe.user as UserData);
        } else if (process.env.NODE_ENV === 'development') {
          // For local testing or development, return sample data
          const sampleData: UserData = {
            id: 4999110,
            first_name: "Test",
            last_name: "User",
            username: "testuser",
            language_code: "en",
            is_premium: false,
          };
          setUserData(sampleData);
        }
      }
    }

    getTelegramUserData();
  }, []);

  return userData;
};

export default useTelegramUserData;
