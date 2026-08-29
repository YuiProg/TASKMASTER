import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import AuthFlow from "./pages/Auth/AuthFlow";
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
import Archive from "./pages/Project/Archive";
import CreateSprint from "./pages/Sprint/CreateSprint";
import ViewSprint from "./pages/Sprint/ViewSprint";
import SprintDetails from "./pages/Sprint/SprintDetails";
import Settings from "./pages/Settings/Settings";
import ViewTodos from "./pages/Todos/ViewTodos";
import CreateTodo from "./pages/Todos/CreateTodo";
import TodoDetail from "./pages/Todos/TodoDetail";
import ServerErrorPage from "./pages/Error/ServerErrorPage";

const AUTH_PATHS = ["/", "/register", "/forgot-password"];

function AppRoutes() {
  const location = useLocation();

  // Rendered from a single stable element so switching between the three
  // auth paths never unmounts/remounts React — AuthFlow observes the
  // pathname itself and animates between views internally.
  if (AUTH_PATHS.includes(location.pathname)) {
    return <AuthFlow />;
  }

  return (
    <Routes>
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
        <Route path="/projects/archived" element={
          <Sidebar>
            <Archive/>
          </Sidebar>
        }/>
        <Route path="/sprint/create/:projectId" element={
          <Sidebar>
            <CreateSprint/>
          </Sidebar>
        }/>
        <Route path="/sprint" element={
          <Sidebar>
            <ViewSprint/>
          </Sidebar>
        }/>
        <Route path="/sprint/view/:id" element={
          <Sidebar>
            <SprintDetails/>
          </Sidebar>
        }/>
        <Route path="/settings" element={
          <Sidebar>
            <Settings/>
          </Sidebar>
        }/>
        <Route path="/todos" element={
          <Sidebar>
            <ViewTodos/>
          </Sidebar>
        }/>
        <Route path="/todos/create" element={
          <Sidebar>
            <CreateTodo/>
          </Sidebar>
        }/>
        <Route path="/todos/view/:id" element={
          <Sidebar>
            <TodoDetail/>
          </Sidebar>
        }/>
        <Route path="/error" element={<ServerErrorPage/>}/>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;