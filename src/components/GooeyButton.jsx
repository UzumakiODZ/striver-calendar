/* eslint-disable react/prop-types */
import React, { useId } from "react";
import "../styles/GooeyButton.css";

function GooeyButton({ children, className = "", type = "button", ...props }) {
    const filterId = useId().replaceAll(":", "");

    return (
        <button
            type={type}
            className={`c-button c-button--gooey ${className}`.trim()}
            {...props}
        >
            {children}
            <span className="c-button__blobs" style={{ filter: `url(#${filterId})` }}>
                <span />
                <span />
                <span />
            </span>
            <svg aria-hidden="true" style={{ position: "absolute", width: 0, height: 0 }}>
                <defs>
                    <filter id={filterId}>
                        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                        <feColorMatrix
                            in="blur"
                            mode="matrix"
                            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8"
                            result="goo"
                        />
                        <feBlend in="SourceGraphic" in2="goo" />
                    </filter>
                </defs>
            </svg>
        </button>
    );
}

export default GooeyButton;
