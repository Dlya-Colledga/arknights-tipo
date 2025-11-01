import React from "react";
import { TOOLTIP_DATA } from "../../constants";
import "./Tooltip.css";

export const Tooltip = ({ hoveredMask, position }) => {
	if (!hoveredMask) return null;

	const content = TOOLTIP_DATA[hoveredMask];
	const textLines = content.split("\n");

	const style = {
		top: position.y + 5,
		left: position.x + 5,
	};

	return (
		<div className="mask-tooltip" style={style}>
			{textLines.map((line, index) => (
				<p key={index}>{line}</p>
			))}
		</div>
	);
};