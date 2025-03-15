import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import im1 from '../../images/Arulselvam-J.png.webp'
import im2 from '../../images/JEYA-PRADEEPA-P.png.webp'
import im3 from '../../images/Varatharaj-V.png.webp'
import im4 from '../../images/ARUNACHALAM-C-768x768.png.webp'
import './placed.css'
const PlacedStudent = () => {
  const cards = [
    { id: 1, image: im1 },
    { id: 2, image:im2 },
    { id: 3,image: im3 },
    { id: 4, image: im4 }
  ];

  return (
    <div className="container-p">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView="auto"
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true
        }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        loop={true}
        className="mySwiper"
      >
        {cards.map((card) => (
          <SwiperSlide key={card.id} className="card-p">
            <img src={card.image} alt={card.id} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PlacedStudent;
