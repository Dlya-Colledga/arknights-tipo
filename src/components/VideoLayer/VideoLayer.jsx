import React from "react";

export const VideoLayer = ({ videoRef, className, src, onEnded, preload = "auto", ...props }) => (
	<video
		ref={videoRef}
		className={`video-bg background-video ${className}`}
		src={src}
		preload={preload}
		onEnded={onEnded}
		playsInline
		{...props}
	/>
);