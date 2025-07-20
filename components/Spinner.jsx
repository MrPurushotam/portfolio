import React from 'react'

const Spinner = ({ color = "blue", size = "4" }) => {
    const colorClass = {
        blue: "bg-blue-700",
        white: "bg-white",
        red: "bg-red-500",
        green: "bg-green-500",
        yellow: "bg-yellow-500",
        purple: "bg-purple-500",
        pink: "bg-pink-500",
        indigo: "bg-indigo-500",
        gray: "bg-gray-500",
        black: "bg-black"
    };

    const sizeClass = {
        "2": "w-2 h-2",
        "3": "w-3 h-3", 
        "4": "w-4 h-4",
        "5": "w-5 h-5",
        "6": "w-6 h-6",
        "8": "w-8 h-8"
    };

    const selectedColor = colorClass[color] || colorClass.blue;
    const selectedSize = sizeClass[size] || sizeClass["4"];

    return (
        <div className="flex flex-row gap-2">
            <div className={`${selectedSize} rounded-full ${selectedColor} animate-bounce [animation-delay:.7s]`}></div>
            <div className={`${selectedSize} rounded-full ${selectedColor} animate-bounce [animation-delay:.3s]`}></div>
            <div className={`${selectedSize} rounded-full ${selectedColor} animate-bounce [animation-delay:.7s]`}></div>
        </div>
    )
}

export default Spinner
