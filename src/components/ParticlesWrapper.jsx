import React, { useCallback, useMemo } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

export const ParticlesWrapper = () => {
	const particlesInit = useCallback(async (engine) => {
		await loadSlim(engine);
	}, []);

	const particlesOptions = useMemo(() => ({
		fpsLimit: 60,
		particles: {
			color: { value: "#000" },
			links: {
				color: "#000",
				distance: 150,
				enable: true,
				opacity: 0.4,
				width: 1,
			},
			move: {
				direction: "none",
				enable: true,
				outModes: { default: "out" },
				random: true,
				speed: 1,
				straight: false,
			},
			number: {
				density: { enable: true, value_area: 800 },
				value: 80,
			},
			opacity: { value: 1 },
			shape: { type: "circle" },
			size: { value: 2 },
		},
		detectRetina: true,
	}), []);

	return (
		<Particles
			id="tsparticles"
			init={particlesInit}
			options={particlesOptions}
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
				zIndex: 0,
			}}
		/>
	);
};