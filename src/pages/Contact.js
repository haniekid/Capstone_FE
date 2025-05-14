import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

function Contact() {
  return (
    <div className="container contact-page">
      <h1 className="page-title">Liên Hệ</h1>

      <div className="contact-container">
        <div className="contact-info">
          <h2>Thông Tin Liên Hệ</h2>
          <div className="info-list">
            <div className="info-item">
              <span className="icon">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
              </span>
              <div className="info-content">
                <h3>Địa Chỉ</h3>
                <p>
                  Trường Đại học Công nghiệp
                  <br />
                  Số 298 Đ. Cầu Diễn, Minh Khai, Bắc Từ Liêm, Hà Nội
                </p>
              </div>
            </div>
            <div className="info-item">
              <span className="icon">
                <FontAwesomeIcon icon={faPhone} />
              </span>
              <div className="info-content">
                <h3>Điện Thoại</h3>
                <p>0123 456 789</p>
              </div>
            </div>
            <div className="info-item">
              <span className="icon">
                <FontAwesomeIcon icon={faEnvelope} />
              </span>
              <div className="info-content">
                <h3>Email</h3>
                <p>contact@example.com</p>
              </div>
            </div>
            <div className="info-item">
              <span className="icon">
                <FontAwesomeIcon icon={faClock} />
              </span>
              <div className="info-content">
                <h3>Giờ Làm Việc</h3>
                <p>
                  Thứ 2 - Thứ 6: 7:00 - 23:00
                  <br />
                  Thứ 7, Chủ nhật: 6:00 - 24:00
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.4736632131!2d105.732531875999!3d21.05373598691889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31345457e292d5bf%3A0x20ac91c94d74439a!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBDw7RuZyBuZ2hp4buHcCBIw6AgTuG7mWk!5e0!3m2!1svi!2s!4v1747193820503!5m2!1svi!2s"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default Contact;
