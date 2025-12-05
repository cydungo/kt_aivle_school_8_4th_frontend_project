import {Route, Routes} from "react-router-dom";
import MainPage from "./pages/MainPage.jsx";
import RegisterPage from "./pages/NewBookPage.jsx";

function App() {
  return (
      <Routes>
        <Route path="/" element={<MainPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
      </Routes>
  );
}

export default App;
