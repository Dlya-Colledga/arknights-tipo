import { useState, useCallback } from "react";
import { TIMINGS } from "../constants";

export const useAppPhases = (animationImageLoaded, refs) => {
	const [prestartPhase, setPrestartPhase] = useState("showing");
	const [mainVideoPhase, setMainVideoPhase] = useState("perlica");
	const [showMask, setShowMask] = useState(false);
	const [maskPhase, setMaskPhase] = useState("idle");
	const [sideMasksPhase, setSideMasksPhase] = useState("hidden");
	const [showCyberLogo, setShowCyberLogo] = useState(false);
	const [showSubtitle, setShowSubtitle] = useState(false);

	const startMainApp = useCallback(() => {
		if (!animationImageLoaded) {
			setTimeout(() => startMainApp(), 100);
			return;
		}

		setShowMask(true);
		setSideMasksPhase("visible");
		refs.audioRef.current?.play().catch(console.error);

		setTimeout(() => {
			setMaskPhase("pre-move");
			const mainLogo = document.querySelector(".main-logo");
			if (mainLogo) {
				mainLogo.classList.remove("visible");
				mainLogo.classList.add("hiding");
			}
		}, TIMINGS.MASK_PRE_MOVE);
		setTimeout(() => {
			setMaskPhase("moving");
			setShowCyberLogo(true);
		}, TIMINGS.MASK_MOVING);
		setTimeout(() => {
			setMaskPhase("animating");
		}, TIMINGS.MASK_ANIMATE);
	}, [animationImageLoaded, refs.audioRef]);

	const handleperlicaEnd = useCallback(() => {
		setMainVideoPhase("blackScreen");

		setTimeout(() => {
			const app = document.querySelector(".App");
			if (app) app.style.backgroundColor = "#fff";

			const mainLogo = document.querySelector(".main-logo");
			if (mainLogo) {
				mainLogo.classList.remove("hiding");
				mainLogo.classList.add("visible");
			}

			setMainVideoPhase("main");
			startMainApp();
		}, TIMINGS.BLACK_SCREEN);
	}, [startMainApp]);

	const handleSpacePress = useCallback(() => {
		if (prestartPhase !== "showing") return;

		setPrestartPhase("hiding");
		refs.perlicaVideoRef.current?.play().catch(console.error);

		setTimeout(() => {
			setShowSubtitle(true);
		}, TIMINGS.SHOW_SUBTITLE);

		setTimeout(() => setPrestartPhase("hidden"), TIMINGS.PRESTART_HIDE);
	}, [prestartPhase, refs.perlicaVideoRef]);

	return {
		prestartPhase,
		mainVideoPhase,
		showMask,
		maskPhase,
		sideMasksPhase,
		showCyberLogo,
		showSubtitle,
		handleperlicaEnd,
		handleSpacePress,
	};
};