import { useEffect, useState } from 'react';
import WebApp from "@twa-dev/sdk";

const useTelegramInitData = () => {
  const [initData, setInitData] = useState<string | null>(null);

  useEffect(() => {
    function getTelegramInitData() {
      if (typeof window !== 'undefined') {
        if (WebApp.initData) {
          // Get the raw initData provided by Telegram
          setInitData(WebApp.initData);
        } else if (process.env.NODE_ENV === 'development') {
          // For local testing or development, return sample data
          const sampleInitData = "id=4999110&first_name=Test&last_name=User&username=testuser&language_code=en&is_premium=false";
          setInitData(sampleInitData);
        }
      }
    }

    getTelegramInitData();
  }, []);

  return initData;
};

export default useTelegramInitData;