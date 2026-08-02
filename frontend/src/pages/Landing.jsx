import { useNavigate } from "react-router-dom";
import { Radio } from "lucide-react";
import Button from "../components/ui/Button";
import { useAuthStore } from "../store/useAuthStore";

const Landing = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center px-4">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-400">
        <Radio className="h-7 w-7" aria-hidden="true" />
      </div>

      <h1 className="text-4xl sm:text-5xl font-semibold text-center mb-4 leading-tight text-zinc-50">
        Stream instantly to the world
      </h1>

      <p className="text-base sm:text-lg text-zinc-400 text-center mb-10 max-w-xl">
        Go live straight from your browser. Stream to YouTube or share a
        custom link with your audience — no setup needed.
      </p>

      <Button onClick={() => navigate(authUser ? "/home" : "/signup")}>
        Get started
      </Button>
    </div>
  );
};

export default Landing;
