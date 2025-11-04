import React, { useState, useEffect, useRef } from "react";
import "./FakeTerminal.css";
import { REPO_URL } from "../../constants";

const bootLogs = [
	"Booting primary kernel...",
	"Checking file systems... [OK]",
	"Loading system modules... (8/8)",
	"  [+] mcore.sys",
	"  [+] rhodes.dev",
	"  [+] ursus.net",
	"  [+] kazimierz.drv",
	"  [+] siracusa.io",
	"  [+] laterano.net",
	"  [+] babel.mod",
	"  [+] kernel_panic.hdl",
	"Initializing Originium interface... DONE",
	"Connecting to Rhodes Island mainframe...",
	"Connection established.",
	"Authenticating... [Merlin]",
	"Authentication successful.",
	"Loading Arts assets... [||||||||||||||||||||] 100%",
	"Syncing operator database...",
	"  [INFO] Found 281 operators.",
	"  [WARN] Askhat: Status [Elevated]",
	"  [WARN] Alexander: Status [Present]",
	"  [INFO] Eleman: Status [Annoying]",
	"Finalizing UI components...",
	"Starting Arknights Interface v2.0...",
	"Welcome, Merlin.",
];

const sleep = (ms) => new Promise(res => setTimeout(res, ms));


export const FakeTerminal = ({ onLoaded, onRun1519 = () => { } }) => {
	const [history, setHistory] = useState([
		{ type: "output", content: "Welcome to Arknights Terminal (v0.1.0)" },
		{
			type: "output", content: "Type 'ls' to list files or './ <file>' to execute."
		},
	]);
	const [input, setInput] = useState("");
	const [isHidden, setIsHidden] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const inputRef = useRef(null);
	const terminalEndRef = useRef(null);
	const terminalRef = useRef(null);

	const files = ["arknights.sh", "gh.sh", "1519.sh"];

	const scrollToBottom = () => {
		terminalEndRef.current?.scrollIntoView({ behavior: "auto" });
	};

	useEffect(scrollToBottom, [history]);

	useEffect(() => {
		if (!isLoading) {
			const timer = setTimeout(() => inputRef.current?.focus(), 50);
			return () => clearTimeout(timer);
		}
	}, [isLoading]);

	const runBootSequence = async () => {
		for (const line of bootLogs) {
			setHistory(prev => [...prev, { type: "log", content: line }]);
			await sleep(40 + Math.random() * 50);
		}
		await sleep(500);
		setIsHidden(true);
		onLoaded();
	};

	const processCommand = (command) => {
		const trimmedCommand = command.trim();
		let output = [];

		setHistory(prev => [...prev, { type: "prompt", content: command }]);

		switch (trimmedCommand) {
			case "ls":
				const fileContent = files.map(file => {
					if (file.startsWith("1519.sh")) {
						return "<span class='terminal-danger'>1519.sh (DON\'T OPEN)</span>";
					}
					return file;
				}).join("  ");

				output.push({ type: "output", content: fileContent });
				break;

			case "./arknights.sh":
				setIsLoading(true);
				output.push({ type: "output", content: "Initializing main interface..." });
				setHistory(prev => [...prev, ...output]);
				runBootSequence();
				return;

			case "./gh.sh":
				output.push({ type: "output", content: `Opening ${repoUrl} in new tab...` });
				window.open(REPO_URL, "_blank");
				break;

			case "./1519.sh":
				onRun1519();
				return;

			case "":
				break;

			default:
				output.push({ type: "output", content: `bash: command not found: ${trimmedCommand.split(" ")[0]}` });
				break;
		}

		setHistory(prev => [...prev, ...output]);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (isLoading) return;
		processCommand(input);
		setInput("");
		setTimeout(scrollToBottom, 0);
	};

	const focusInput = () => {
		if (!isLoading) {
			inputRef.current?.focus();
		}
	};

	const renderHistory = () => {
		return history.map((line, index) => {
			if (line.type === "output") {
				return <p
					key={index}
					className="output-line"
					dangerouslySetInnerHTML={{ __html: line.content }}
				/>;
			}
			if (line.type === "log") {
				return <p key={index} className="log-line">{line.content}</p>;
			}
			if (line.type === "prompt") {
				return (
					<div key={index} className="input-line-history">
						<span className="prompt">user@arknights:~$</span>
						<span className="input-history">{line.content}</span>
					</div>
				);
			}
			return null;
		});
	};

	return (
		<div
			ref={terminalRef}
			className={`fake-terminal ${isHidden ? "hidden" : ""}`}
			onClick={focusInput}
		>
			<div className="terminal-output">
				{renderHistory()}
				<div ref={terminalEndRef} />
			</div>

			{!isLoading && (
				<form onSubmit={handleSubmit} className="terminal-input-form">
					<div className="input-line-current">
						<span className="prompt">user@arknights:~$</span>
						<input
							ref={inputRef}
							type="text"
							className="terminal-input"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							autoComplete="off"
							autoCapitalize="off"
							autoCorrect="off"
							spellCheck="false"
							disabled={isLoading}
						/>
					</div>
				</form>
			)}
		</div>
	);
};