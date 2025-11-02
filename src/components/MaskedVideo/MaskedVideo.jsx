import React, { useMemo } from "react";
import { ASSETS } from "../../constants";

export const MaskedVideo = ({ id, className, animationImageLoaded }) => {
	const style = useMemo(() => ({
		"--animation-mask-image": animationImageLoaded ? `url("${ASSETS.images.red2}")` : "none"
	}), [animationImageLoaded]);

	return (
		<video
			id={id}
			className={`video-bg ${className}`}
			src={ASSETS.videos.cosmos}
			autoPlay
			muted
			loop
			style={style}
		/>
	);
};