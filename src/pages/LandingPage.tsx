
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Search, Shield, Users, ArrowRight, Check } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-32">
        <div className="text-center mb-20 space-y-8 animate-fade-in">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mb-6">
            Medical Remedy Finder
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Your personal assistant for finding appropriate medical remedies based on symptoms. Quick, reliable, and easy to use.
          </p>
          <div className="flex gap-6 justify-center">
            <Button
              onClick={() => navigate("/login")}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all duration-300"
              size="lg"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              onClick={() => navigate("/register")}
              variant="outline"
              size="lg"
              className="border-2 border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-lg px-8 py-6 h-auto"
            >
              Create Account
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-white/80 to-indigo-50/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-indigo-100 transform hover:scale-105 transition-transform duration-300">
            <div className="h-14 w-14 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
              <Search className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-indigo-900">Smart Search</h3>
            <p className="text-gray-600 text-lg">
              Instantly find appropriate remedies by describing your symptoms or condition.
            </p>
          </div>

          <div className="bg-gradient-to-br from-white/80 to-purple-50/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-purple-100 transform hover:scale-105 transition-transform duration-300">
            <div className="h-14 w-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-purple-900">Reliable Results</h3>
            <p className="text-gray-600 text-lg">
              Get trustworthy recommendations based on verified medical information.
            </p>
          </div>

          <div className="bg-gradient-to-br from-white/80 to-pink-50/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-pink-100 transform hover:scale-105 transition-transform duration-300">
            <div className="h-14 w-14 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
              <Users className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-pink-900">User Friendly</h3>
            <p className="text-gray-600 text-lg">
              Simple and intuitive interface designed for users of all ages.
            </p>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-br from-white/40 to-indigo-50/40 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Why Choose Medical Remedy Finder?
          </h2>
          <div className="max-w-4xl mx-auto space-y-6">
            {[
              "Quick and accurate remedy suggestions",
              "User-friendly interface for easy navigation",
              "Secure and private symptom search",
              "Regular updates with new medical information",
              "Available 24/7 for your convenience"
            ].map((benefit, index) => (
              <div 
                key={index} 
                className="flex items-center gap-4 bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-indigo-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                <div className="bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full p-2 shadow-md">
                  <Check className="h-6 w-6 text-white" />
                </div>
                <span className="text-gray-700 text-lg">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-10 text-center text-gray-600 bg-gradient-to-t from-white/30 to-transparent">
        <p className="text-lg">© {new Date().getFullYear()} Medical Remedy Finder. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
