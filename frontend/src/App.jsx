import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import Home from "./pages/Home";
import StreamStreamHub from "./pages/StreamStreamHub";
import WatchStream from "./pages/WatchStream";
import StreamYt from "./pages/StreamYt";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Landing from "./pages/Landing";
import { Loader2 } from "lucide-react";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100"
        role="status"
        aria-live="polite"
      >
        <Loader2
          className="animate-spin text-indigo-400 w-8 h-8"
          aria-hidden="true"
        />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#18181b",
            color: "#f4f4f5",
            border: "1px solid #27272a",
          },
          success: { iconTheme: { primary: "#059669", secondary: "#18181b" } },
          error: { iconTheme: { primary: "#dc2626", secondary: "#18181b" } },
        }}
      />
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
    </>
  );
};

export default App;
