// src/App.jsx

import { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";

function App() {
	const [prestartPhase, setPrestartPhase] = useState("showing"); // "showing", "hiding", "hidden"

	const [mainVideoPhase, setMainVideoPhase] = useState("percila"); // "percila", "glitch", "blackScreen", "main"

	const [showMask, setShowMask] = useState(false);
	const [maskPhase, setMaskPhase] = useState("idle");
	const [animationImageLoaded, setAnimationImageLoaded] = useState(false);

	const percilaVideoRef = useRef(null);
	const glitchVideoRef = useRef(null);
	const glitchAudioRef = useRef(null);
	const audioRef = useRef(null);

	useEffect(() => {
		const img = new Image();
		img.src = "/image/animation.webp";
		img.onload = () => {
			setAnimationImageLoaded(true);
		};
	}, []);

	const startMainApp = useCallback(() => {
		if (!animationImageLoaded) {
			console.log("Animation image not yet loaded, waiting...");
			setTimeout(startMainApp, 100);
			return;
		}

		setShowMask(true);

		if (audioRef.current) {
			audioRef.current.play().catch(error => {
				console.error("Audio play failed:", error);
			});
		}

		setTimeout(() => {
			setMaskPhase("pre-move");
		}, 7000);

		setTimeout(() => {
			setMaskPhase("moving");
		}, 7900);

		setTimeout(() => {
			setMaskPhase("animating");
		}, 9900);

	}, [animationImageLoaded]);

	const handleKeyDown = useCallback((event) => {
		if (event.code === "Space" && prestartPhase === "showing") {
			event.preventDefault();

			setPrestartPhase("hiding");

			percilaVideoRef.current?.play().catch(e => console.error("Percila video play failed", e));

			setTimeout(() => {
				setPrestartPhase("hidden");
			}, 1500);
		}
	}, [prestartPhase]);

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [handleKeyDown]);

	const handlePercilaEnd = () => {
		setMainVideoPhase("glitch");
		glitchVideoRef.current?.play().catch(e => console.error("Glitch video play failed", e));
	};

	const handleGlitchEnd = () => {
		setMainVideoPhase("blackScreen");
		glitchAudioRef.current?.play().catch(e => console.error("Glitch audio play failed", e));

		setTimeout(() => {
			setMainVideoPhase("main");
			startMainApp();
		}, 2000);
	};


	return (
		<div className="App">
			<div className="video-prelayer-container">
				<video
					ref={percilaVideoRef}
					className={`video-bg background-video ${mainVideoPhase === "percila" ? "visible" : ""}`}
					src="/video/percila.webm"
					preload="auto"
					muted
					onEnded={handlePercilaEnd}
					playsInline
				/>
				<video
					ref={glitchVideoRef}
					className={`video-bg background-video ${mainVideoPhase === "glitch" ? "visible" : ""}`}
					src="/video/glitch.webm"
					preload="auto"
					onEnded={handleGlitchEnd}
					playsInline
				/>
			</div>

			<div className={`black-screen-fade ${mainVideoPhase === "blackScreen" ? "visible" : ""}`} />

			<div
				className={`masked-layer ${showMask ? "visible" : ""} ${maskPhase}`}
				style={{ "--animation-mask-image": animationImageLoaded ? "url('/image/animation.webp')" : "none" }}
			>
				<video
					id="video-prelayer"
					className="video-bg"
					src="/video/bg_cosmos.webm"
					autoPlay
					muted
					loop
				/>
			</div>

			<img
				src="/image/logo.svg"
				alt="Logo"
				className={`main-logo ${maskPhase === "moving" || maskPhase === "animating" ? "hiding" : ""
					} ${showMask ? "visible" : ""}`}
			/>

			{prestartPhase !== "hidden" && (
				<div className={`prestart ${prestartPhase}`}>
					<div className="letterbox top"></div>
					<div className="letterbox bottom"></div>
					<div className="disclaimer-box">
						<h2>Дисклеймер</h2>
						<p>
							На сайте используются ассеты с 20 FPS и разрешением 1080p/720p.
							Сделано это не только для оптимизации, но и из-за того, что
							Асхат ленивый уе###.
						</p>
						<p>
							На сайте применяются эффекты глитча, маски, фоновые видео и
							анимации, поэтому рекомендуется{" "}
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

			<audio ref={glitchAudioRef} src="/audio/glitch.ogg" preload="auto" />
			<audio ref={audioRef} src="/audio/bg.ogg" loop />
		</div>
	);
}

export default App;