import React, { useState, useEffect } from "react";
import { LORE_SUBTITLES } from "../../constants/loreSubtitles";
import "./LoreSubtitles.css";

const parseTime = (timeStr) => {
	const [sec, ms] = timeStr.split(":").map(Number);
	return (sec * 1000) + (ms || 0);
};

const subtitleEntries = Object.entries(LORE_SUBTITLES).map(([timeRange, text]) => {
	const [start, end] = timeRange.split("-").map(parseTime);
	return { start, end, text };
});

const renderSubtitleText = (text) => {
	const parts = text.split("|");
	return parts.map((part, index) => {
		if (index % 2 === 1) {
			return <span key={index} className="lore-subtitle-danger glitch">{part}</span>;
		}
		return <span key={index}>{part}</span>;
	});
};

export const LoreSubtitles = ({ videoRef, isVisible }) => {
	const [currentSubtitle, setCurrentSubtitle] = useState("");

	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;

		const onTimeUpdate = () => {
			const currentTimeMs = video.currentTime * 1000;
			const activeSubtitle = subtitleEntries.find(
				({ start, end }) => currentTimeMs >= start && currentTimeMs <= end
			);

			setCurrentSubtitle(activeSubtitle ? activeSubtitle.text : "");
		};

		if (isVisible) {
			video.addEventListener("timeupdate", onTimeUpdate);
		} else {
			video.removeEventListener("timeupdate", onTimeUpdate);
			setCurrentSubtitle("");
		}

		return () => {
			if (video) {
				video.removeEventListener("timeupdate", onTimeUpdate);
			}
		};
	}, [videoRef, isVisible]);

	if (!isVisible || !currentSubtitle) {
		return null;
	}

	return (
		<div className="lore-subtitle-overlay">
			<p>{renderSubtitleText(currentSubtitle)}</p>
		</div>
	);
};