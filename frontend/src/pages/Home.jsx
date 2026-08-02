import { Link, useNavigate } from "react-router-dom";
import { Radio, Youtube } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

const Home = () => {
  const { logout, isLoggingOut } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/signin");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <header className="w-full flex justify-between items-center px-6 py-4 border-b border-zinc-800">
        <h2 className="text-lg font-semibold tracking-tight text-zinc-50">
          StreamHub
        </h2>
        <Button
          variant="secondary"
          onClick={handleLogout}
          loading={isLoggingOut}
        >
          {isLoggingOut ? "Logging out..." : "Logout"}
        </Button>
      </header>

      <main className="flex flex-col items-center justify-center flex-grow text-center px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-semibold mb-4 tracking-tight text-zinc-50">
          Welcome to StreamHub
        </h1>
        <p className="text-base text-zinc-400 mb-10 max-w-xl">
          Stream directly from your browser to YouTube or host your own live
          stream with just a few clicks.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 w-full max-w-2xl">
          <Link to="/stream/youtube" className="group">
            <Card className="p-6 text-left h-full transition-colors duration-150 group-hover:border-indigo-500/60 group-focus-visible:border-indigo-500/60 group-focus-visible:ring-2 group-focus-visible:ring-indigo-400">
              <Youtube
                className="h-6 w-6 text-red-400 mb-3"
                aria-hidden="true"
              />
              <h3 className="text-base font-medium text-zinc-50 mb-1">
                Stream to YouTube
              </h3>
              <p className="text-sm text-zinc-400">
                Go live on YouTube using your stream key.
              </p>
            </Card>
          </Link>

          <Link to="/stream/StreamHub" className="group">
            <Card className="p-6 text-left h-full transition-colors duration-150 group-hover:border-indigo-500/60 group-focus-visible:border-indigo-500/60 group-focus-visible:ring-2 group-focus-visible:ring-indigo-400">
              <Radio
                className="h-6 w-6 text-indigo-400 mb-3"
                aria-hidden="true"
              />
              <h3 className="text-base font-medium text-zinc-50 mb-1">
                Stream on StreamHub
              </h3>
              <p className="text-sm text-zinc-400">
                Host your own live stream and share the link.
              </p>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Home;
