import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center space-y-6">
      <h1 className="text-4xl font-bold">Welcome to StreamHub</h1>
      <p className="text-lg">Choose your streaming destination:</p>

      <div className="flex space-x-4">
        <Link
          to="/stream/youtube"
          className="px-6 py-3 bg-red-600 rounded hover:bg-red-700"
        >
          🔴 Stream to YouTube
        </Link>
        <Link
          to="/stream/StreamHub"
          className="px-6 py-3 bg-blue-600 rounded hover:bg-blue-700"
        >
          🟣 Stream on StreamHub
        </Link>
      </div>
    </div>
  );
};

export default Home;
