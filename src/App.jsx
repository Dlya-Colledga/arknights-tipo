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
import { FakeTerminal } from "./components/FakeTerminal/FakeTerminal";
import { PlayerInfo } from "./components/PlayerInfo/PlayerInfo";
import { TOOLTIP_DATA } from "./constants";
import { ModeSwitcher } from "./components/ModeSwitcher/ModeSwitcher";
import { LoreSubtitles } from "./components/LoreSubtitles/LoreSubtitles";

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
	const terminalAudioRef = useRef(null);
	const glitchVideoRef = useRef(null);

	const [sequence1519, setSequence1519] = useState("idle");
	const [terminalResetKey, setTerminalResetKey] = useState(0);
	const glitch1519VideoRef = useRef(null);
	const loreVideoRef = useRef(null);
	const glitch1519VideoRef2 = useRef(null);

	const [maskSet, setMaskSet] = useState("arknights");
	const [isModeTransitioning, setIsModeTransitioning] = useState(false);
	const [showCollabSwitcher, setShowCollabSwitcher] = useState(true);

	const refs = useMemo(() => ({
		perlicaVideoRef,
		audioRef,
	}), []);

	const playSfx = (soundFile) => {
		if (isMuted) return;
		try {
			const audio = new Audio(soundFile);
			audio.play().catch(e => {
				if (e.name !== "NotAllowedError") {
					console.error(`Failed to play SFX ${soundFile}:`, e);
				}
			});
		} catch (e) {
			console.error(`Failed to create SFX ${soundFile}:`, e);
		}
	};

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
		startMainApp,
		handleGlitchEnd,
		setMainVideoPhase,
	} = useAppPhases(animationImageLoaded, refs);

	const { loadingBoxState, currentLoadingText } = useLoadingBox(showMask);

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.ctrlKey && (e.key === "q" || e.key === "Q" || e.key === "й" || e.key === "Й")) {
				e.preventDefault();
				setIsConsoleOpen(prev => !prev);
			}

			const blockSpace = prestartPhase !== "showing" ||
				isConsoleOpen ||
				mainVideoPhase === "terminal" ||
				mainVideoPhase === "glitch" ||
				sequence1519 !== "idle";

			if (e.code === "Space" && !blockSpace) {
				document.documentElement.requestFullscreen().catch(console.error);
				e.preventDefault();
				handleSpacePress();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [handleSpacePress, isConsoleOpen, prestartPhase, mainVideoPhase, sequence1519]);

	useEffect(() => {
		if (mainVideoPhase === "terminal") {
			terminalAudioRef.current?.play().catch(console.error);
		} else {
			terminalAudioRef.current?.pause();
		}

		if (mainVideoPhase === "glitch") {
			terminalAudioRef.current?.pause();
			glitchVideoRef.current?.play().catch(console.error);
		}

	}, [mainVideoPhase]);

	useEffect(() => {
		if (sequence1519 === "glitch1") {
			glitch1519VideoRef.current?.play().catch(console.error);
		} else if (sequence1519 === "lore") {
			loreVideoRef.current?.play().catch(console.error);
		} else if (sequence1519 === "glitch2") {
			glitch1519VideoRef2.current?.play().catch(console.error);
		}
	}, [sequence1519]);

	const handle1519Glitch1End = () => setSequence1519("lore");
	const handle1519LoreEnd = () => setSequence1519("glitch2");
	const handle1519Glitch2End = () => {
		setSequence1519("idle");
		setMainVideoPhase("terminal");
		setTerminalResetKey(key => key + 1);
	};

	const handleRun1519 = () => {
		setMainVideoPhase("sequence_1519");
		setSequence1519("glitch1");
	};

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
			case "collab":
				if (args[0] === "on") {
					setShowCollabSwitcher(true);
					logToConsole("Collab mode switcher enabled.");
				} else if (args[0] === "off") {
					setShowCollabSwitcher(false);
					logToConsole("Collab mode switcher disabled.");
				} else {
					logToConsole("Usage: collab on|off", "error");
				}
				break;
			case "help":
				logToConsole("Available commands:");
				logToConsole("  audio mute|unmute  - Mute/unmute all audio");
				logToConsole("  audio play <file>  - Play /audio/<file>.ogg");
				logToConsole("  hitboxes on|off    - Toggle hitbox borders");
				logToConsole("  collab on|off      - Show/hide the mode switcher button");
				logToConsole("  clear              - Clear console output");
				logToConsole("  help               - Show this help message");
				logToConsole("  source, gh, github - Website source code")
				break;
			case "source":
			case "gh":
			case "github":
				window.open("https://github.com/dlya-colledga/arknights-tipo", "_blank");
				logToConsole("Opening project source in a new tab...");
				break;
			default:
				logToConsole(`Unknown command: ${cmd}. Type "help" for commands.`, "error");
		}
	};

	const handleMouseMove = (e) => {
		setTooltipPosition({ x: e.clientX, y: e.clientY });
	};

	const getMaskSetAwareMask = (mask) => {
		if (maskSet === "arknights") {
			return mask;
		}

		if (mask === "left") return "collabLeft";
		if (mask === "right") return "collabRight";
		return null;
	};

	const handleMaskEnter = (mask) => {
		const maskName = getMaskSetAwareMask(mask);
		if (!maskName) return;

		if (!selectedMask && !isAnimating && !isModeTransitioning) {
			setHoveredMask(maskName);
			playSfx("/audio/hover.ogg");
		}
	};
	const handleMaskLeave = () => {
		if (!selectedMask && !isAnimating && !isModeTransitioning) {
			setHoveredMask(null);
		}
	};

	const handleMaskClick = (mask) => {
		const maskName = getMaskSetAwareMask(mask);
		if (!maskName || isAnimating || isModeTransitioning) return;

		const newSelectedMask = selectedMask === maskName ? null : maskName;

		playSfx("/audio/click.ogg");

		if (newSelectedMask === null && selectedMask !== null) {
			playSfx("/audio/close.ogg");
		}

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

	const handleModeToggle = () => {
		if (isAnimating || isModeTransitioning) return;

		playSfx("/audio/click.ogg");
		setIsModeTransitioning(true);
		setSelectedMask(null);
		setHoveredMask(null);

		setMaskSet(prev => {
			const newMode = prev === "arknights" ? "collab" : "arknights";

			setTimeout(() => {
				setIsModeTransitioning(false);
			}, 800);

			return newMode;
		});
	};

	const appClasses = [
		"App",
		`mask-set-${maskSet}`,
		isModeTransitioning ? "is-mode-transitioning" : "",
		showHitboxes ? "show-hitboxes" : "",
		(hoveredMask && !selectedMask && !isAnimating) ? "mask-is-hovered" : "",
		(hoveredMask && !selectedMask && !isAnimating) ? `hovering-${hoveredMask}` : "",
		selectedMask ? "mask-is-selected" : "",
		selectedMask ? `selected-${selectedMask}` : ""
	].join(" ");

	const maskedLayerClasses = [
		"masked-layer",
		`mask-set-${maskSet}`,
		isModeTransitioning ? "is-mode-transitioning" : "",
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

				<VideoLayer
					videoRef={glitchVideoRef}
					className={mainVideoPhase === "glitch" ? "visible" : ""}
					src={"/video/glitch.webm"}
					onEnded={handleGlitchEnd}
					muted={isMuted}
				/>

				{showSubtitle && mainVideoPhase === "perlica" && (
					<div className="subtitle-overlay">
						<p>{SUBTITLE_TEXT}</p>
					</div>
				)}

				<VideoLayer
					videoRef={glitch1519VideoRef}
					className={sequence1519 === "glitch1" ? "visible" : ""}
					src={"/video/glitch.webm"}
					onEnded={handle1519Glitch1End}
					muted={isMuted}
				/>
				<VideoLayer
					videoRef={loreVideoRef}
					className={sequence1519 === "lore" ? "visible" : ""}
					src={"/video/creepy_arknights_lore.webm"}
					onEnded={handle1519LoreEnd}
					muted={isMuted}
				/>
				<VideoLayer
					videoRef={glitch1519VideoRef2}
					className={sequence1519 === "glitch2" ? "visible" : ""}
					src={"/video/glitch.webm"}
					onEnded={handle1519Glitch2End}
					muted={isMuted}
				/>

				<LoreSubtitles
					videoRef={loreVideoRef}
					isVisible={sequence1519 === "lore"}
				/>
			</div>

			{mainVideoPhase === "terminal" && sequence1519 === "idle" && (
				<FakeTerminal
					key={terminalResetKey}
					onLoaded={startMainApp}
					onRun1519={handleRun1519}
				/>
			)}

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

				{maskSet === "arknights" ? (
					<>
						<PlayerInfo data={TOOLTIP_DATA.left} className="player-info-left" />
						<PlayerInfo data={TOOLTIP_DATA.center} className="player-info-center" />
						<PlayerInfo data={TOOLTIP_DATA.right} className="player-info-right" />
					</>
				) : (
					<>
						<PlayerInfo data={TOOLTIP_DATA.collabLeft} className="player-info-collab-left" />
						<PlayerInfo data={TOOLTIP_DATA.collabRight} className="player-info-collab-right" />
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
				src={maskSet === "arknights" ? ASSETS.images.logo : ASSETS.images.logo_solo}
				alt="Logo"
				className={`main-logo ${selectedMask ? "hiding" : ""}`}
			/>

			<ModeSwitcher
				currentMode={maskSet}
				onToggle={handleModeToggle}
				isVisible={showMultipleMasks && !selectedMask && showCollabSwitcher}
				isAnimating={isAnimating || isModeTransitioning}
			/>
			<CyberLogo show={showCyberLogo && !selectedMask} maskSet={maskSet} />

			{showCyberLogo && !selectedMask && <Footer />}

			{prestartPhase !== "hidden" && (
				<Prestart phase={prestartPhase} />
			)}

			{loadingBoxState !== "hidden" && (
				<LoadingBox state={loadingBoxState} text={currentLoadingText} />
			)}

			<Dossier selectedMask={selectedMask} maskSet={maskSet} />

			<Tooltip hoveredMask={hoveredMask} position={tooltipPosition} />

			<audio ref={audioRef} src={ASSETS.audio.background} loop muted={isMuted} />

			<audio
				ref={terminalAudioRef}
				src="/audio/humming.ogg"
				loop
				muted={isMuted}
			/>

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