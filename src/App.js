import "./styles/main.scss";
// import components
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
// import pages
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductPage from "./pages/ProductDetail";
import CartPage from "./pages/Cart";
import CheckoutPage from "./pages/Checkout";
import Admin from "./pages/AdminPanel";
import Account from "./pages/Account";
import Authentication from "./pages/Authentication";
import Wishlist from "./pages/Wishlist";
import ManageProduct from "./pages/ManageProduct";
import ManageDiscount from "./pages/ManageDiscount";
import AddDiscount from "./pages/AddDiscount";
import DiscountDetail from "./pages/DiscountDetail";
import ManageProductDetail from "./pages/ManageProductDetail";
import ManageProductAdd from "./pages/ManageProductAdd";
import OrdersManagement from "./pages/OrdersManagement";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import OrderSuccess from "./pages/OrderSuccess";
import OrderDetail from "./pages/OrderDetail";
import Contact from "./pages/Contact";
import About from "./pages/About";
import ManageCategory from "./pages/ManageCategory";
import UsersTable from "./components/account/UsersTable";
import RevenueManagement from "./pages/RevenueManagement";

import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const location = useLocation();
  const showHeaderFooter = location.pathname !== "/checkout";

  return (
    <>
      {" "}
      {showHeaderFooter && <Header />}{" "}
      <Routes>
        <Route path="/" element={<Home location={location} />} />
        <Route path="/:id" element={<ProductPage />} />{" "}
        <Route path="/authentication" element={<Authentication />} />{" "}
        <Route path="/cart" element={<CartPage />} />{" "}
        <Route path="/checkout" element={<CheckoutPage />} />{" "}
        <Route path="/admin" element={<Admin />} />{" "}
        <Route path="/account" element={<Account />} />{" "}
        <Route path="/shop" element={<Shop />} />{" "}
        <Route path="/wishlist" element={<Wishlist />} />{" "}
        <Route path="/admin/products" element={<ManageProduct />} />{" "}
        <Route path="/admin/products/add" element={<ManageProductAdd />} />{" "}
        <Route
          path="/admin/products/detail/:id"
          element={<ManageProductDetail />}
        />{" "}
        <Route path="/admin/discounts" element={<ManageDiscount />} />{" "}
        <Route path="/admin/discounts/add" element={<AddDiscount />} />{" "}
        <Route
          path="/admin/discounts/detail/:id"
          element={<DiscountDetail />}
        />{" "}
        <Route path="/admin/orders" element={<OrdersManagement />} />{" "}
        <Route path="/admin/categories" element={<ManageCategory />} />{" "}
        <Route path="/admin/users" element={<UsersTable />} />{" "}
        <Route path="/admin/revenue" element={<RevenueManagement />} />{" "}
        <Route path="/forgot-password" element={<ForgotPassword />} />{" "}
        <Route path="/reset-password" element={<ResetPassword />} />{" "}
        <Route path="/order-success" element={<OrderSuccess />} />{" "}
        <Route path="/order/:orderId" element={<OrderDetail />} />{" "}
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
      </Routes>{" "}
      {showHeaderFooter && <Footer />}{" "}
      <ToastContainer position="bottom-right" autoClose={1500} />
    </>
  );
}

export default App;
