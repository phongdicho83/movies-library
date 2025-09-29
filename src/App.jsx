import { Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import Home from './pages/Home.jsx'
import MovieDetail from './pages/MovieDetail.jsx'
import ListPage from './pages/ListPage.jsx'
import './index.css'

function App() {
  return (
    <div className="app">
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          {/* Generic route for all list types */}
          <Route path="/:type/:category" element={<ListPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App;
