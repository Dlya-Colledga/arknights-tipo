import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import "./Dossier.css";

const sasha = `
<p class="dossier-intro">
  <strong>"Меня зовут Шеховцов Александр..."</strong>
</p>

Я IT-специалист и геймдев-разработчик с **более чем четырёхлетним опытом** работы в сфере создания игр на **Unreal Engine 5** и **C++**.

<h4 class="dossier-subtitle"><span>🚀</span> Путь в Gamedev</h4>

Мой путь в геймдев начался с интереса к программированию и визуальным технологиям — со временем это переросло в серьёзную практику: разработку игровых механик, систем взаимодействия, AI-поведения и оптимизацию производительности под современные движки.

<h4 class="dossier-subtitle"><span>🌍</span> Проекты и Философия</h4>

За эти годы я создал и участвовал в разработке нескольких проектов — от прототипов с уникальными игровыми идеями до полноценных уровней с проработанной атмосферой и визуальным сторителлингом.

Основной акцент я делаю на **реализм, глубину мира** и **техническое качество** исполнения.

<hr class="dossier-divider" />

<h4 class="dossier-subtitle"><span>⚙️</span> Ключевые специализации</h4>

<ul class="dossier-skills">
  <li>Геймплейная логика</li>
  <li>Интеграция Blueprints + C++</li>
  <li>Работа с физикой и анимацией</li>
  <li>Разработка AI</li>
  <li>Оптимизация кода и уровней</li>
</ul>
`;

const DOSSIER_CONTENT = {
	left: {
		name: "Асхат \"Taskov1ch\"",
		bio: "Subject exhibits exceptional close-quarters combat abilities. Origin unknown. Psychological evaluation inconclusive. Recommended for high-risk, low-survivability missions."
	},
	center: {
		name: "Александр \"Kil1er\" Шеховцов",
		bio: sasha
	},
	right: {
		name: "Эламан \"NONE\"",
		bio: "Long-range specialist. Flawless mission record. Subject displays sociopathic tendencies, but remains highly effective. Do not allow interaction with civilian populations."
	}
};

export const Dossier = ({ selectedMask }) => {
	const content = DOSSIER_CONTENT[selectedMask];

	return (
		<div className={`dossier-container ${selectedMask ? "visible" : ""}`}>
			{content && (
				<div className="dossier-content">

					<h2 className="dossier-title">{content.name}</h2>

					<div className="dossier-body">
						<ReactMarkdown rehypePlugins={[rehypeRaw]}>
							{content.bio}
						</ReactMarkdown>
					</div>
				</div>
			)}
		</div>
	);
};