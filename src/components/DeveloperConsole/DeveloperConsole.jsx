import React, { useState, useEffect, useRef } from "react";
import "./DeveloperConsole.css";

export const DeveloperConsole = ({ logs, onCommand, onClose }) => {
	const [inputValue, setInputValue] = useState("");
	const [commandHistory, setCommandHistory] = useState([]);
	const [historyIndex, setHistoryIndex] = useState(0);
	const [tempInputValue, setTempInputValue] = useState("");
	const logsEndRef = useRef(null);
	const inputRef = useRef(null);

	useEffect(() => {
		logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [logs]);

	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();
		const command = inputValue.trim();
		if (command) {
			onCommand(command);
			const newHistory = [...commandHistory, command];
			setCommandHistory(newHistory);
			setHistoryIndex(newHistory.length);
			setInputValue("");
			setTempInputValue("");
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === "ArrowUp") {
			e.preventDefault();
			if (commandHistory.length === 0) return;

			if (historyIndex === commandHistory.length) {
				setTempInputValue(inputValue);
			}

			const newIndex = Math.max(0, historyIndex - 1);
			setHistoryIndex(newIndex);
			setInputValue(commandHistory[newIndex]);
		} else if (e.key === "ArrowDown") {
			e.preventDefault();
			if (commandHistory.length === 0) return;

			const newIndex = Math.min(commandHistory.length, historyIndex + 1);
			setHistoryIndex(newIndex);

			if (newIndex === commandHistory.length) {
				setInputValue(tempInputValue);
			} else {
				setInputValue(commandHistory[newIndex]);
			}
		}
	};

	const formatTime = (date) => {
		return date.toTimeString().split(" ")[0];
	};

	return (
		<div className="developer-console">
			<div className="console-header">
				<span>Developer Console</span>
				<button className="console-close-btn" onClick={onClose}>
					&times;
				</button>
			</div>
			<div className="console-output">
				{logs.map((log, index) => (
					<div key={index} className={`console-log-line log-${log.type}`}>
						<span className="log-time">[{formatTime(log.time)}]</span>
						<span className="log-message">{log.message}</span>
					</div>
				))}
				<div ref={logsEndRef} />
			</div>
			<form className="console-input-form" onSubmit={handleSubmit}>
				<span className="console-prompt">&gt;</span>
				<input
					ref={inputRef}
					type="text"
					className="console-input"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onKeyDown={handleKeyDown}
					autoCorrect="off"
					autoCapitalize="none"
					spellCheck="false"
				/>
			</form>
		</div>
	);
};