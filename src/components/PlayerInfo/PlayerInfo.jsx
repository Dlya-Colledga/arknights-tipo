import React, { useState, useEffect } from "react";
import { MdSignalCellularAlt } from "react-icons/md";
import "./PlayerInfo.css";

const getRandomPing = (status) => {
	if (status) {
		return Math.floor(Math.random() * (67 - 10 + 1)) + 10;
	} else {
		return Math.floor(Math.random() * (999 - 200 + 1)) + 200;
	}
};

export const PlayerInfo = ({ data, className }) => {
	const [ping, setPing] = useState(0);

	useEffect(() => {
		const initialPing = getRandomPing(data.status);
		setPing(initialPing);

		const interval = setInterval(() => {
			setPing(getRandomPing(data.status));
		}, 1000);

		return () => clearInterval(interval);
	}, [data.status]);

	const nickname = data.codename.replace("Кодовое имя: ", "");

	return (
		<div className={`player-info-block ${className || ""}`}>
			<img src={data.avatar} alt={nickname} className="player-info-avatar" />
			<span className="player-info-name">{nickname}</span>

			<span className={`player-info-ping ${data.status ? "good" : "bad"}`}>
				<MdSignalCellularAlt className="ping-icon" />
				<span>{ping} ms</span>
			</span>
		</div>
	);
};