import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// our views
import Room from './views/room';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Room />
  },
  {
    path: 'scene',
    element: (<>the scene</>)
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
