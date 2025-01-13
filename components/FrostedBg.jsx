const FrostedBg = ({ children }) => {
    return (
        <div className="dark:bg-[#121212]">
            <div className="dark:bg-opacity-15 dark:backdrop-blur-md">
                {children}
            </div>
        </div>
    )
}

export default FrostedBg;
