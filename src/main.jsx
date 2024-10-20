import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "./main.css"
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ErrorPage from './error-page.jsx'
import { ThemeContextProvider } from './theme/ThemeContextProvider.jsx'
import CartContextProvider from './CartContext.jsx'
import MyCart from './MyCart.jsx'
import MyOrder from './MyOrder.jsx'
import MyShelf from './Myshelf.jsx'
import ReadBook from './ReadBook.jsx'
import CreateBook from './CreateBook.jsx'
import UserTransactions from './UserTransactions.jsx'
import { AuthContextProvider } from './auth/AuthContext.jsx'
import RequireAuth from './auth/RequireAuth.jsx'
import Book from './Book.jsx'
import AdminBook from './AdminBook.jsx'
import UpdateBook from './UpdateBook.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element:
      <RequireAuth role={[0, 2]}>
        <App />
      </RequireAuth>
    ,
    errorElement: <ErrorPage />,
  },
  {
    path: "/mycart",
    element:
      <RequireAuth role={[2]}>
        <MyCart />
      </RequireAuth>
    ,
    errorElement: <ErrorPage />,
  },
  {
    path: "/myorder",
    element:
      <RequireAuth role={[2]}>
        <MyOrder />
      </RequireAuth>
    ,
    errorElement: <ErrorPage />,
  },
  {
    path: "/myshelf",
    element:
      <RequireAuth role={[2]}>
        <MyShelf />
      </RequireAuth>
    ,
    errorElement: <ErrorPage />,
  },
  {
    path: "/readBook/:bookID",
    element:
      <RequireAuth role={[2]}>
        <ReadBook />
      </RequireAuth>
    ,
    errorElement: <ErrorPage />,
  },
  {
    path: "/book/:bookID",
    element:
      <RequireAuth role={[0, 2]}>
        <Book />
      </RequireAuth>
    ,
    errorElement: <ErrorPage />,
  },
  {
    path: "/createbook",
    element:
      <RequireAuth role={[1]}>
        <CreateBook />
      </RequireAuth>
    ,
    errorElement: <ErrorPage />,
  },
  {
    path: "/usertransactions",
    element:
      <RequireAuth role={[1]}>
        <UserTransactions />
      </RequireAuth>
    ,
    errorElement: <ErrorPage />,
  },
  {
    path: "/admin/book",
    element:
      <RequireAuth role={[1]}>
        <AdminBook />
      </RequireAuth>
    ,
    errorElement: <ErrorPage />,
  },
  {
    path: "/admin/updatebook/:bookID",
    element:
      <RequireAuth role={[1]}>
        <UpdateBook />
      </RequireAuth>
    ,
    errorElement: <ErrorPage />,
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartContextProvider>
      <ThemeContextProvider>
        <AuthContextProvider>
          <RouterProvider router={router} />
          {/* <App />
      </RouterProvider> */}
        </AuthContextProvider>
      </ThemeContextProvider>
    </CartContextProvider>
  </StrictMode>
)
