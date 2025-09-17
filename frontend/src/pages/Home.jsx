import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const Home = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-6 py-4 flex flex-col">
      {/* Header */}
      <header className="w-full flex justify-between items-center px-4 py-3 border-b border-gray-800">
        <h2 className="text-xl font-bold tracking-wide text-purple-400 font-serif">
          StreamHub
        </h2>
        <button
          onClick={handleLogout}
          className="bg-gray-800 hover:bg-gray-700 text-sm px-4 py-2 rounded shadow-sm transition duration-200 cursor-pointer"
        >
          Logout
        </button>
      </header>

      {/* Main Section */}
      <main className="flex flex-col items-center justify-center flex-grow text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight font-serif">
          Welcome to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
            StreamHub
          </span>
        </h1>
        <p className="text-lg text-gray-400 mb-10 max-w-xl">
          Stream directly from your browser to YouTube or host your own live
          stream with just a few clicks.
        </p>

        <div className="flex gap-6 flex-wrap justify-center">
          <Link
            to="/stream/youtube"
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded text-lg font-medium shadow-lg transition duration-200"
          >
            🔴 Stream to YouTube
          </Link>
          <Link
            to="/stream/StreamHub"
            className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded text-lg font-medium shadow-lg transition duration-200"
          >
            🟣 Stream on StreamHub
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Home;
