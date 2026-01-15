import { useLocation } from "react-router-dom";
import { Construction } from "lucide-react";

const PlaceholderPage = () => {
  const location = useLocation();
  const pageName = location.pathname.split("/").filter(Boolean).join(" / ");

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
      <div className="w-20 h-20 rounded-2xl gradient-secondary flex items-center justify-center mb-6">
        <Construction className="w-10 h-10 text-secondary-foreground" />
      </div>
      <h1 className="text-2xl font-bold text-foreground capitalize mb-2">
        {pageName.replace(/-/g, " ") || "Page"}
      </h1>
      <p className="text-muted-foreground max-w-md">
        This module is under development. Check back soon for updates!
      </p>
    </div>
  );
};

export default PlaceholderPage;
