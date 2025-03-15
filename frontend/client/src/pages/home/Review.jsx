import React, { useState } from "react";
import "./home.css";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import rimg1 from '../../images/unnamed.png'
import rimg2 from '../../images/unnamed (1).png'
import rimg3 from '../../images/unnamed (2).png'
import rimg4 from '../../images/unnamed (3).png'
import rimg5 from '../../images/unnamed (4).png'

const Coverflow = () => {
  const [activeIndex, setActiveIndex] = useState(2);

  const reviews = [
    { id: 1, img: rimg1, review: "I just completed the digital analytics course at Getin Technologies, and it has truly transformed my career path! The curriculum was comprehensive, and the instructors were incredibly knowledgeable and supportive. I’m thrilled with the skills I’ve gained and grateful to the Getin Technologies team for their dedication.",author:'Vicky Vignesh' },
    { id: 2, img: rimg2, review: "Really, I want to thank Getin Technologies, the best software training and placement institute in Kovilpatti. From the initial stage, I had no idea about the IT industry and technology. Because I am a 2014 passout, I have no work experience.",author:'Ruban sathiyan' },
    { id: 3, img: rimg3, review: "I have just completed the Digital Analytics course at Getin Technologies. I loved the practical approach which raised my self-esteem. They also have placement assistance and I got a job within a short period after I finished the course. I would recommend it to everyone! Don't Miss it!😌",author:'Selvi' },
    { id: 4, img: rimg4, review: "I had a great experience learning Python Full Stack development at Getin Technologies. The instructors are knowledgeable and patient, and the staff is friendly and helpful. I started with basic programming skills, but now I've learned many advanced topics",author:'Raja Pandi' },
    { id: 5, img: rimg5, review: "I recently completed the Flutter course in Getin Technologies Virudhunagar and I must say it exceeded my expectations! The instructors were knowledgeable and patient, guiding us through the intricacies of Flutter development. The hands-on projects helped solidify my understanding. Definitely recommended!",author:'Hemnath Chandru' },
  ];

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length);
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  };

  return (
    <div className="coverflow-container">
            <button className="nav-button prev" onClick={handlePrev}>
      <KeyboardArrowLeftIcon ></KeyboardArrowLeftIcon >
        
      </button>
      <div className="coverflow">
        {reviews.map((review, index) => {
          const offset = index - activeIndex;
          const isActive = offset === 0;

          return (
            <div
              key={review.id}
              className={`coverflow-item ${isActive ? "active" : ""}`}
              style={{
                transform: `translateX(${offset * 100}%) ${isActive?'translateY(-30%)':'translateY(0px)'} scale(${1 - Math.abs(offset) * 0.2})`,
                zIndex: reviews.length - Math.abs(offset),
                opacity: isActive ? 1 : 0.5,
                width:`${isActive?'610px':'457px'}`,
                height:`${isActive?'252px':'189px'}`
              }}
            >
              <div className="review-box">
                <img src={review.img} alt="" />
                <p>⭐️⭐️⭐️⭐️⭐️</p>
                <p>{review.review} </p>
                <h4 style={{textAlign:'end'}}>-{review.author}</h4>
              </div>
            </div>
          );
        })}
      </div>
      <button className="nav-button next" onClick={handleNext}>
      <ChevronRightIcon></ChevronRightIcon>
      </button>
    </div>
  );
};

export default Coverflow;
