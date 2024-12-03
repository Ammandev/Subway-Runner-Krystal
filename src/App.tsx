import './App.css';
import { Unity, useUnityContext } from "react-unity-webgl";
import { useEffect, useState, useCallback } from "react";

// Extend the Window interface to include hideLoadingScreen as optional
declare global {
  interface Window {
    hideLoadingScreen?: () => void;
    openstoreScreen?: () => void;
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
    width: window.innerWidth * (window.devicePixelRatio || 1),
    height: window.innerHeight * (window.devicePixelRatio || 1),
  });
  
  useEffect(() => {
    function handleResize() {
      const dpr = window.devicePixelRatio || 1; // Ensure high DPI support
      setWindowDimensions({
        width: window.innerWidth * dpr,
        height: window.innerHeight * dpr,
      });
    }
  
    handleResize(); // Set initial dimensions
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  
  
  // Function to send the data to Unity after the game is loaded
  const sendTelegramDataToUnity = useCallback(() => {
    if (isLoaded) {
     // sendMessage("Data", "SetInitData", userDataString);
      sendMessage("Data", "UseTestinitData");
     sendMessage("Data", "SetSwipe", "25");
    // sendMessage("Data", "RefetchData");
    }
  }, [isLoaded, sendMessage]);

  useEffect(() => {
    // Define the hideLoadingScreen function
    window.hideLoadingScreen = () => {
      sendTelegramDataToUnity();
    };
    window.openstoreScreen = async () => {

  };
    return () => {
      if (window.hideLoadingScreen) {
        delete window.hideLoadingScreen;
      }
      if (window.openstoreScreen) {
        delete window.openstoreScreen;
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
