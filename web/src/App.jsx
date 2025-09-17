import Home from "./pages/home";
import {BrowserRouter as Router, Route, Routes, BrowserRouter} from "react-router-dom";

export default function App() {
  return (
    <>
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<Home />}>
        
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  );
}
