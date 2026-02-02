import StatsPage from "./pages/StatsPage"
import PromodoroPage from "./pages/PromodoroPage";
import TasksPage from "./pages/TasksPage";
import { Route, Routes } from "react-router-dom";
import NavBar from "./components/navbar.tsx";


export default function App()
{


  return(
    <>
      <div>
        <h1>FocusFlow</h1>

        <NavBar />
        <Routes>
          <Route path="/" element={<TasksPage />} />
          <Route path="/promodoropage" element={<PromodoroPage />} />
          <Route path="/statspage" element={<StatsPage />} />
  
        </Routes>
      </div>
    </>
  );
}
