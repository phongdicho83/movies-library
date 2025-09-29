import { Link, NavLink } from 'react-router-dom'
import './Header.css'

const navs = {
  Movies: {
    popular: 'Popular',
    upcoming: 'Upcoming',
    'top-rated': 'Top Rated',
  },
  'TV Shows': {
    popular: 'Popular',
    'on-tv': 'On TV',
    'top-rated': 'Top Rated',
  },
}

export default function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="brand">
          TMDB Clone
        </Link>

        <nav>
          <ul className="main-nav">
            {Object.entries(navs).map(([label, links]) => (
              <li key={label} className="nav-item">
                <span className="nav-link">{label}</span>
                <div className="dropdown">
                  {Object.entries(links).map(([path, text]) => (
                    <NavLink
                      key={path}
                      to={`/${label.toLowerCase().replace(' ', '')}/${path}`}
                      className="dropdown-link"
                    >
                      {text}
                    </NavLink>
                  ))}
                </div>
              </li>
            ))}
            <li className="nav-item">
              <NavLink to="/person/popular" className="nav-link">
                People
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="search">
          <input type="text" placeholder="Search..." />
        </div>
      </div>
    </header>
  )
}
