import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import MovieDetail from "./pages/MovieDetail.jsx";
import TvShowDetail from "./pages/TvShowDetail.jsx";
import PersonDetail from "./pages/PersonDetail.jsx";
import ListPage from "./pages/ListPage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import "./index.css";

function App() {
  const location = useLocation();

  useEffect(() => {
    console.log("Route changed to:", location.pathname);
  }, [location]);

  return (
    <div className="app">
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/tv/:id" element={<TvShowDetail />} />
          <Route path="/person/:id" element={<PersonDetail />} />
          <Route path="/search" element={<SearchPage />} />
          {/* Specific route for People page */}
          <Route
            path="/person/popular"
            element={<ListPage type="person" category="popular" />}
          />
          {/* Generic route for other list types */}
          <Route path="/:type/:category" element={<ListPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
