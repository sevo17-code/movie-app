import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import { useWatchlist } from "../context/WatchlistContext";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { count } = useWatchlist();
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const cleaned = query.trim();
    if (!cleaned) return;
    navigate(`/search?q=${encodeURIComponent(cleaned)}`);
  };

  return (
    <header className="navbar-wrap">
      <nav className="navbar">
        <button className="logo" onClick={() => navigate("/")}>
          CineScope
        </button>

        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
            {t("nav_home")}
          </NavLink>
          <NavLink to="/top-movies" className={({ isActive }) => (isActive ? "active" : "")}>
            {t("nav_top_movies")}
          </NavLink>
          <NavLink to="/top-series" className={({ isActive }) => (isActive ? "active" : "")}>
            {t("nav_top_series")}
          </NavLink>
          <NavLink to="/explore" className={({ isActive }) => (isActive ? "active" : "")}>
            {t("nav_explore")}
          </NavLink>
          <NavLink to="/random" className={({ isActive }) => (isActive ? "active" : "")}>
            {t("nav_random")}
          </NavLink>
          <NavLink to="/world-cinema" className={({ isActive }) => (isActive ? "active" : "")}>
            {t("nav_world_cinema")}
          </NavLink>
          <NavLink to="/compare" className={({ isActive }) => (isActive ? "active" : "")}>
            {t("nav_compare")}
          </NavLink>
          <NavLink
            to="/watchlist"
            className={({ isActive }) => (isActive ? "active nav-watchlist" : "nav-watchlist")}
          >
            {t("nav_watchlist")}
            {count > 0 && <span className="watch-count">{count}</span>}
          </NavLink>
        </div>

        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="search"
            placeholder={t("nav_search_placeholder")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>

        <LanguageSwitcher />
      </nav>
    </header>
  );
}

export default Navbar;
