import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      {/* Hero Section */}
      <h1 className="text-4xl sm:text-6xl font-extrabold text-center mb-6 leading-tight">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          Stream Instantly <br /> to the World
        </span>{" "}
        <span>🌍</span>
      </h1>

      <p className="text-lg sm:text-xl text-gray-300 text-center mb-10 max-w-xl">
        Go live instantly from your browser. Stream to YouTube or share a custom
        link with your audience — no setup needed.
      </p>

      {/* Call to Action */}
      <button
        onClick={() => navigate("/signup")}
        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full text-lg transition-all duration-200 cursor-pointer"
      >
        Let’s Stream 🚀
      </button>
    </div>
  );
};

export default Landing;
