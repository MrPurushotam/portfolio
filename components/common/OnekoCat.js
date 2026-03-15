"use client"
import Script from 'next/script';
import React, { useEffect, useState } from 'react';

export default function OnekoCat() {
    const [showCat, setShowCat] = useState(false);

    useEffect(() => {
        const checkPreference = () => {
            const savedPreferences = localStorage.getItem('user-preference');
            let isCatDisabled = false;
            if (savedPreferences) {
                try {
                    const parsed = JSON.parse(savedPreferences);
                    isCatDisabled = parsed.isAnnoyedByPet === true;
                } catch (error) {
                    console.error("Error parsing user-preference in OnekoCat:", error);
                }
            }
            setShowCat(!isCatDisabled);

            // Clean up the DOM element if disabled
            if (isCatDisabled) {
                const catEl = document.getElementById('oneko');
                if (catEl) {
                    catEl.remove();
                }
            }
        };

        checkPreference();
        
        window.addEventListener("user-preference-updated", checkPreference);
        window.addEventListener("storage", checkPreference);

        return () => {
            window.removeEventListener("user-preference-updated", checkPreference);
            window.removeEventListener("storage", checkPreference);
        };
    }, []);

    if (!showCat) {
        return null;
    }

    return (
        <Script
            src="/oneko/oneko.js"
            data-cat="/oneko/oneko.gif"
            strategy="lazyOnload"
        />
    );
}
