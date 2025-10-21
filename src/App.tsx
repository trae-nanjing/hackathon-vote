import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { MobileOptimized } from "./components/MobileOptimized";
import Home from "@/pages/Home";

export default function App() {
  return (
    <MobileOptimized>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
          <Toaster 
            position="top-center"
            toastOptions={{
              style: {
                background: '#fff',
                color: '#000',
                border: '1px solid #32f08c',
              },
            }}
          />
        </div>
      </Router>
    </MobileOptimized>
  );
}
