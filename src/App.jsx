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
import { DeveloperConsole } from "./components/DeveloperConsole/DeveloperConsole";

function App() {
	const [animationImageLoaded, setAnimationImageLoaded] = useState(false);
	const [hoveredMask, setHoveredMask] = useState(null);
	const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
	const [selectedMask, setSelectedMask] = useState(null);
	const [isAnimating, setIsAnimating] = useState(false);
	const [isConsoleOpen, setIsConsoleOpen] = useState(false);
	const [isMuted, setIsMuted] = useState(false);
	const [showHitboxes, setShowHitboxes] = useState(false);
	const [commandAudioSrc, setCommandAudioSrc] = useState(null);
	const [consoleLogs, setConsoleLogs] = useState([]);

	const perlicaVideoRef = useRef(null);
	const audioRef = useRef(null);

	const refs = useMemo(() => ({
		perlicaVideoRef,
		audioRef,
	}), []);

	useEffect(() => {
		const img = new Image();
		img.src = ASSETS.images.red2;
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
			if (e.ctrlKey && (e.key === "q" || e.key === "Q" || e.key === "й" || e.key === "Й")) {
				e.preventDefault();
				setIsConsoleOpen(prev => !prev);
			}

			if (e.code === "Space" && !isConsoleOpen) {
				document.documentElement.requestFullscreen().catch(console.error);
				e.preventDefault();
				handleSpacePress();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [handleSpacePress, isConsoleOpen]);

	const logToConsole = (message, type = "log") => {
		setConsoleLogs(prev => [...prev.slice(-100), { type, message, time: new Date() }]);
	};

	const handleConsoleCommand = (command) => {
		logToConsole(`> ${command}`, "command");
		const [cmd, ...args] = command.trim().split(" ");

		switch (cmd.toLowerCase()) {
			case "audio":
				if (args[0] === "mute") {
					setIsMuted(true);
					logToConsole("Audio muted.");
				} else if (args[0] === "unmute") {
					setIsMuted(false);
					logToConsole("Audio unmuted.");
				} else if (args[0] === "play" && args[1]) {
					const fileName = args[1].endsWith(".ogg") ? args[1] : `${args[1]}.ogg`;
					const src = `/audio/${fileName}`;
					setCommandAudioSrc(src);
					logToConsole(`Attempting to play ${src}...`);
				} else {
					logToConsole(`Usage: audio mute|unmute|play <filename>`, "error");
				}
				break;
			case "hitboxes":
				if (args[0] === "on") {
					setShowHitboxes(true);
					logToConsole("Hitboxes ON.");
				} else if (args[0] === "off") {
					setShowHitboxes(false);
					logToConsole("Hitboxes OFF.");
				} else {
					logToConsole("Usage: hitboxes on|off", "error");
				}
				break;
			case "clear":
				setConsoleLogs([]);
				break;
			case "help":
				logToConsole("Available commands:");
				logToConsole("  audio mute|unmute - Mute/unmute all audio");
				logToConsole("  audio play <file> - Play /audio/<file>.ogg");
				logToConsole("  hitboxes on|off   - Toggle hitbox borders");
				logToConsole("  clear             - Clear console output");
				logToConsole("  help              - Show this help message");
				break;
			default:
				logToConsole(`Unknown command: ${cmd}. Type "help" for commands.`, "error");
		}
	};

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
		showHitboxes ? "show-hitboxes" : "",
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
					muted={isMuted}
				/>
				{showSubtitle && mainVideoPhase === "perlica" && (
					<div className="subtitle-overlay">
						<p>{SUBTITLE_TEXT}</p>
					</div>
				)}
			</div>

			<div className={`black-screen-fade ${mainVideoPhase === "blackScreen" ? "visible" : ""}`} />

			<div className={maskedLayerClasses}>
				<MaskedVideo
					id="video-prelayer-center"
					className="mask-center"
					animationImageLoaded={animationImageLoaded}
				/>
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

			<audio ref={audioRef} src={ASSETS.audio.background} loop muted={isMuted} />

			{isConsoleOpen && (
				<DeveloperConsole
					logs={consoleLogs}
					onCommand={handleConsoleCommand}
					onClose={() => setIsConsoleOpen(false)}
				/>
			)}
			{commandAudioSrc && (
				<audio
					src={commandAudioSrc}
					autoPlay
					muted={isMuted}
					onEnded={() => setCommandAudioSrc(null)}
					onError={(e) => {
						logToConsole(`Failed to load or play audio: ${commandAudioSrc}`, "error");
						setCommandAudioSrc(null);
					}}
				/>
			)}
		</div>
	);
}

export default App;