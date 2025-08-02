import React from "react";
import { IoMdStar, IoMdStarHalf } from "react-icons/io";

interface RatingProps {
  rating: number;
}

const Rating: React.FC<RatingProps> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;

  return (
    <div className="flex gap-1 text-yellow-500">
      {[...Array(fullStars)].map((_, index) => (
        <IoMdStar key={index} />
      ))}
      {halfStar && <IoMdStarHalf />}
      <small className="text-[#E3E3E3] text-[12px] font-medium">{rating}</small>
    </div>
  );
};

export default Rating;
