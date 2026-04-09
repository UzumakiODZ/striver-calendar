import React from "react";
import { format } from "date-fns";
import { useCalendar } from "./CalendarContext";
import "../styles/HeroImage.css"

const HeroImage = () => {
    const { currentDate } = useCalendar();
    const heroImageURL = [
        new URL("../assets/11514282-sunset-6911736.jpg", import.meta.url).href,
        new URL("../assets/bru-no-stone-circle-4481817_1920.jpg", import.meta.url).href,
        new URL("../assets/chiemseherin-sunset-8516639_1920.jpg", import.meta.url).href,
        new URL("../assets/jillwellington-woman-591576_1920.jpg", import.meta.url).href,
        new URL("../assets/kanenori-beach-6292382_1920.jpg", import.meta.url).href,
        new URL("../assets/kollsd-board-5599231_1920.png", import.meta.url).href,
        new URL("../assets/leino194-bridge-7504605.jpg", import.meta.url).href,
        new URL("../assets/lum3n-pocket-1565402_1920.jpg", import.meta.url).href,
        new URL("../assets/orangefox-dream-catcher-902508_1920.jpg", import.meta.url).href,
        new URL("../assets/pattyjansen-sylvester-586225.jpg", import.meta.url).href,
        new URL("../assets/stocksnap-disneyland-2584304.jpg", import.meta.url).href,
        new URL("../assets/tomchill-fireworks-4021214.jpg", import.meta.url).href,
    ];
    const month = format(currentDate, "MMMM");
    const year = format(currentDate, "yyyy");
    const heroImageIndex = currentDate.getMonth() % heroImageURL.length;
    const heroImageSrc = heroImageURL[heroImageIndex];

    return (
        <div
            className="heroImage"
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${heroImageSrc})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="heroYearMonth">
                <div className="heroSubtitle">{month} {year}</div>
            </div>
            
        </div>
    );
}

export default HeroImage;