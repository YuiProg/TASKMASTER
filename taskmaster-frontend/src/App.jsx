import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./pages/Dashboard/Dashboard";
import NewProject from "./pages/Project/NewProject";
import Projects from "./pages/Project/Projects";
import ViewProject from "./pages/Project/ViewProject";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <Sidebar>
            <Dashboard/>
          </Sidebar>
        }/>
        <Route path="/projects/new" element={
          <Sidebar>
            <NewProject/>
          </Sidebar>
        }/>
        <Route path="/projects" element={
          <Sidebar>
            <Projects/>
          </Sidebar>
        }/>
        <Route path="/projects/:id" element={
          <Sidebar>
            <ViewProject/>
          </Sidebar>
        }/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;