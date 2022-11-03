import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// our views
import Room from './views/room';
import Scene from './views/scene';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Room />
  },
  {
    path: 'scene',
    element: <Scene />
  }
])

function App() {
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;
