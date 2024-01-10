/* eslint-disable react/prop-types */
import React from "react";

const MenuCard = ({
  menuName,
  description,
  pricePerItem,
  onClickEdit,
  onClickDelete,
  imgPath,
}) => {
  return (
    <div className="mb-10">
      <div className="flex gap-x-5">
        <img
          src={
            imgPath
              ? `http://localhost:8080/${imgPath}`
              : "https://placehold.co/60"
          }
          alt=""
          className="object-cover w-20 h-20"
        />
        <div className="flex-auto">
          <h2 className="text-slate-700 leading-relaxed">{menuName}</h2>
          <h2 className="text-slate-700 text-sm leading-relaxed">
            {description}
          </h2>
          <div className="flex justify-between">
            <p className="text-slate-600 leading-relaxed">Rp {pricePerItem}</p>
            <div className="flex gap-x-2">
              <button
                className="bg-blue-400 text-white active:bg-blue-400 font-bold uppercase text-xs px-2 py-1 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
                onClick={onClickEdit}
              >
                Ubah
              </button>
              <button
                className="bg-red-400 text-white active:bg-red-400 font-bold uppercase text-xs px-2 py-1 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
                onClick={onClickDelete}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
