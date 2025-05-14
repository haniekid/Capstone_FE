import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStore,
  faUsers,
  faHandshake,
  faAward,
} from "@fortawesome/free-solid-svg-icons";

function About() {
  return (
    <div className="container about-page">
      <h1 className="page-title">Về Chúng Tôi</h1>

      <div className="about-section">
        <div className="about-content">
          <h2>Chúng Tôi Là Ai?</h2>
          <p>
            Chúng tôi là một công ty chuyên cung cấp các sản phẩm chất lượng
            cao, với hơn 10 năm kinh nghiệm trong ngành. Chúng tôi cam kết mang
            đến cho khách hàng những trải nghiệm mua sắm tốt nhất và sản phẩm
            chất lượng nhất.
          </p>
        </div>
      </div>

      <div className="values-section">
        <h2>Giá Trị Cốt Lõi</h2>
        <div className="values-grid">
          <div className="value-item">
            <FontAwesomeIcon icon={faStore} />
            <h3>Chất Lượng</h3>
            <p>
              Cam kết cung cấp sản phẩm chất lượng cao, đáp ứng mọi tiêu chuẩn
              quốc tế.
            </p>
          </div>

          <div className="value-item">
            <FontAwesomeIcon icon={faUsers} />
            <h3>Khách Hàng</h3>
            <p>
              Đặt khách hàng làm trung tâm, luôn lắng nghe và đáp ứng nhu cầu
              của khách hàng.
            </p>
          </div>

          <div className="value-item">
            <FontAwesomeIcon icon={faHandshake} />
            <h3>Uy Tín</h3>
            <p>
              Xây dựng niềm tin với khách hàng thông qua sự minh bạch và trách
              nhiệm.
            </p>
          </div>

          <div className="value-item">
            <FontAwesomeIcon icon={faAward} />
            <h3>Đổi Mới</h3>
            <p>
              Không ngừng cải tiến và phát triển để mang đến những giải pháp tốt
              nhất.
            </p>
          </div>
        </div>
      </div>

      <div className="mission-section">
        <div className="mission-content">
          <h2>Sứ Mệnh</h2>
          <p>
            Chúng tôi cam kết mang đến cho khách hàng những sản phẩm chất lượng
            cao nhất, với dịch vụ chăm sóc khách hàng tận tâm và chuyên nghiệp.
            Chúng tôi luôn nỗ lực để trở thành đối tác đáng tin cậy của mọi
            khách hàng.
          </p>
        </div>

        <div className="vision-content">
          <h2>Tầm Nhìn</h2>
          <p>
            Hướng đến việc trở thành công ty hàng đầu trong lĩnh vực, với mạng
            lưới phân phối rộng khắp và danh tiếng vững mạnh. Chúng tôi mong
            muốn được đồng hành cùng sự phát triển của khách hàng và đóng góp
            vào sự phát triển chung của cộng đồng.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
