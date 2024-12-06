import * as React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import Login from './pages/Public/Login/Login';
import Register from './pages/Public/Register/Register';
import Dashboard from './pages/Main/Dashboard/Dashboard';
import Main from './pages/Main/Main';
import Movie from './pages/Main/Movie/Movie';
import Lists from './pages/Main/Movie/Lists/Lists';
import Form from './pages/Main/Movie/Form/Form';
import MovieDetails from './pages/Main/Movie/MovieDetails'; // New component

// Define your router and routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/main',
    element: <Main />,
    children: [
      {
        path: '/main/movies',
        element: <Movie />,
        children: [
          {
            path: '/main/movies',
            element: <Lists />,
          },
          {
            path: '/main/movies/form/:movieId?', // Allow movieId to be optional
            element: <Form />,  // Form component now handles movieId parameter
          },
          {
            path: '/main/movies/:movieId', // Movie Details Route
            element: <MovieDetails />, // This will render the movie details component
          },
          {
            path: '/main/movies/form/:movieId/cast-and-crews',
            element: (
              <h1>
                Change this for cast & crew CRUD functionality component.
              </h1>
            ),
          },
          {
            path: '/main/movies/form/:movieId/photos',
            element: (
              <h1>Change this for photos CRUD functionality.</h1>
            ),
          },
        ],
      },
    ],
  },
]);


function App() {
  return <RouterProvider router={router} />;
}

export default App;
