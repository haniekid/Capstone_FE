import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/home.scss";

function Home() {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", name: "All" },
    { id: "main", name: "Main Dishes" },
    { id: "appetizers", name: "Appetizers" },
    { id: "street", name: "Street Food" },
    { id: "noodles", name: "Noodles" },
    { id: "rice", name: "Rice Dishes" },
  ];

  const foodImages = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800",
      alt: "Pho",
      category: "main",
      featured: true,
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800",
      alt: "Spring Rolls",
      category: "appetizers",
      featured: true,
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800",
      alt: "Banh Mi",
      category: "street",
      featured: true,
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800",
      alt: "Vietnamese Noodles",
      category: "noodles",
      featured: false,
    },
    {
      id: 5,
      image:
        "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800",
      alt: "Vietnamese Rice Dishes",
      category: "rice",
      featured: false,
    },
    {
      id: 6,
      image:
        "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800",
      alt: "Vietnamese Street Food",
      category: "street",
      featured: false,
    },
  ];

  const filteredImages =
    activeCategory === "all"
      ? foodImages
      : foodImages.filter((item) => item.category === activeCategory);

  const featuredItems = foodImages.filter((item) => item.featured);
  const regularItems = filteredImages.filter((item) => !item.featured);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Ẩm Thực Việt Nam</h1>
          <p>Khám phá hương vị đặc trưng của Việt Nam</p>
          <Link to="/menu" className="cta-button">
            Xem Thực Đơn
          </Link>
        </div>
      </section>

      {/* Featured Section */}
      <section className="featured-section">
        <div className="featured-grid">
          {featuredItems.map((item, index) => (
            <div
              key={item.id}
              className={`featured-item featured-${index + 1}`}
            >
              <div className="image-container">
                <img src={item.image} alt={item.alt} />
                <div className="overlay">
                  <span className="category">
                    {categories.find((cat) => cat.id === item.category)?.name}
                  </span>
                  <Link to={`/menu/${item.id}`} className="view-button">
                    Xem Chi Tiết
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="about-content">
          <h2>Về Nhà Hàng Chúng Tôi</h2>
          <p>
            Trải nghiệm hương vị phong phú và truyền thống của ẩm thực Việt Nam
            trong một không gian hiện đại. Đầu bếp của chúng tôi chỉ sử dụng
            những nguyên liệu tươi ngon nhất để tạo ra những món ăn đích thực sẽ
            đưa bạn đến với những con phố của Việt Nam.
          </p>
          <Link to="/about" className="about-button">
            Tìm Hiểu Thêm
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
