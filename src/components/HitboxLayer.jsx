import React from "react";
import "./HitboxLayer.css";

export const HitboxLayer = ({ onMaskEnter, onMaskLeave, onMaskMove }) => (
	<div className="hitbox-layer">
		<div
			className="hitbox hitbox-left"
			onMouseEnter={() => onMaskEnter('left')}
			onMouseLeave={onMaskLeave}
			onMouseMove={onMaskMove}
		/>
		<div
			className="hitbox hitbox-center"
			onMouseEnter={() => onMaskEnter('center')}
			onMouseLeave={onMaskLeave}
			onMouseMove={onMaskMove}
		/>
		<div
			className="hitbox hitbox-right"
			onMouseEnter={() => onMaskEnter('right')}
			onMouseLeave={onMaskLeave}
			onMouseMove={onMaskMove}
		/>
	</div>
);