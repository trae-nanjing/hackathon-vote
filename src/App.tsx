import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { MobileOptimized } from "./components/MobileOptimized";
import Home from "@/pages/Home";
import Results from "@/pages/Results";
import Register from "@/pages/Register";

export default function App() {
  return (
    <MobileOptimized>
      <Router>
        <div className="min-h-screen bg-black text-white">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/results" element={<Results />} />
            <Route path="/register" element={<Register />} />
          </Routes>
          <Toaster 
            position="top-center"
            toastOptions={{
              style: {
                background: '#1f2937',
                color: '#fff',
                border: '1px solid #32f08c',
              },
            }}
          />
        </div>
      </Router>
    </MobileOptimized>
  );
}
