import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="brand">TMDB Clone</Link>
        <div className="search">
          <input type="text" placeholder="Search movies (coming soon)" disabled />
        </div>
      </div>
    </header>
  )
}
