import { useState, useEffect } from "react";
import { Cake, User, Lock, ArrowRight } from "lucide-react";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useToast } from "../components/ui/Toast";
import { loginAdmin } from "../api/endpoints";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await loginAdmin(username, password);

      if (response?.access) {
        localStorage.setItem("accessToken", response.access);
        localStorage.setItem("refreshToken", response.refresh);

        showToast("Login successful! Welcome back.", "success");
        navigate("/orders");
      } else {
        const errorMsg = response?.detail || "Invalid credentials. Please try again.";
        setError(errorMsg);
        showToast(errorMsg, "error");
      }
    } catch {
      const errorMsg = "Login failed. Please check your connection.";
      setError(errorMsg);
      showToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zm-mintCream/30 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-zm-deepTeal text-white mb-4 shadow-lg shadow-zm-deepTeal/20">
            <Cake size={32} />
          </div>
          <h1 className="font-heading text-4xl text-zm-stoneBrown mb-2">
            ZMade Cakes
          </h1>
          <p className="text-zm-greyOlive">Admin Dashboard Login</p>
        </div>

        <Card className="shadow-xl border-zm-greyOlive/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={error}
                autoFocus
              />
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={error}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg"
              isLoading={loading}
            >
              Login to Dashboard <ArrowRight size={18} className="ml-2" />
            </Button>
          </form>
        </Card>

        <p className="text-center mt-8 text-xs text-zm-greyOlive/40">
          © 2026 ZMade Cakes Kuwait • Secure System
        </p>
      </div>
    </div>
  );
}
