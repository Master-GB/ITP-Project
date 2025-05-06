import React, { useState, useEffect, useRef } from "react";
import "./PhotoSlider.css";
import slide1 from "../daniruRes/slide1.png";
import slide2 from "../daniruRes/slide2.jpg";

const slides = [
  {
    url: slide1,
    caption: "Join Hodahitha.lk: Together, we reduce food waste and feed communities."
  },
  {
    url: slide2,
    caption: "Redistribute surplus food to those in need. Every meal matters."
  },
  {
    url: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=1200&q=80",
    caption: "Be a food hero: Rescue, share, and make a difference with Hodahitha.lk."
  }
];

const PhotoSlider = () => {
  const [current, setCurrent] = useState(0);
  const length = slides.length;
  const intervalRef = useRef();
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = () => setCurrent(current === length - 1 ? 0 : current + 1);
  const prevSlide = () => setCurrent(current === 0 ? length - 1 : current - 1);

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrent((prev) => (prev === length - 1 ? 0 : prev + 1));
      }, 3000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPaused, length]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  return (
    <div className="photo-slider" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button className="slider-arrow left" onClick={prevSlide} aria-label="Previous Slide">&#10094;</button>
      <div className="slider-content">
        <img src={slides[current].url} alt={`slide ${current + 1}`} className="slider-image" />
        <div className="slider-caption">{slides[current].caption}</div>
      </div>
      <button className="slider-arrow right" onClick={nextSlide} aria-label="Next Slide">&#10095;</button>
      <div className="slider-indicators">
        {slides.map((_, idx) => (
          <span
            key={idx}
            className={`slider-dot${idx === current ? " active" : ""}`}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default PhotoSlider; 