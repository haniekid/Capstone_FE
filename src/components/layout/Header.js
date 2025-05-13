import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../assets/icons/icons";
import { useLocation } from "react-router-dom";
import { useCart } from "../../utils/hooks/useCart";
import { useWishlist } from "../../utils/hooks/useWishlist";
import { searchProducts } from "../../store/reducers/productSlice";

function Header() {
    const location = useLocation();
    const { quantity } = useCart();
    const { wishlistCount } = useWishlist();
    const dispatch = useDispatch();

    const isHome = location.pathname === "/";
    const isShop = location.pathname === "/shop";

    return ( <
        nav >
        <
        div className = "header-second" >
        <
        div className = "header-second-msg" >
        <
        p >
        <
        span > CHẾ BIẾN < /span> VỆ SINH, AN TOÀN, HỢP VỆ SINH{" "} <
        /p>{" "} <
        p >
        <
        span > MIỄN PHÍ < /span> SHIPPING ĐỐI VỚI HÓA ĐƠN TRÊN 200.000Đ{" "} <
        /p>{" "} <
        p >
        <
        span > GIAO HÀNG < /span> NHANH CHÓNG TRONG VÒNG 60 PHÚT{" "} <
        /p>{" "} <
        /div>{" "} <
        /div>{" "} <
        div className = "header-container" >
        <
        Link className = "header-main header-section"
        to = "/" >
        <
        img src = "/logo.png"
        alt = "Logo"
        style = { { height: '200px', width: 'auto', display: 'block' } }
        />{" "} <
        /Link>{" "} <
        ul className = "header-section" >
        <
        li >
        <
        Link to = "/shop" > CỬA HÀNG < /Link>{" "} <
        /li>{" "} <
        li >
        <
        Link to = "/" > LIÊN HỆ < /Link>{" "} <
        /li>{" "} <
        li >
        <
        Link to = "/" > VỀ CHÚNG TÔI < /Link>{" "} <
        /li>{" "} <
        /ul>{" "} <
        div className = "header-tools header-section" >
        <
        Link to = "/account" >
        <
        div className = "svg-icon" >
        <
        FontAwesomeIcon icon = { icons.user }
        />{" "} <
        /div>{" "} <
        /Link>{" "} <
        Link to = "/wishlist" >
        <
        div className = "svg-icon" >
        <
        FontAwesomeIcon icon = { icons.heart }
        />{" "} {
            wishlistCount > 0 && ( <
                span > { wishlistCount > 9 ? "9+" : wishlistCount } < /span>
            )
        } { " " } <
        /div>{" "} <
        /Link>{" "} <
        Link to = "/cart" >
        <
        div className = "svg-icon" >
        <
        FontAwesomeIcon icon = { icons.cart }
        />{" "} {
            quantity > 0 && < span > { quantity > 9 ? "9+" : quantity } < /span>}{" "} <
                /div>{" "} <
                /Link>{" "} <
                div className = "burger" >
                <
                FontAwesomeIcon icon = { icons.hamburger }
            />{" "} <
            /div>{" "} <
            /div>{" "} <
            /div>{" "} <
            div className = { `header-line ${isHome || isShop ? "active" : ""}` } > < /div>{" "} <
                /nav>
        );
    }

    export default Header;