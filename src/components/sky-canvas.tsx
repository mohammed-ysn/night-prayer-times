import { useEffect, useRef } from 'react';
import { createSkyRenderer, type SkyTarget } from './sky-renderer';

/**
 * The whole sky (stars, moon, skyline, water) in one WebGL canvas. If WebGL is unavailable the
 * canvas stays blank and the CSS gradient behind it shows instead.
 *
 * Each effect run makes its own canvas: disposing a renderer loses the canvas's GL context for
 * good, so reusing the element would hand StrictMode's second mount a dead context.
 */
export function SkyCanvas({ phase, moonPhase, f, moonOn }: SkyTarget) {
	const hostRef = useRef<HTMLDivElement>(null);
	const target = useRef<SkyTarget>({ phase, moonPhase, f, moonOn });
	const poke = useRef<() => void>(() => {});

	useEffect(() => {
		target.current = { phase, moonPhase, f, moonOn };
		poke.current();
	}, [phase, moonPhase, f, moonOn]);

	useEffect(() => {
		const host = hostRef.current;
		if (!host) return;
		const canvas = document.createElement('canvas');
		canvas.className = 'sk-canvas';
		host.appendChild(canvas);
		const renderer = createSkyRenderer(canvas, () => target.current);
		poke.current = renderer.poke;
		return () => {
			poke.current = () => {};
			renderer.dispose();
			canvas.remove();
		};
	}, []);

	return <div ref={hostRef} aria-hidden="true" />;
}
