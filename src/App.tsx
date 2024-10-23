import './App.css';
import { Unity, useUnityContext } from "react-unity-webgl";
import { useEffect, useState, useCallback } from "react";
import useTelegramUserData from './useTelegramUserData'; // Import the custom hook to get Telegram data

// Extend the Window interface to include hideLoadingScreen as optional
declare global {
  interface Window {
    hideLoadingScreen?: () => void;
  }
}

function App() {
  const { unityProvider, sendMessage, isLoaded } = useUnityContext({
    loaderUrl: "build/Webgl.loader.js",
    dataUrl: "build/Webgl.data",
    frameworkUrl: "build/Webgl.framework.js",
    codeUrl: "build/Webgl.wasm",
  });

  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const telegramUserData = useTelegramUserData(); // Use the hook to get the actual Telegram user data

  useEffect(() => {
    function handleResize() {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Function to send the data to Unity after the game is loaded
  const sendTelegramDataToUnity = useCallback(() => {
    if (isLoaded && telegramUserData) {
      const userName = `${telegramUserData.first_name} ${telegramUserData.last_name || ''}`;
      const userId = telegramUserData.id.toString();
      sendMessage("Data", "SetUsername", `${userId},${userName}`);
      sendMessage("Data", "SetSwipe", "25");
    }
  }, [isLoaded, sendMessage, telegramUserData]);

  useEffect(() => {
    // Define the hideLoadingScreen function
    window.hideLoadingScreen = () => {
      sendTelegramDataToUnity();
    };

    return () => {
      if (window.hideLoadingScreen) {
        delete window.hideLoadingScreen;
      }
    };
  }, [sendTelegramDataToUnity]);

  return (
    <div className="App">
      <Unity
        style={{
          width: `${windowDimensions.width}px`,
          height: `${windowDimensions.height}px`,
        }}
        unityProvider={unityProvider}
      />
    </div>
  );
}

export default App;
