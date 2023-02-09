import {Routes, Route} from "react-router-dom"
import Home from "./page/home";
import Login from "./page/login";
import Profile from "./page/profile";
function App() {
 return <>
      <Routes>
        <Route path="/login" element={<Login/>} exact/>
        <Route path="/profile" element={<Profile/>} exact/>
        <Route path="/home" element={<Home/>} exact/>
      </Routes>
        </>
}

export default App;
