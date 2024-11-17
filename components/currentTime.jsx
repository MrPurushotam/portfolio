import { useEffect, useState } from "react";

const useCurrentTime = () => {
    const [time, setTime] = useState('');

    useEffect(() => {
        const updateCurrentTime = () => {
            const date = new Date();
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            setTime(`${hours}:${minutes}:${seconds}`);
        };

        updateCurrentTime(); // Initialize time immediately
        const interval = setInterval(updateCurrentTime, 1000);

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);

    return time;
};

export default useCurrentTime;