import React from "react";
import '../styles/Wall.css'

const Wall = () => {
    return (
        <div className="wall">
            <div className="window">
                <div className="windowPane topLeft"></div>
                <div className="windowPane topRight"></div>
                <div className="windowPane bottomLeft"></div>
                <div className="windowPane bottomRight"></div>
            </div>
        </div>
    );
}