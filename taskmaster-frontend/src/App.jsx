import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

// Import your new layout and page modules
import DashboardLayout from "./components/DashboardLayout/DashBoardLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
// import Branches from "./pages/Branches/Branches"; // Uncomment when ready!

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Public Auth Pages (No Sidebar Here) --- */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- Protected App Pages (Always Shows Sidebar) --- */}
        <Route 
          element={
            <DashboardLayout />
          }
        >
          {/* All routes declared down here will inject automatically inside your layout window */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Example for your branches component:
            <Route path="/branches" element={<Branches />} /> 
          */}
        </Route>

        {/* Catch-all Fallback: Redirect invalid URLs back to Login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;