import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useWatchlist } from "../context/WatchlistContext";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
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
            Home
          </NavLink>
          <NavLink
            to="/watchlist"
            className={({ isActive }) => (isActive ? "active nav-watchlist" : "nav-watchlist")}
          >
            Watchlist
            {count > 0 && <span className="watch-count">{count}</span>}
          </NavLink>
        </div>

        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="search"
            placeholder="Search for movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>

        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          {theme === "dark" ? "Light" : "Dark"}
        </button>
      </nav>
    </header>
  );
}

export default Navbar;
