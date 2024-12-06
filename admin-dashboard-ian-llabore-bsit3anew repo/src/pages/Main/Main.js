import { useEffect } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import './Main.css';

function Main() {
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/');
  };

  useEffect(() => {
    if (!accessToken) {
      handleLogout();
    }
  }, [accessToken]);

  return (
    <div className="Main">
      <div className="container">
        <nav className="navigation">
          <ul>
            <li>
              <button className="movies-btn">
                <Link to="/main/movies" className="nav-link">Movies</Link>
              </button>
            </li>
            <li className="logout">
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </li>
          </ul>
        </nav>
        <div className="outlet">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Main;
