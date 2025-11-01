import { useState, useEffect } from "react";
import { TIMINGS, LOADING_MESSAGES } from "../constants";

export const useLoadingBox = (showMask) => {
	const [loadingBoxState, setLoadingBoxState] = useState("hidden");
	const [currentLoadingText, setCurrentLoadingText] = useState(LOADING_MESSAGES[0]);

	useEffect(() => {
		if (!showMask) return;

		setLoadingBoxState("showing");
		let messageIndex = 0;

		const textInterval = setInterval(() => {
			if (messageIndex >= LOADING_MESSAGES.length - 1) return;
			messageIndex = Math.min(messageIndex + 1, LOADING_MESSAGES.length - 1);
			setCurrentLoadingText(LOADING_MESSAGES[messageIndex]);
		}, TIMINGS.LOADING_TEXT_INTERVAL);

		const hideTimeout = setTimeout(() => {
			setLoadingBoxState("hiding");
		}, TIMINGS.LOADING_HIDE);

		return () => {
			clearInterval(textInterval);
			clearTimeout(hideTimeout);
		};
	}, [showMask]);

	return { loadingBoxState, currentLoadingText };
};