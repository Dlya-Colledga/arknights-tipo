import { useState, useEffect, useRef, useMemo } from "react";
import "./App.css";

import { ASSETS, SUBTITLE_TEXT } from "./constants";

import { useAppPhases } from "./hooks/useAppPhases";
import { useLoadingBox } from "./hooks/useLoadingBox";

import { ParticlesWrapper } from "./components/ParticlesWrapper";
import { VideoLayer } from "./components/VideoLayer";
import { MaskedVideo } from "./components/MaskedVideo";
import { Tooltip } from "./components/Tooltip";
import { Prestart } from "./components/Prestart";
import { CyberLogo } from "./components/CyberLogo";
import { Footer } from "./components/Footer";
import { LoadingBox } from "./components/LoadingBox";
import { HitboxLayer } from "./components/HitboxLayer";

function App() {
	const [animationImageLoaded, setAnimationImageLoaded] = useState(false);
	const [hoveredMask, setHoveredMask] = useState(null);
	const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

	const percilaVideoRef = useRef(null);
	const glitchVideoRef = useRef(null);
	const glitchAudioRef = useRef(null);
	const audioRef = useRef(null);

	const refs = useMemo(() => ({
		percilaVideoRef,
		glitchVideoRef,
		glitchAudioRef,
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
		handlePercilaEnd,
		handleGlitchEnd,
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
	const handleMaskEnter = (mask) => setHoveredMask(mask);
	const handleMaskLeave = () => setHoveredMask(null);

	const showMultipleMasks = maskPhase === "moving" || maskPhase === "animating";

	const appClasses = [
		"App",
		hoveredMask ? "mask-is-hovered" : "",
		hoveredMask ? `hovering-${hoveredMask}` : ""
	].join(" ");

	return (
		<div className={appClasses}>
			<ParticlesWrapper />

			<div className={`darken-overlay ${hoveredMask ? "visible" : ""}`} />

			{/* Видео-слой (Перцила -> Глитч) */}
			<div className="video-prelayer-container">
				<VideoLayer
					videoRef={percilaVideoRef}
					className={mainVideoPhase === "percila" ? "visible" : ""}
					src={ASSETS.videos.percila}
					onEnded={handlePercilaEnd}
				/>
				{showSubtitle && mainVideoPhase === "percila" && (
					<div className="subtitle-overlay">
						<p>{SUBTITLE_TEXT}</p>
					</div>
				)}
				<VideoLayer
					videoRef={glitchVideoRef}
					className={mainVideoPhase === "glitch" ? "visible" : ""}
					src={ASSETS.videos.glitch}
					onEnded={handleGlitchEnd}
				/>
			</div>

			{/* Переход в черный экран */}
			<div className={`black-screen-fade ${mainVideoPhase === "blackScreen" ? "visible" : ""}`} />

			{/* Слой с масками (Доктор) */}
			<div className={`masked-layer ${showMask ? "visible" : ""} ${maskPhase}`}>
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

			{/* Слой с хитбоксами (появляется вместе с масками) */}
			{showMultipleMasks && (
				<HitboxLayer
					onMaskEnter={handleMaskEnter}
					onMaskLeave={handleMaskLeave}
					onMaskMove={handleMouseMove}
				/>
			)}

			{/* Лого в углу */}
			<img
				src={ASSETS.images.logo}
				alt="Logo"
				className="main-logo"
			/>

			{/* Лого "Команда" */}
			<CyberLogo show={showCyberLogo} />

			{/* Футер */}
			{showCyberLogo && <Footer />}

			{/* Экран "Дисклеймер" */}
			{prestartPhase !== "hidden" && (
				<Prestart phase={prestartPhase} />
			)}

			{/* Окно "Загрузка..." */}
			{loadingBoxState !== "hidden" && (
				<LoadingBox state={loadingBoxState} text={currentLoadingText} />
			)}

			{/* Всплывающая подсказка */}
			<Tooltip hoveredMask={hoveredMask} position={tooltipPosition} />

			{/* Аудио-элементы */}
			<audio ref={glitchAudioRef} src={ASSETS.audio.glitch} preload="auto" />
			<audio ref={audioRef} src={ASSETS.audio.background} loop />
		</div>
	);
}

export default App;