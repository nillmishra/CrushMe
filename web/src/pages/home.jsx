import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-base-200 text-base-content transition-colors duration-300">
      <Navbar />
      <Outlet/>
      <Footer />

    </div>
    );
};

export default Home;