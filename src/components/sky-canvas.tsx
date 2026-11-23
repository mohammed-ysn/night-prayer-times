import { useEffect, useRef } from 'react';
import { createSkyRenderer, type SkyTarget } from './sky-renderer';

/**
 * The whole sky (stars, moon, skyline, water) in one WebGL canvas. If WebGL is unavailable the
 * canvas stays blank and the CSS gradient behind it shows instead.
 */
export function SkyCanvas({ phase, moonPhase, f, moonOn }: SkyTarget) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const target = useRef<SkyTarget>({ phase, moonPhase, f, moonOn });
	const poke = useRef<() => void>(() => {});

	useEffect(() => {
		target.current = { phase, moonPhase, f, moonOn };
		poke.current();
	}, [phase, moonPhase, f, moonOn]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const renderer = createSkyRenderer(canvas, () => target.current);
		poke.current = renderer.poke;
		return () => {
			poke.current = () => {};
			renderer.dispose();
		};
	}, []);

	return <canvas ref={canvasRef} className="sk-canvas" aria-hidden="true" />;
}
