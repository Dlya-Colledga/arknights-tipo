import { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";

function App() {
	const [isWaiting, setIsWaiting] = useState(true);
	const [showMask, setShowMask] = useState(false);
	const [maskPhase, setMaskPhase] = useState("idle");
	const [animationImageLoaded, setAnimationImageLoaded] = useState(false);
	const audioRef = useRef(null);

	useEffect(() => {
		const img = new Image();
		img.src = "/image/animation.webp";
		img.onload = () => {
			setAnimationImageLoaded(true);
		};
	}, []);

	const handleStart = useCallback(() => {
		if (isWaiting && animationImageLoaded) {
			setIsWaiting(false);
			setShowMask(true);

			if (audioRef.current) {
				audioRef.current.play().catch(error => {
					console.error("Audio play failed:", error);
				});
			}

			setTimeout(() => {
				setMaskPhase("moving");
			}, 1000);

			setTimeout(() => {
				setMaskPhase("animating");
			}, 3000);
		} else if (isWaiting && !animationImageLoaded) {
			console.log("Animation image not yet loaded, waiting...");
		}
	}, [isWaiting, animationImageLoaded]);

	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.code === "Space") {
				event.preventDefault();
				handleStart();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [handleStart]);

	return (
		<div className="App">
			{/* <video
				id="video-layer"
				className="video-bg"
				src="/video/bg_arknights.mp4"
				autoPlay
				muted
				loop
			/> */}

			<div
				className={`masked-layer ${showMask ? "visible" : ""} ${maskPhase}`}
				style={{ "--animation-mask-image": animationImageLoaded ? "url('/image/animation.webp')" : "none" }}
			>
				<video
					id="video-prelayer"
					className="video-bg"
					src="/video/bg_cosmos.mp4"
					autoPlay
					muted
					loop
				/>
			</div>

			<div className={`overlay ${!isWaiting ? "hidden" : ""}`}>
				<h1>Ожидание начала...</h1>
			</div>

			<audio ref={audioRef} src="/audio/bg.ogg" loop />
		</div>
	);

}

export default App;