import { useEffect, useState } from "react";
import WebApp from "@twa-dev/sdk";

const useTelegramInitData = () => {
  const [initData, setInitData] = useState<string | null>(null);

  useEffect(() => {
    function getTelegramInitData() {
      if (typeof window !== "undefined") {
        if (WebApp.initData) {
          // Get the raw initData provided by Telegram
          setInitData(WebApp.initData);
        } else if (process.env.NODE_ENV === "development") {
          // Sample data for local testing or development
          const sampleInitData =
            "query_id=AAEqgltwAAAAACqCW3DKG8av&user=%7B%22id%22%3A1885045290%2C%22first_name%22%3A%22Muhammad%22%2C%22last_name%22%3A%22Amman%22%2C%22username%22%3A%22ammandev%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FI_HYpR0ACQ7U_d3EH8m2T0L2ezsKLJVAJT2fq-7Q-HE.svg%22%7D&auth_date=1732980764&signature=xeUgXWgxCnO9Liko6gPvbkyohHuGS9eUI_PKBMAZOndW3C1SoluUFOzLCUb-qLyPvblRCkxI1JBTU9ti3alkBw&hash=131323df31a3b4d2a5a278b9c5da79f38377cd8e5d93f67a59152ea61f035870";
          setInitData(sampleInitData);
        }
      }
    }

    getTelegramInitData();
  }, []);

  return initData;
};
export default useTelegramInitData;