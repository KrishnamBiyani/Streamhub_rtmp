import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import Home from "./pages/Home";
import StreamStreamHub from "./pages/StreamStreamHub";
import WatchStream from "./pages/WatchStream";
import StreamYt from "./pages/Streamyt";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Landing from "./pages/Landing";
import { Loader } from "lucide-react"; // Import Lucide loader icon

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="animate-spin text-purple-500 w-10 h-10" />
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/home"
          element={authUser ? <Home /> : <Navigate to="/signup" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUp /> : <Navigate to="/home" />}
        />
        <Route
          path="/signin"
          element={!authUser ? <SignIn /> : <Navigate to="/home" />}
        />
        <Route path="/stream/youtube" element={<StreamYt />} />
        <Route path="/stream/StreamHub" element={<StreamStreamHub />} />
        <Route path="/watchstream/:streamName" element={<WatchStream />} />
      </Routes>
    </Router>
  );
};

export default App;
