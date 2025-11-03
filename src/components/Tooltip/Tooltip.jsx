import React from "react";
import { TOOLTIP_DATA } from "../../constants";
import "./Tooltip.css";

export const Tooltip = ({ hoveredMask, position }) => {
	if (!hoveredMask) return null;

	const data = TOOLTIP_DATA[hoveredMask];
	if (!data) return null;

	const textLines = [data.name, data.codename];

	const style = {
		top: position.y + 5,
		left: position.x + 5,
	};

	return (
		<div className="mask-tooltip" style={style}>
			<img src={data.avatar} alt={data.codename} className="tooltip-avatar" />
			<div className="tooltip-text-content">
				{textLines.map((line, index) => (
					<p key={index}>{line}</p>
				))}
			</div>
		</div>
	);
};