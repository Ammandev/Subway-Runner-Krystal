import './App.css';
import { Unity, useUnityContext } from "react-unity-webgl";
import { useEffect, useState, useCallback } from "react";

// Extend the Window interface to include hideLoadingScreen as optional
declare global {
  interface Window {
    hideLoadingScreen?: () => void;
    openstoreScreen?: () => void;
    opentaskScreen?: () => void;
    openfriendScreen?: () => void;
    openairdropScreen?: () => void;
    opendailyrewardScreen?: () => void;
    opensettingScreen?: () => void;
    openprofileScreen?: () => void;
    GameStart?: () => void;
    GameOver?: () => void;
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

  // Handle resizing to maintain proper scaling
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      // Dynamically adjust canvas resolution
      const canvas = document.querySelector("canvas");
      if (canvas) {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr; // Internal resolution
        canvas.height = window.innerHeight * dpr; // Internal resolution
        canvas.style.width = `${window.innerWidth}px`; // Physical screen size
        canvas.style.height = `${window.innerHeight}px`; // Physical screen size
      }
    };

    handleResize(); // Set dimensions initially
    window.addEventListener("resize", handleResize); // Listen for resize events
    return () => window.removeEventListener("resize", handleResize); // Cleanup
  }, []);

  // Function to send data to Unity after the game is loaded
  const sendTelegramDataToUnity = useCallback(() => {
    if (isLoaded) {
console.log()
     sendMessage("Data", "SetMusic","true");
sendMessage("Data", "ApiUrl", "https://game.escapedurov.com/api");
sendMessage("Data", "SetSwipe", "25");
    sendMessage("Data", "SetInitData","user=%7B%22id%22%3A185619248%2C%22first_name%22%3A%22%D0%94%D0%BC%D0%B8%D1%82%D1%80%D0%B8%D0%B9%22%2C%22last_name%22%3A%22%D0%9C%D0%B5%D1%82%D0%B5%D0%BD%D1%91%D0%B2%22%2C%22username%22%3A%22metenev%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2F3unAoV79ac9jdpHMb1mM4EmsmZux8giXZlDUE7q9tAE.svg%22%7D&chat_instance=3810165558475185912&chat_type=group&auth_date=1734350330&signature=asQ-K3ey_-krZf9JfPKtqIEJ_rGkjUcnI1MWD6W0CsYP-RgvZrMn6colOsvM7hxKaVBpZVbdoYz0_7FSz7oBBg&hash=2d7fe0b9f167aa6514cd11761aa7dc88fd2ca4a010ff5e5ab33d71614e255250");
      //sendMessage("Data", "UseTestinitData");
     // sendMessage("Data", "RefetchData");
     // sendMessage("Data", "PauseGame","true");
     // sendMessage("Data", "PauseGame","false");
    // sendMessage("Data", "SetMusic","false");
     sendMessage("Data", "SetSfx","true");
     sendMessage("Data", "SetQuality","0");//low Quality
     sendMessage("Data", "SetQuality","1");//High Quality
    // sendMessage("Data", "SetSfx","false");
  
    }
  }, [isLoaded, sendMessage]);

  // Set up canvas resolution on load
  useEffect(() => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    }
  }, []);

  // Define global functions for the window object
  useEffect(() => {
    window.hideLoadingScreen = () => {
      sendTelegramDataToUnity();
    };
    window.openstoreScreen = async () => {
      // to open store page
    };
    window.opentaskScreen = async () => {
      // to open task page
    };
    window.openfriendScreen = async () => {
      // to open friend page
    };
    window.openairdropScreen = async () => {
      // to open airdrop page
    };
    window.opendailyrewardScreen = async () => {
      // to open daily reward page
    };
    window.opensettingScreen = async () => {
      // to open setting panel
    };
    window.openprofileScreen = async () => {
      // to open profile page
    };
    window.GameStart = async () => {
      // when player start run
    };
    window.GameOver = async () => {
      // when player stop run
    };
    
    return () => {
      delete window.hideLoadingScreen;
      delete window.openstoreScreen;
      delete window.opentaskScreen;
      delete window.openfriendScreen;
      delete window.openairdropScreen;
      delete window.opendailyrewardScreen;
      delete window.opensettingScreen;
      delete window.openprofileScreen;
      delete window.GameStart;
      delete window.GameOver;
    };
  }, [sendTelegramDataToUnity]);

  return (
    <div className="App">
      <Unity
        style={{
          width: `${windowDimensions.width}px`, // Match the physical screen size
          height: `${windowDimensions.height}px`,
        }}
        unityProvider={unityProvider}
      />
    </div>
  );
}

export default App;
