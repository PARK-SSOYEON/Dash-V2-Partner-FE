import React, {useState} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Pagination} from 'swiper/modules';
import 'swiper/swiper-bundle.css';

interface CardSliderProps {
    cards: React.ReactNode[];
}

export const CardSlider: React.FC<CardSliderProps> = ({cards}) => {
    const [active, setActive] = useState(0);
    const total = cards.length;
    const hasMultiple = total > 1;
    const ratio = hasMultiple ? active / (total - 1) : 0;
    const leftPct = hasMultiple ? `${ratio * 100}%` : '0%';
    const rightPct = hasMultiple ? `${(1 - ratio) * 100}%` : '0%';
    return (
        <div style={{overflowX: "hidden"}}>
            <Swiper
                modules={[Pagination]}
                spaceBetween={20}
                slidesPerView={1}
                onSlideChange={(swiper) => setActive(swiper.activeIndex)}
                onSwiper={(swiper) => setActive(swiper.activeIndex)}
                pagination={false}
            >
                {cards.map((card, idx) => (
                    <SwiperSlide key={idx}>{card}</SwiperSlide>
                ))}
            </Swiper>
            <div className="custom-progress">
                {hasMultiple ? (
                    <>
                        <div className="track"/>
                        <div className="segments">
                            <div className="seg left" style={{width: leftPct}}/>
                            <div className="seg active" key={active}/>
                            <div className="seg right" style={{width: rightPct}}/>
                        </div>
                    </>
                ) : (
                    <div className="single-dot">
                        <div className="seg active" />
                    </div>
                )}
            </div>
            <style>{`
  .custom-progress {
  position: relative;
  padding: 30px 16px;
  width: 130px;
  margin: 0 auto;
}
  .custom-progress .track {
    height: 12px;
    border-radius: 9999px;
    background: white;
    position: relative;
  }
  .custom-progress .segments {
    position: absolute;
    left: 16px;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    pointer-events: none; /* indicator is display-only */
    gap: 6px;
  }
  .custom-progress .single-dot {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }
  .custom-progress .seg.left,
  .custom-progress .seg.right {
    height: 12px;
    border-radius: 9999px;
    background: #D3E2FC;
    transition: width 220ms cubic-bezier(0.2, 0.8, 0.2, 1);
    will-change: width;
  }
  .custom-progress .seg.active {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #256FEF;
    margin: 0; 
    flex: 0 0 auto;
    transition: box-shadow 200ms ease-out, background-color 200ms ease-out;
    will-change: transform;
    animation: dot-bounce 260ms cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  @keyframes dot-bounce {
    0%   { transform: scale(0.92); }
    55%  { transform: scale(1.06); }
    100% { transform: scale(1); }
  }
        `}</style>
        </div>
    );
};
