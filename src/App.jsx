import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import "./App.css";

const TIMINGS = {
	SHOW_SUBTITLE: 1100,
	PRESTART_HIDE: 1500,
	BLACK_SCREEN: 2000,
	MASK_PRE_MOVE: 7000,
	MASK_MOVING: 8000,
	LOGO_SHOW: 8000,
	MASK_ANIMATE: 10000,
	LOADING_HIDE: 7000,
	LOADING_TEXT_INTERVAL: 1000,
};

const SUBTITLE_TEXT = "Путешествуйте вперед, Эндминистратор (Мерлин)";

const LOADING_MESSAGES = [
	"Загрузка анимаций...",
	"Загрузка изображений...",
	"Подготовка таймингов...",
	"Компиляция шейдеров...",
	"Рассчет хитбоксов...",
	"Подготовка событийных обработчиков...",
	"Отрисовка масок...",
];

// <-- ДОБАВЛЕНО: Данные для тултипов -->
const TOOLTIP_DATA = {
	left: "Имя: Асхат\nКодовое имя: Taskov1ch",
	center: "Имя: Александр\nКодовое имя: Kil1er",
	right: "Имя: Эламан\nКодовое имя: NONE",
};
// <-- КОНЕЦ ДОБАВЛЕНИЯ -->

const ASSETS = {
	images: {
		doctor: "/image/doctor.webp",
		doctor1: "/image/doctor_1.webp",
		doctor2: "/image/doctor_2.webp",
		logo: "/image/logo.svg",
	},
	videos: {
		percila: "/video/percila_for_merlin.webm",
		glitch: "/video/glitch.webm",
		cosmos: "/video/bg_cosmos.webm",
	},
	audio: {
		glitch: "/audio/glitch.ogg",
		background: "/audio/bg.ogg",
	},
};

const useAppPhases = (animationImageLoaded, refs) => {
	const [prestartPhase, setPrestartPhase] = useState("showing");
	const [mainVideoPhase, setMainVideoPhase] = useState("percila");
	const [showMask, setShowMask] = useState(false);
	const [maskPhase, setMaskPhase] = useState("idle");
	const [showCyberLogo, setShowCyberLogo] = useState(false);
	const [showSubtitle, setShowSubtitle] = useState(false);

	const startMainApp = useCallback(() => {
		if (!animationImageLoaded) {
			setTimeout(() => startMainApp(), 100);
			return;
		}

		setShowMask(true);
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
		setTimeout(() => setMaskPhase("animating"), TIMINGS.MASK_ANIMATE);
	}, [animationImageLoaded, refs.audioRef]);

	const handlePercilaEnd = useCallback(() => {
		setMainVideoPhase("glitch");
		refs.glitchVideoRef.current?.play().catch(console.error);
	}, [refs.glitchVideoRef]);

	const handleGlitchEnd = useCallback(() => {
		setMainVideoPhase("blackScreen");
		refs.glitchAudioRef.current?.play().catch(console.error);

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
	}, [refs.glitchAudioRef, startMainApp]);

	const handleSpacePress = useCallback(() => {
		if (prestartPhase !== "showing") return;

		setPrestartPhase("hiding");
		refs.percilaVideoRef.current?.play().catch(console.error);

		setTimeout(() => {
			setShowSubtitle(true);
		}, TIMINGS.SHOW_SUBTITLE);

		setTimeout(() => setPrestartPhase("hidden"), TIMINGS.PRESTART_HIDE);
	}, [prestartPhase, refs.percilaVideoRef]);

	return {
		prestartPhase,
		mainVideoPhase,
		showMask,
		maskPhase,
		showCyberLogo,
		showSubtitle,
		handlePercilaEnd,
		handleGlitchEnd,
		handleSpacePress,
	};
};

const useLoadingBox = (showMask) => {
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

const VideoLayer = ({ videoRef, className, src, onEnded, preload = "auto", ...props }) => (
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

const MaskedVideo = ({ id, className, animationImageLoaded }) => {
	const style = useMemo(() => ({
		"--animation-mask-image": animationImageLoaded ? `url('${ASSETS.images.doctor2}')` : "none"
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

// <-- ДОБАВЛЕНО: Компонент Tooltip -->
const Tooltip = ({ hoveredMask, position }) => {
	if (!hoveredMask) return null;

	const content = TOOLTIP_DATA[hoveredMask];
	const textLines = content.split('\n');

	// Добавляем небольшой отступ, чтобы курсор был у угла тултипа
	const style = {
		top: position.y + 5,
		left: position.x + 5,
	};

	return (
		<div className="mask-tooltip" style={style}>
			{textLines.map((line, index) => (
				<p key={index}>{line}</p>
			))}
		</div>
	);
};
// <-- КОНЕЦ ДОБАВЛЕНИЯ -->


function App() {
	const [animationImageLoaded, setAnimationImageLoaded] = useState(false);
	const [hoveredMask, setHoveredMask] = useState(null);
	// <-- ДОБАВЛЕНО: Состояние для позиции тултипа -->
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

	const particlesInit = useCallback(async (engine) => {
		await loadSlim(engine);
	}, []);

	const particlesOptions = useMemo(() => ({
		fpsLimit: 60,
		particles: {
			color: { value: "#000" },
			links: {
				color: "#000",
				distance: 150,
				enable: true,
				opacity: 0.4,
				width: 1,
			},
			move: {
				direction: "none",
				enable: true,
				outModes: { default: "out" },
				random: true,
				speed: 1,
				straight: false,
			},
			number: {
				density: { enable: true, value_area: 800 },
				value: 80,
			},
			opacity: { value: 1 },
			shape: { type: "circle" },
			size: { value: 2 },
		},
		detectRetina: true,
	}), []);

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
				document.documentElement.requestFullscreen();
				e.preventDefault();
				handleSpacePress();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [handleSpacePress]);

	// <-- ДОБАВЛЕНО: Обработчик движения мыши -->
	const handleMouseMove = (e) => {
		setTooltipPosition({ x: e.clientX, y: e.clientY });
	};
	// <-- КОНЕЦ ДОБАВЛЕНИЯ -->

	const showMultipleMasks = maskPhase === "moving" || maskPhase === "animating";

	const appClasses = [
		"App",
		hoveredMask ? "mask-is-hovered" : "",
		hoveredMask ? `hovering-${hoveredMask}` : ""
	].join(" ");

	return (
		<div className={appClasses}>
			<Particles
				id="tsparticles"
				init={particlesInit}
				options={particlesOptions}
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					zIndex: 0,
				}}
			/>

			<div className={`darken-overlay ${hoveredMask ? "visible" : ""}`} />

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

			<div className={`black-screen-fade ${mainVideoPhase === "blackScreen" ? "visible" : ""}`} />

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

			{showMultipleMasks && (
				<div className="hitbox-layer">
					<div
						className="hitbox hitbox-left"
						onMouseEnter={() => setHoveredMask('left')}
						onMouseLeave={() => setHoveredMask(null)}
						onMouseMove={handleMouseMove} // <-- ДОБАВЛЕНО
					/>
					<div
						className="hitbox hitbox-center"
						onMouseEnter={() => setHoveredMask('center')}
						onMouseLeave={() => setHoveredMask(null)}
						onMouseMove={handleMouseMove} // <-- ДОБАВЛЕНО
					/>
					<div
						className="hitbox hitbox-right"
						onMouseEnter={() => setHoveredMask('right')}
						onMouseLeave={() => setHoveredMask(null)}
						onMouseMove={handleMouseMove} // <-- ДОБАВЛЕНО
					/>
				</div>
			)}


			<img
				src={ASSETS.images.logo}
				alt="Logo"
				className="main-logo"
			/>

			<div className={`logo-container ${showCyberLogo ? "visible" : ""}`}>
				<div className="title-background">
					<h3 className="logo-title">Команда</h3>
					<div className="logo-stripe" />
				</div>
				<img src={ASSETS.images.logo} alt="Logo" className="cyber-logo-image" />
			</div>

			{showCyberLogo && (
				<footer className="copyright">
					<p>&copy; 2025 Askhat <a href="https://taskov1ch.github.io" target="_blank" rel="noopener noreferrer">Taskov1ch</a>. Создано в ознакомительных целях.</p>
					<p>Данный сайт не имеет (наверное) никакого отношения к играм Arknights, Arknights: Endfield, компании YoStar и разработчикам Hypergryph.</p>
				</footer>
			)}

			{prestartPhase !== "hidden" && (
				<div className={`prestart ${prestartPhase}`}>
					<div className="letterbox top" />
					<div className="letterbox bottom" />
					<div className="disclaimer-box">
						<h2>Дисклеймер</h2>
						<p>
							На сайте используются ассеты с 20 FPS и разрешением 1080p/720p.
							Сделано это не только для оптимизации, но и из-за того, что
							Асхат ленивый уе###.
						</p>
						<p>
							На сайте применяются эффекты глитча, маски, фоновые видео,
							анимации, партиклы и так далее, поэтому рекомендуется{" "}
							<strong>
								не использовать сайт на Intel Pentium со встроенной графикой
							</strong>
							.
						</p>
						<p>
							Все ассеты взяты с открытых источников и предоставляются "как
							есть". Используя сайт, вы соглашаетесь с возможными небольшими
							визуальными и аудио артефактами.
						</p>
						<p>
							Соблюдайте осторожность: некоторые эффекты могут вызвать
							дискомфорт у людей с чувствительностью к мерцающим изображениям
							или резким переходам.
						</p>
						<div className="prompt">Нажмите [ПРОБЕЛ] для продолжения</div>
					</div>
				</div>
			)}

			{loadingBoxState !== "hidden" && (
				<div className={`loading-letterbox ${loadingBoxState}`}>
					<p>{currentLoadingText}</p>
				</div>
			)}

			<Tooltip hoveredMask={hoveredMask} position={tooltipPosition} />

			<audio ref={glitchAudioRef} src={ASSETS.audio.glitch} preload="auto" />
			<audio ref={audioRef} src={ASSETS.audio.background} loop />
		</div>
	);
}

export default App;