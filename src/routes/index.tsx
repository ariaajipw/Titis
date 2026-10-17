import { createBrowserRouter } from 'react-router'
import { HomePage } from './HomePage'
import { NotFoundPage } from './NotFoundPage'

// Rute publik minimum dirancang di ARCHITECTURE §7.1; halaman lengkap dikerjakan pada Phase 2 (TITIS-211).
export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
