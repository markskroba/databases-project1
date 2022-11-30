import { Link, Switch, Route, BrowserRouter as Router, Routes } from "react-router-dom"
import Course from "./Course";
import Home from "./Home";
import Professor from "./Professor";
import './App.css'
import Search from "./Search";
import Level from "./Level";
import Attribute from "./Attribute";
import MeetingDays from "./MeetingDays";

function App() {


  return (
    <Router>
      <>
        <Link to="/">Home</Link>
      </>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/professor/:professorName" element={<Professor />} />
        <Route path="/course/:courseID" element={<Course />} />
        <Route path="/search" element={<Search />} />
        <Route path="/level/:level_name" element={<Level />} />
        <Route path="/attribute/:attr_name" element={<Attribute />} />
        <Route path="/meetings/days/:days" element={<MeetingDays />} />

      </Routes>
    </Router>
  );
}

export default App;
