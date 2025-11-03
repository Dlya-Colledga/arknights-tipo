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

export const FakeTerminal = ({ isVisible }) => {
	const [lines, setLines] = useState([]);
	const containerRef = useRef(null);

	useEffect(() => {
		if (isVisible) {
			setLines([]);
			let lineIndex = 0;

			const intervalId = setInterval(() => {
				if (lineIndex < TERMINAL_LINES.length) {
					setLines((prev) => [...prev, TERMINAL_LINES[lineIndex]]);
					lineIndex++;
				} else {
					clearInterval(intervalId);
				}
			}, 100);

			return () => clearInterval(intervalId);
		}
	}, [isVisible]);

	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.scrollTop = containerRef.current.scrollHeight;
		}
	}, [lines]);

	return (
		<div
			className={`fake-terminal-container ${isVisible ? 'visible' : ''}`}
			ref={containerRef}
		>
			{lines.map((line, index) => (
				<p key={index} className="terminal-line">
					<span className="terminal-prompt">{`[${Date.now() + index}] > `}</span>
					{line}
				</p>
			))}
			{isVisible && lines.length < TERMINAL_LINES.length && (
				<div className="terminal-cursor" />
			)}
		</div>
	);
};