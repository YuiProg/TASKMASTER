import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./pages/Dashboard/Dashboard";
import NewProject from "./pages/Project/NewProject";
import Projects from "./pages/Project/Projects";
import ViewProject from "./pages/Project/ViewProject";
import Tasks from "./pages/Tasks/MyTasks";
import ViewTask from "./pages/Tasks/ViewTask";
import NewTask from "./pages/Tasks/NewTask";
import OpenTasks from "./pages/Tasks/OpenTasks";
import UserProjects from "./pages/Project/UserProjects";

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
        <Route path="/projects/my-projects" element={
          <Sidebar>
            <UserProjects/>
          </Sidebar>
        }/>
        <Route path="/projects/:id" element={
          <Sidebar>
            <ViewProject/>
          </Sidebar>
        }/>
        <Route path="/tasks/my-tasks" element={
          <Sidebar>
            <Tasks/>
          </Sidebar>
        }/>
        <Route path="/tasks/view/:id" element={
          <Sidebar>
            <ViewTask/>
          </Sidebar>
        }/>
        <Route path="/tasks/new" element={
          <Sidebar>
            <NewTask/>
          </Sidebar>
        }/>
        <Route path="/tasks/open-tasks" element={
          <Sidebar>
            <OpenTasks/>
          </Sidebar>
        }/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;