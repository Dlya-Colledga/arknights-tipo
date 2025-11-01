import React from "react";
import "./LoadingBox.css";

export const LoadingBox = ({ state, text }) => (
	<div className={`loading-letterbox ${state}`}>
		<p>{text}</p>
	</div>
);