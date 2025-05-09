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
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import OrderSuccess from "./pages/OrderSuccess";

import { Routes, Route, useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  const showHeaderFooter = location.pathname !== "/checkout";

  return (
    <>
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
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/order-success" element={<OrderSuccess />} />
      </Routes>{" "}
      {showHeaderFooter && <Footer />}{" "}
    </>
  );
}

export default App;
