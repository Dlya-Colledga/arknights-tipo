import React, { useState, useEffect, useRef } from 'react';
import './FakeTerminal.css';

const TERMINAL_LINES = [
	'Connecting to RHODES-ISLAND-MAIN-SERVER...',
	'Connection established.',
	'Authenticating user: DOKUTAH...',
	'[auth.log] User DOKUTAH identified. Access Level: 8 (COMMANDER)',
	'Loading user profile... OK',
	'Syncing combat records... 100%',
	'Syncing operator database... 100%',
	'Checking Originium levels in main vessel... STABLE',
	'Loading S.W.E.E.P daemon... OK',
	'Mounting /data/dossier-cache...',
	'Filesystem check on /dev/sda1... clean.',
	'Initializing PRTS (Primitive Rhodes-Island Terminal Service)...',
	'PRTS status: ONLINE. Awaiting instructions.',
	'Checking system integrity...',
	'[core.sys] All modules loaded successfully.',
	'Applying user preferences: "theme_dark_minimal.cfg"',
	'sudo start arknights-core-interface',
	'[sudo] Password: ****************',
	'Password accepted.',
	'Starting process "arknights-core-interface" (PID: 8192)...',
	'Binding to port 443... OK',
	'Loading visual assets... 100%',
	'Initializing mask projection layer... OK',
	'Finalizing environment setup...',
	'System ready. Welcome, Dokutah.',
	'...',
	'BOOT SEQUENCE COMPLETE.',
];

// Принимаем новый prop onComplete
export const FakeTerminal = ({ isVisible, onComplete }) => {
	const [lines, setLines] = useState([]);
	const [isGlitching, setIsGlitching] = useState(false); // Новое состояние для глитча
	const containerRef = useRef(null);

	useEffect(() => {
		if (isVisible) {
			setLines([]);
			setIsGlitching(false); // Сбрасываем глитч при каждом показе
			let lineIndex = 0;

			const intervalId = setInterval(() => {
				if (lineIndex < TERMINAL_LINES.length) {
					setLines((prev) => [...prev, TERMINAL_LINES[lineIndex]]);
					lineIndex++;
				} else {
					// ---- Начало новой логики ----
					clearInterval(intervalId);
					setIsGlitching(true); // Включаем глитч

					// Устанавливаем таймер на длительность глитч-эффекта
					const glitchTimer = setTimeout(() => {
						setIsGlitching(false);
						// Сообщаем родительскому компоненту, что мы закончили
						if (onComplete) {
							onComplete();
						}
					}, 500); // Глитч-эффект на 500ms

					return () => clearTimeout(glitchTimer);
					// ---- Конец новой логики ----
				}
			}, 100); // Скорость печати строк

			return () => clearInterval(intervalId);
		}
	}, [isVisible, onComplete]); // Добавляем onComplete в зависимости

	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.scrollTop = containerRef.current.scrollHeight;
		}
	}, [lines]);

	return (
		<div
			// Добавляем класс .glitching
			className={`fake-terminal-container ${isVisible ? 'visible' : ''} ${isGlitching ? 'glitching' : ''
				}`}
			ref={containerRef}
		>
			{lines.map((line, index) => (
				<p key={index} className="terminal-line">
					<span className="terminal-prompt">{`[${Date.now() + index}] > `}</span>
					{line}
				</p>
			))}
			{/* Курсор теперь скрывается во время глитча */}
			{isVisible &&
				lines.length < TERMINAL_LINES.length &&
				!isGlitching && <div className="terminal-cursor" />}
		</div>
	);
};