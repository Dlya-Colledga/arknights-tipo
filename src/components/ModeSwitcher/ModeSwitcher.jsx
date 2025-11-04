import React from "react";
import { ASSETS } from "../../constants";
import "./ModeSwitcher.css";

export const ModeSwitcher = ({ currentMode, onToggle, isVisible, isAnimating }) => {
	if (!isVisible) return null;

	const handleClick = () => {
		if (isAnimating) return;
		onToggle();
	};

	return (
		<button
			className={`mode-switcher ${isAnimating ? "disabled" : ""}`}
			onClick={handleClick}
		>
			{currentMode === "arknights" ? (
				<>
					<img
						src={ASSETS.images.logo_solo}
						alt="Solo Leveling Logo"
						className="switcher-logo"
					/>
				</>
			) : (
				<>
					<img
						src={ASSETS.images.logo}
						alt="Arknights Logo"
						className="switcher-logo"
					/>
				</>
			)}
		</button>
	);
};