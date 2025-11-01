import React from "react";
import { ASSETS } from "../../constants";
import "./CyberLogo.css";

export const CyberLogo = ({ show }) => (
	<div className={`logo-container ${show ? "visible" : ""}`}>
		<div className="title-background">
			<h3 className="logo-title">Команда</h3>
			<div className="logo-stripe" />
		</div>
		<img src={ASSETS.images.logo} alt="Logo" className="cyber-logo-image" />
	</div>
);