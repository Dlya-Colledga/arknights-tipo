import React, { useState, useEffect, useRef } from 'react';
import './FakeTerminal.css';

/**
 * Полноценный компонент терминала, заменяющий FakeTerminal.
 * Экспортируется как ИМЕНОВАННЫЙ экспорт для совместимости с App.jsx.
 * * @param {object} props
 * @param {() => void} props.onLoaded - Функция, вызываемая для запуска основного контента (при `./arknights.sh`)
 */
export const FakeTerminal = ({ onLoaded }) => {
	// Состояние для хранения истории вывода и введенных команд
	const [history, setHistory] = useState([
		{ type: 'output', content: 'Welcome to Arknights Terminal (v0.1.0)' },
		{ type: 'output', content: 'Type "ls" to list files or "./<file>" to execute.' },
	]);
	// Состояние для текущей строки ввода
	const [input, setInput] = useState('');
	// Состояние для скрытия терминала (при запуске .sh)
	const [isHidden, setIsHidden] = useState(false);

	// Ссылки для авто-фокуса и авто-прокрутки
	const inputRef = useRef(null);
	const terminalEndRef = useRef(null);
	const terminalRef = useRef(null);

	// Список файлов и URL репозитория
	const files = ['arknights.sh', 'gh.sh', '1519.sh'];
	const repoUrl = 'https://github.com/taskov1ch/arknights-tipo/tree/collab';

	// Функция для прокрутки вниз
	const scrollToBottom = () => {
		terminalEndRef.current?.scrollIntoView({ behavior: 'auto' });
	};

	// Прокрутка при обновлении истории
	useEffect(scrollToBottom, [history]);

	// Фокус на поле ввода при загрузке
	useEffect(() => {
		// Небольшая задержка, чтобы фокус сработал после перехода css
		const timer = setTimeout(() => inputRef.current?.focus(), 50);
		return () => clearTimeout(timer);
	}, []);

	// Обработка логики команд
	const processCommand = (command) => {
		const trimmedCommand = command.trim();
		let output = []; // Массив для новых строк вывода

		switch (trimmedCommand) {
			case 'ls':
				output.push({ type: 'output', content: files.join('  ') });
				break;

			case './arknights.sh':
				output.push({ type: 'output', content: 'Initializing main interface...' });
				// Короткая задержка для "ощущения" запуска
				setTimeout(() => {
					setIsHidden(true); // Скрыть терминал
					onLoaded();         // Запустить основной контент (вызывает handleTerminalLoaded в App.jsx)
				}, 300);
				break;

			case './gh.sh':
				output.push({ type: 'output', content: `Opening ${repoUrl} in new tab...` });
				window.open(repoUrl, '_blank');
				break;

			case './1519.sh':
				output.push({ type: 'output', content: 'INFO: ./1519.sh is a placeholder for future content.' });
				break;

			case '':
				// Просто новая строка, без вывода
				break;

			default:
				// Команда не найдена
				output.push({ type: 'output', content: `bash: command not found: ${trimmedCommand.split(' ')[0]}` });
				break;
		}

		// Добавляем и команду, и ее вывод в историю
		setHistory(prev => [...prev, { type: 'prompt', content: command }, ...output]);
	};

	// Обработчик отправки формы (нажатие Enter)
	const handleSubmit = (e) => {
		e.preventDefault();
		processCommand(input);
		setInput(''); // Очистить поле ввода

		// Гарантируем прокрутку после обновления состояния
		setTimeout(scrollToBottom, 0);
	};

	// Фокус на вводе по клику на любую область терминала
	const focusInput = () => {
		inputRef.current?.focus();
	};

	// Рендеринг истории
	const renderHistory = () => {
		return history.map((line, index) => {
			if (line.type === 'output') {
				// Обычный вывод
				return <p key={index} className="output-line">{line.content}</p>;
			}
			if (line.type === 'prompt') {
				// Строка, которую ввел пользователь
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
			className={`fake-terminal ${isHidden ? 'hidden' : ''}`}
			onClick={focusInput} // Клик для фокуса
		>
			{/* Область вывода истории */}
			<div className="terminal-output">
				{renderHistory()}
				{/* Пустой div для автопрокрутки */}
				<div ref={terminalEndRef} />
			</div>

			{/* Форма для ввода новой команды */}
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
					/>
				</div>
			</form>
		</div>
	);
};

// 'export default' УБРАН, так как мы используем именованный экспорт 'export const FakeTerminal'