import './App.css';
import { Unity, useUnityContext } from "react-unity-webgl";
import { useEffect, useState, useCallback } from "react";
import useTelegramInitData from './useTelegramUserData'; // Import the custom hook to get Telegram data

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

  const telegramInitData = useTelegramInitData(); // Use the hook to get initData

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
    if (isLoaded && telegramInitData) {
      const userDataString = decodeURIComponent((telegramInitData)); // Convert user data to string
      console.log(userDataString);
      sendMessage("Data", "SetInitData", userDataString);
      sendMessage("Data", "SetSwipe", "25");
    }
  }, [isLoaded, sendMessage, telegramInitData]);

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