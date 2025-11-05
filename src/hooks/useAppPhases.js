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
		setMainVideoPhase("ended");
		setShowMask(true);
		setMaskPhase("moving");
		setShowCyberLogo(true);
	}, [animationImageLoaded, refs.audioRef]);

	const handleperlicaEnd = useCallback(() => {
		setMainVideoPhase("terminal");
	}, []);

	const handleGlitchEnd = useCallback(() => {
		setMainVideoPhase("terminal");
	}, []);

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
		startMainApp,
		handleGlitchEnd,
		setMainVideoPhase
	};
};