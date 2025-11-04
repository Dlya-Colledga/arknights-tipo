import React from "react";
import { ASSETS } from "../../constants";
import "./CyberLogo.css";

export const CyberLogo = ({ show, maskSet }) => (
	<div className={`logo-container ${show ? "visible" : ""}`}>
		<div className="title-background">
			<h3 className="logo-title">Команда</h3>
			<div className="logo-stripe" />
		</div>
		<img
			src={maskSet === "arknights" ? ASSETS.images.logo : ASSETS.images.logo_solo}
			alt="Logo"
			className="cyber-logo-image"
		/>
	</div>
);