import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="w-full flex justify-between items-center p-4 bg-white shadow">
      <h1 className="text-xl font-bold">To-Do App</h1>
      <Button variant="destructive" onClick={handleLogout}><LogOut className="mr-2" />Logout</Button>
    </div>
  );
}