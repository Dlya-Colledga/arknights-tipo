import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import "./Dossier.css";

const askhat = `
Я **PHP Junior разработчик**. На данный момент изучаю **Python** и его фреймворки (Django, FastAPI, Flask), чтобы писать Backend-приложения.

<h4 class="dossier-subtitle"><span>📈</span> Путь развития</h4>
Мой путь программиста начался в 2021, когда я решил писать плагины для Майнкрафт серверов (ПО <a href="https://pmmp.io" target="_blank">PocketMine-MP</a>). В 2023 я забросил это и пошел по пути бэкенд-разработчика, параллельно впервые узнав про Python. В нынешнее время я изучаю **React** и **Python**, т.к. из Backend-разработчика я захотел стать **Fullstack**.

<h4 class="dossier-subtitle"><span>💼</span> Портфолио</h4>
<p>Ниже будут мои простые проекты, а плагины <a href="https://pmmp.io" target="_blank">PocketMine-MP</a> я решил не добавлять.</p>

<div class="portfolio-grid">
    <a href="https://github.com/Taskov1ch-Repos/anixart-desktop" target="_blank" class="project-card">
        <h5>Anixart Desktop</h5>
        <p>Десктопный клиент Anixart. (В разработке)</p>
        <span class="project-link">GitHub ↗</span>
    </a>
    <a href="https://github.com/Taskov1ch/py-limbo" target="_blank" class="project-card">
        <h5>PY-LIMBO</h5>
        <p>Знаменитые ключи Limbo у вас на Windows.</p>
        <span class="project-link">GitHub ↗</span>
    </a>
    <a href="https://github.com/dlya-Colledga/animeshka" target="_blank" class="project-card">
        <h5>ANIMESHKA</h5>
        <p>Проект для колледжа.</p>
        <span class="project-link">GitHub ↗</span>
    </a>
</div>


<h4 class="dossier-subtitle"><span>🎮</span> Личные интересы</h4>

<div class="anixart-container">

  <h4 class="dossier-subtitle"><span>📊</span> Статистика по аниме</h4>
  <p class="anixart-warning">Это данные за 2 ноября 2025</p>

  <div class="anixart-profile-header">
    <img class="anixart-banner" src="https://s3.anixmirai.com/channels/covers/993bc046-28ee-4b2d-bb2e-8d9fcde55f82_mTu9OWxsi1.jpg" alt="Anixart Banner">
    <img class="anixart-avatar" src="https://s.anixmirai.com/avatars/ba39ec50ca9a2455e134259692681990eac064ca_rhpskc9Lrh.jpg" alt="Anixart Avatar">
    <h6 class="anixart-nickname">"Клац-Клац"</h6>
    <p class="anixart-register-date">Вступил на путь аниме 6 марта 2022 года</p>
  </div>

  <div class="anixart-stats">
    <h1>Статистика просмотра</h1>
    <div class="stats-layout">
      <div class="stats-chart-container">
        <div class="stats-chart" style="background: conic-gradient(
          #4CAF50 0% 51.2%,   /* Просмотрено: 577 */
          #2196F3 51.2% 55.4%, /* Смотрит: 47 */
          #9E9E9E 55.4% 96.2%, /* В планах: 460 */
          #FFC107 96.2% 99.3%, /* Отложено: 35 */
          #F44336 99.3% 100%  /* Брошено: 8 */
        );"></div>
        <span class="chart-total">1127</span>
      </div>
      <ul class="stats-legend">
        <li><span style="background: #4CAF50;"></span>Просмотрено: 577</li>
        <li><span style="background: #2196F3;"></span>Смотрит: 47</li>
        <li><span style="background: #9E9E9E;"></span>В планах: 460</li>
        <li><span style="background: #FFC107;"></span>Отложено: 35</li>
        <li><span style="background: #F44336;"></span>Брошено: 8</li>
      </ul>
    </div>
    <div class="anixart-stats-text">
      <p><strong>Всего просмотренных серий (сериалы + фильмы + OVA):</strong> 8.124 серий.</p>
      <p><strong>Всего времени потрачено на аниме (сумма длительности всех просмотренных аниме):</strong> ~3.184 часов (~132 дня, 16 часов).</p>
    </div>
  </div>

  <div class="anixart-features">
    <h1>Анализ жанров</h1>
    <ul class="feature-bar-list">
      <li><span>Экшен</span><div class="feature-bar"><div class="bar-fill" style="width: 12%; background: #F44336;">12%</div></div></li>
      <li><span>Фэнтези</span><div class="feature-bar"><div class="bar-fill" style="width: 10%; background: #9C27B0;">10%</div></div></li>
      <li><span>Комедия</span><div class="feature-bar"><div class="bar-fill" style="width: 7%; background: #FFEB3B; color: #333;">7%</div></div></li>
      <li><span>Сёнен</span><div class="feature-bar"><div class="bar-fill" style="width: 5%; background: #FF9800;">5%</div></div></li>
    </ul>
  </div>

  <div class="anixart-lovely-animes">
    <h1>Любимые аниме</h1>
    <div class="anime-grid">
      <div class="anime-card" style="background-image: url('https://s.anixmirai.com/posters/i7MbLPyo0g2Yv7ppuZCIsyW1ZDiV96.jpg')"><span>Owari no Seraph</span></div>
      <div class="anime-card" style="background-image: url('https://s.anixmirai.com/posters/6pCWUtX8IRiDQbd1NHsKrBQW3P3BzN.jpg')"><span>Cyberpunk: Edgerunners</span></div>
      <div class="anime-card" style="background-image: url('https://s.anixmirai.com/posters/4cp3779y4dk6efjrA2idNpcGJRDEvf.jpg')"><span>To Be Hero X</span></div>
      <div class="anime-card" style="background-image: url('https://s.anixmirai.com/posters/pLCX0Y3jseBsAFN5brx6OdDMV1AWy9.jpg')"><span>No Game No Life</span></div>
      <div class="anime-card" style="background-image: url('https://s.anixmirai.com/posters/bK3PKgwWyVgU3Jfq8xubL9sXW3DBfN.jpg')"><span>Cike Wu Liuqi</span></div>
    </div>
    <p class="anime-footer"><i>Ещё бы Маг Целителя...</i></p>
  </div>
</div>

<div class="mlbb-container">
<h4 class="dossier-subtitle"><span>🎮</span> Mobile Legends: Bang Bang</h4>
  <div class="mlbb-header">
    <img class="mlbb-avatar" src="https://i.ibb.co/1Jt22dwP/151-20250920225437.png" alt="MLBB Avatar">
    <h6 class="mlbb-nickname">Microsoft Excel</h6>
  </div>

  <div class="mlbb-rank">
    <span>Максимальный ранг:</span>
    <div class="rank-info">
      <img src="https://static.wikia.nocookie.net/mobile-legends/images/4/42/Mythical_Glory.png" alt="Mythical Glory">
      <span>Мифическая честь</span>
    </div>
  </div>

  <div class="mlbb-hero-card">
    <div class="mlbb-hero-image" style="background-image: url('https://i.ibb.co/0RMtW7m2/lunox.webp')">
      <span>Любимый герой: Люнокс (Lunox)</span>
    </div>
    <div class="mlbb-hero-stats">
      <p><strong>Самый дорогой скин:</strong> Небесная богиня (~20.000 сомов)</p>
      <p><strong>Самый высокий титул:</strong> Топ 7 Люнокс Кыргызстана</p>
    </div>
  </div>
</div>
`;

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

const elaman = `
Меня зовут Эсеналиев Эламан, мне 16 лет. Я увлекаюсь программированием в сфере информационных технологий и боксом. На данный момент я учусь на втором курсе колледжа. Родился 1 февраля 2009 года, и я единственный ребенок в семье. Вместе с родителями живем в Бишкеке.

С детства меня интересовали технологии, и я всегда стремился понять, как работают различные устройства и программы. Мое увлечение программированием стало более осознанным в последние несколько лет, и я активно развиваюсь в этой области, совершенствуя свои навыки.

Бокс стал для меня важной частью жизни — он помогает не только поддерживать физическую форму, но и развивает дисциплину и силу воли. В свободное время я продолжаю обучаться, изучая новые языки программирования и тренируясь в боксе.

Семья для меня играет важную роль, и я всегда ценю их поддержку в моих начинаниях.
`;

const obama = `
# Барак Хуссейн Обама II

**Дата рождения:** 4 августа 1961, Гонолулу, Гавайи, США
**Профессия:** Государственный и политический деятель
**Президентство:** 44-й президент США (20 января 2009 — 20 января 2017)
**Нобелевская премия мира:** 2009

## Биография

* Первый афроамериканец на посту президента США от одной из двух крупнейших партий.
* Сын студента из Кении и белой американки (не потомок рабов).
* Выпускник Колумбийского университета и Гарвардской школы права.
* Первый афроамериканец-редактор Harvard Law Review.
* Работал общественным организатором, адвокатом в области гражданских прав, преподавал конституционное право.

## Политическая карьера

* Сенатор штата Иллинойс (1997—2004)
* Сенатор США (2005—2008)
* Основные достижения в Конгрессе:

  * Законодательство по регулированию оружия
  * Повышение прозрачности бюджета
  * Законы о мошенничестве на выборах, лоббизме, изменении климата, ядерной безопасности

## Президентские выборы

* **2008:** победа над Джоном Маккейном (52,9% голосов, 365 голосов коллегии выборщиков)
* **2012:** победа над Миттом Ромни (51,1% голосов, 332 голоса коллегии выборщиков)

## Достижения на посту президента

* Получил Нобелевскую премию мира за укрепление международной дипломатии (2009)
* Высокий рейтинг одобрения на момент ухода с поста (60%)
* Положительная оценка историков и мировой публики
* Сильное влияние на репутацию США в мире

**Проживание после президентства:** Вашингтон, США
`;

const merlin = `
<div class="dossier-not-found">
  <div class="icon-404">
    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="currentColor" class="pulsating-icon">
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
    </svg>
  </div>
  <h3 class="text-404">404</h3>
  <p class="subtext-404">DOSSIER NOT FOUND</p>
</div>
`;

const DOSSIER_CONTENT = {
	left: {
		name: "Александр \"Kil1er\" Шеховцов",
		bio: sasha
	},
	center: {
		name: "Асхат \"Taskov1ch\" Тынаев",
		bio: askhat
	},
	right: {
		name: "Эламан Эсеналиев",
		bio: elaman
	},
	collabLeft: {
		name: "Эльдияр \"RED\" Сатарбеков",
		bio: obama
	},
	collabRight: {
		name: "Мерлин \"...\" Мекинов",
		bio: merlin,
		overflow: false
	}
};

export const Dossier = ({ selectedMask }) => {
	const content = DOSSIER_CONTENT[selectedMask];

	return (
		<div className={`dossier-container ${selectedMask ? "visible" : ""}`}>
			{content && (
				<div className="dossier-content">

					<h2 className="dossier-title">{content.name}</h2>

					<div className={"dossier-body" + ((content.overflow ?? true) ? " allow-overflow" : "")}>
						<ReactMarkdown rehypePlugins={[rehypeRaw]}>
							{content.bio}
						</ReactMarkdown>
					</div>
				</div>
			)}
		</div>
	);
};