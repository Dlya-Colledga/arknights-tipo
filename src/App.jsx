import { useState, useEffect, useRef, useMemo } from "react";
import "./App.css";

import { ASSETS, SUBTITLE_TEXT } from "./constants";

import { useAppPhases } from "./hooks/useAppPhases";
import { useLoadingBox } from "./hooks/useLoadingBox";

import { ParticlesWrapper } from "./components/ParticlesWrapper/ParticlesWrapper";
import { VideoLayer } from "./components/VideoLayer/VideoLayer";
import { MaskedVideo } from "./components/MaskedVideo/MaskedVideo";
import { Tooltip } from "./components/Tooltip/Tooltip";
import { Prestart } from "./components/Prestart/Prestart";
import { CyberLogo } from "./components/CyberLogo/CyberLogo";
import { Footer } from "./components/Footer/Footer";
import { LoadingBox } from "./components/LoadingBar/LoadingBox";
import { HitboxLayer } from "./components/HitboxLayer/HitboxLayer";
import { Dossier } from "./components/Dossier/Dossier";

function App() {
	const [animationImageLoaded, setAnimationImageLoaded] = useState(false);
	const [hoveredMask, setHoveredMask] = useState(null);
	const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
	const [selectedMask, setSelectedMask] = useState(null);
	const [isAnimating, setIsAnimating] = useState(false);

	const perlicaVideoRef = useRef(null);
	const audioRef = useRef(null);

	const refs = useMemo(() => ({
		perlicaVideoRef,
		audioRef,
	}), []);

	useEffect(() => {
		const img = new Image();
		img.src = ASSETS.images.doctor2;
		img.onload = () => setAnimationImageLoaded(true);
	}, []);

	const {
		prestartPhase,
		mainVideoPhase,
		showMask,
		maskPhase,
		showCyberLogo,
		showSubtitle,
		handleperlicaEnd,

		handleSpacePress,
	} = useAppPhases(animationImageLoaded, refs);

	const { loadingBoxState, currentLoadingText } = useLoadingBox(showMask);

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.code === "Space") {
				document.documentElement.requestFullscreen().catch(console.error);
				e.preventDefault();
				handleSpacePress();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [handleSpacePress]);

	const handleMouseMove = (e) => {
		setTooltipPosition({ x: e.clientX, y: e.clientY });
	};

	const handleMaskEnter = (mask) => {
		if (!selectedMask && !isAnimating) {
			setHoveredMask(mask);
		}
	};
	const handleMaskLeave = () => {
		if (!selectedMask && !isAnimating) {
			setHoveredMask(null);
		}
	};

	const handleMaskClick = (mask) => {
		if (isAnimating) return;

		const newSelectedMask = selectedMask === mask ? null : mask;

		setIsAnimating(true);
		setSelectedMask(newSelectedMask);

		if (newSelectedMask) {
			setHoveredMask(null);
		}

		setTimeout(() => {
			setIsAnimating(false);
		}, 800);
	};

	const showMultipleMasks = maskPhase === "moving" || maskPhase === "animating";

	const appClasses = [
		"App",
		(hoveredMask && !selectedMask && !isAnimating) ? "mask-is-hovered" : "",
		(hoveredMask && !selectedMask && !isAnimating) ? `hovering-${hoveredMask}` : "",
		selectedMask ? "mask-is-selected" : "",
		selectedMask ? `selected-${selectedMask}` : ""
	].join(" ");

	const maskedLayerClasses = [
		"masked-layer",
		showMask ? "visible" : "",
		maskPhase,
		selectedMask ? "mask-selected" : "",
		selectedMask ? `selected-${selectedMask}` : ""
	].join(" ");

	return (
		<div className={appClasses}>
			<ParticlesWrapper />

			<div className={`darken-overlay ${hoveredMask && !selectedMask && !isAnimating ? "visible" : ""}`} />

			<div className="video-prelayer-container">
				<VideoLayer
					videoRef={perlicaVideoRef}
					className={mainVideoPhase === "perlica" ? "visible" : ""}
					src={ASSETS.videos.perlica}
					onEnded={handleperlicaEnd}
				/>
				{showSubtitle && mainVideoPhase === "perlica" && (
					<div className="subtitle-overlay">
						<p>{SUBTITLE_TEXT}</p>
					</div>
				)}
				{/* Блок VideoLayer для glitch удален */}
			</div>

			<div className={`black-screen-fade ${mainVideoPhase === "blackScreen" ? "visible" : ""}`} />

			<div className={maskedLayerClasses}>
				<MaskedVideo
					id="video-prelayer-center"
					className="mask-center"
					animationImageLoaded={animationImageLoaded}
				/>
				{showMultipleMasks && (
					<>
						<MaskedVideo
							id="video-prelayer-left"
							className="mask-left"
							animationImageLoaded={animationImageLoaded}
						/>
						<MaskedVideo
							id="video-prelayer-right"
							className="mask-right"
							animationImageLoaded={animationImageLoaded}
						/>
					</>
				)}
			</div>

			{showMultipleMasks && (
				<HitboxLayer
					onMaskEnter={handleMaskEnter}
					onMaskLeave={handleMaskLeave}
					onMaskMove={handleMouseMove}
					onMaskClick={handleMaskClick}
				/>
			)}

			<img
				src={ASSETS.images.logo}
				alt="Logo"
				className={`main-logo ${selectedMask ? "hiding" : ""}`}
			/>

			<CyberLogo show={showCyberLogo && !selectedMask} />

			{showCyberLogo && !selectedMask && <Footer />}

			{prestartPhase !== "hidden" && (
				<Prestart phase={prestartPhase} />
			)}

			{loadingBoxState !== "hidden" && (
				<LoadingBox state={loadingBoxState} text={currentLoadingText} />
			)}

			<Dossier selectedMask={selectedMask} />

			<Tooltip hoveredMask={hoveredMask} position={tooltipPosition} />

			<audio ref={audioRef} src={ASSETS.audio.background} loop />
		</div>
	);
}

export default App;