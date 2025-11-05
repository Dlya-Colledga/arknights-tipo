import React, { useState, useEffect, useRef, useMemo } from "react";
import { FiWifi, FiLayers, FiAlertTriangle } from "react-icons/fi";
import "./FakeTerminal.css";
import { ASSETS } from "../../constants";

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

const galleryImageModules = import.meta.glob('../../assets/gallery/*.*', { eager: true, as: 'url' });

const arknightsLogs = [
	"Initializing Arknights client v2.1.0...",
	"Secure connection established. (Server: EU-Central)",
	"Authenticating user [Merlin]...",
	"Token [REDACTED] accepted.",
	"Loading game assets... (0/381)",
	"  [PATCH] Downloading manifest...",
	"  [INFO] Verifying local files...",
	"  [OK] File integrity check passed.",
	"Loading... [||||......] 20%",
	"Loading... [||||||||..] 80%",
	"Loading... [||||||||||] 100%",
	"Assets loaded successfully.",
	"Syncing operator database...",
	"  [INFO] Operator Amiya: Status [Ready]",
	"  [INFO] Operator Kal'tsit: Status [Present]",
	"  [WARN] Operator 'Doctor': Status [AWAKENING]",
	"Finalizing handshake...",
	"All systems go. Launching main interface...",
];

const DraggableIcon = ({ id, src, label, onDoubleClick, initialPos }) => {
	const [position, setPosition] = useState(initialPos || { x: 50, y: 50 });
	const [isDragging, setIsDragging] = useState(false);
	const dragOffset = useRef({ x: 0, y: 0 });
	const iconRef = useRef(null);

	const handleMouseDown = (e) => {
		if (e.button !== 0) return;
		setIsDragging(true);
		const rect = iconRef.current.getBoundingClientRect();
		dragOffset.current = {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
		};
		e.preventDefault();
	};

	const handleMouseMove = (e) => {
		if (!isDragging) return;
		const parentRect = iconRef.current.parentElement.getBoundingClientRect();
		setPosition({
			x: e.clientX - parentRect.left - dragOffset.current.x,
			y: e.clientY - parentRect.top - dragOffset.current.y,
		});
	};

	const handleMouseUp = () => {
		setIsDragging(false);
	};

	useEffect(() => {
		if (isDragging) {
			window.addEventListener("mousemove", handleMouseMove);
			window.addEventListener("mouseup", handleMouseUp);
		} else {
			window.removeEventListener("mousemove", handleMouseMove);
			window.addEventListener("mouseup", handleMouseUp);
		}
		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
		};
	}, [isDragging]);

	return (
		<div
			ref={iconRef}
			className="desktop-icon"
			style={{ top: position.y, left: position.x }}
			onMouseDown={handleMouseDown}
			onDoubleClick={onDoubleClick}
		>
			<img src={src} alt={label} />
			<span>{label}</span>
		</div>
	);
};

const ArknightsConsole = ({ onLoaded }) => {
	const [displayedLogs, setDisplayedLogs] = useState([]);
	const consoleEndRef = useRef(null);

	useEffect(() => {
		consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [displayedLogs]);

	useEffect(() => {
		const runLogSequence = async () => {
			await sleep(500);
			for (const line of arknightsLogs) {
				setDisplayedLogs(prev => [...prev, line]);
				await sleep(80 + Math.random() * 100);
			}
			await sleep(1000);
			onLoaded();
		};
		runLogSequence();
	}, [onLoaded]);

	return (
		<div className="arknights-console-overlay">
			{displayedLogs.map((line, index) => (
				<p key={index}>{line}</p>
			))}
			<div ref={consoleEndRef} />
		</div>
	);
};

export const FakeTerminal = ({ onLoaded, onRun1519 = () => { } }) => {
	const [isVideoFinished, setIsVideoFinished] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [showArknightsConsole, setShowArknightsConsole] = useState(false);
	const [currentTime, setCurrentTime] = useState(new Date());
	const warningAudioRef = useRef(null);
	const [showGallery, setShowGallery] = useState(false);
	const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);
	const imageList = useMemo(() => Object.values(galleryImageModules), []);

	useEffect(() => {
		const timer = setInterval(() => setCurrentTime(new Date()), 1000);
		return () => clearInterval(timer);
	}, []);

	useEffect(() => {
		warningAudioRef.current = new Audio('/audio/warning.ogg');
	}, []);

	const handleVideoEnd = () => {
		setIsVideoFinished(true);
	};

	const handleArknightsLaunch = () => {
		setShowArknightsConsole(true);
	};

	const handle1519Launch = () => {
		if (warningAudioRef.current) {
			warningAudioRef.current.play();
		}
		setShowModal(true);
	};

	const handleModalConfirm = () => {
		setShowModal(false);
		onRun1519();
	};

	const handleModalCancel = () => {
		setShowModal(false);
	};

	const handleGalleryLaunch = () => {
		setShowGallery(true);
	};

	const handleGalleryClose = () => {
		setShowGallery(false);
		setSelectedGalleryImage(null);
	};

	const handleGalleryImageClick = (src) => {
		setSelectedGalleryImage(src);
	};

	const handleFullscreenImageClose = () => {
		setSelectedGalleryImage(null);
	};

	const renderBootScreen = () => {
		return (
			<div className={`boot-screen ${isVideoFinished ? "hidden" : ""}`}>
				<video
					src="/video/terminal_login.webm"
					autoPlay
					playsInline
					onEnded={handleVideoEnd}
					className="boot-video"
				/>
			</div>
		);
	};

	const renderDesktop = () => {
		return (
			<div className={`desktop-environment ${isVideoFinished ? "visible" : ""}`}>
				<div className="top-menubar">
					<div className="menubar-left">
						<strong>Analysis OS</strong>
					</div>
					<div className="menubar-center">
						{currentTime.toLocaleDateString([], {
							weekday: 'short',
							month: 'short',
							day: '2-digit',
						})}
						&nbsp;&nbsp;
						{currentTime.toLocaleTimeString([], {
							hour: '2-digit',
							minute: '2-digit',
						})}
					</div>
					<div className="menubar-right">
						<span>EN</span>
						<FiWifi />
					</div>
				</div>

				<div className="desktop-screen">
					<DraggableIcon
						id="arknights"
						src="/image/arknights_icon.webp"
						label="Arknights"
						onDoubleClick={handleArknightsLaunch}
						initialPos={{ x: 40, y: 40 }}
					/>
					<DraggableIcon
						id="1519"
						src="/image/what.webp"
						label="~cor██pt.dll"
						onDoubleClick={handle1519Launch}
						initialPos={{ x: 40, y: 150 }}
					/>
					<DraggableIcon
						id="gallery"
						src={ASSETS.images.gallery}
						label="Галерея"
						onDoubleClick={handleGalleryLaunch}
						initialPos={{ x: 40, y: 260 }}
					/>
					<div className="activation-watermark">
						<h1>Активируйте Analisys OS</h1>
						Для активации нажмите сочетание ALT + F4
					</div>
				</div>

				{showModal && (
					<div className="modal-overlay">
						<div className="modal-window modern">
							<div className="modal-title-bar">
								<span>Предупреждение</span>
								<button className="modal-close" onClick={handleModalCancel}></button>
							</div>
							<div className="modal-content">
								<div className="modal-icon warning-icon">
									<FiAlertTriangle size={40} />
								</div>
								<div className="modal-text">
									<h3>Неизвестный издатель</h3>
									<p>Запуск этого файла может привести к непредсказуемым последствиям. Вы уверены, что хотите продолжить?</p>
								</div>
							</div>
							<div className="modal-buttons">
								<button className="modal-button-cancel" onClick={handleModalCancel}>Отмена</button>
								<button className="modal-button-confirm" onClick={handleModalConfirm}>Продолжить</button>
							</div>
						</div>
					</div>
				)}

				{showGallery && (
					<div className="modal-overlay gallery-overlay" onClick={handleGalleryClose}>
						<div className="modal-window modern gallery-window" onClick={(e) => e.stopPropagation()}>
							<div className="modal-title-bar">
								<span>Галерея</span>
								<button className="modal-close" onClick={handleGalleryClose}></button>
							</div>
							<div className="modal-content gallery-content">
								<div className="gallery-grid">
									{imageList.map((src, index) => (
										<div
											key={index}
											className="gallery-item"
											onClick={() => handleGalleryImageClick(src)}
										>
											<img src={src} alt={`gallery-img-${index}`} loading="lazy" />
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				)}

				{selectedGalleryImage && (
					<div className="fullscreen-image-view" onClick={handleFullscreenImageClose}>
						<img src={selectedGalleryImage} alt="Fullscreen" onClick={(e) => e.stopPropagation()} />
					</div>
				)}

				{showArknightsConsole && <ArknightsConsole onLoaded={onLoaded} />}
			</div>
		);
	};

	return (
		<div className="fake-gui-container">
			{renderBootScreen()}
			{renderDesktop()}
		</div>
	);
};
