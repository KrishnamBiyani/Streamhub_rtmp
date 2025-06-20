import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import StreamStreamHub from "./pages/StreamStreamHub";
import WatchStream from "./pages/WatchStream";
import StreamYt from "./pages/Streamyt";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stream/youtube" element={<StreamYt />} />
        <Route path="/stream/StreamHub" element={<StreamStreamHub />} />
        <Route path="/watchstream/:streamName" element={<WatchStream />} />
      </Routes>
    </Router>
  );
};

export default App;
