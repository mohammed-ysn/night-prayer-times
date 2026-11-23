import { memo, useId } from 'react';

/** A moon with a real terminator for the given phase. */
export const Moon = memo(function Moon({ phase, size }: { phase: number; size: number }) {
	const id = useId().replace(/:/g, '');
	const pp = phase < 0.5 ? phase : 1 - phase;
	const flip = phase >= 0.5;
	const k = Math.cos(2 * Math.PI * pp);
	const lit = `M0 -50 A50 50 0 0 1 0 50 A${Math.abs(k) * 50} 50 0 0 ${k > 0 ? 0 : 1} 0 -50 Z`;
	return (
		<svg
			width={size}
			height={size}
			viewBox="-50 -50 100 100"
			style={{ overflow: 'visible' }}
			aria-hidden="true"
		>
			<defs>
				<radialGradient id={`${id}l`} cx="0.36" cy="0.34" r="0.9">
					<stop offset="0" stopColor="#fffdf2" />
					<stop offset="0.55" stopColor="#ebeaf6" />
					<stop offset="1" stopColor="#aab1d8" />
				</radialGradient>
				<radialGradient id={`${id}d`} cx="0.4" cy="0.4" r="0.8">
					<stop offset="0" stopColor="#222a5e" />
					<stop offset="1" stopColor="#10143a" />
				</radialGradient>
				<clipPath id={`${id}c`}>
					<path d={lit} transform={flip ? 'scale(-1 1)' : undefined} />
				</clipPath>
			</defs>
			<circle r="50" fill={`url(#${id}d)`} opacity="0.92" />
			<g clipPath={`url(#${id}c)`}>
				<circle r="50" fill={`url(#${id}l)`} />
				<g fill="#8c93c2" opacity="0.3">
					<ellipse cx="-16" cy="-14" rx="17" ry="12" />
					<ellipse cx="14" cy="-6" rx="11" ry="9" />
					<ellipse cx="-4" cy="20" rx="13" ry="8" />
					<circle cx="24" cy="20" r="6" />
					<circle cx="-30" cy="12" r="5" />
				</g>
				<g fill="#fff" opacity="0.35">
					<circle cx="30" cy="-24" r="3" />
					<circle cx="-8" cy="-34" r="2.2" />
					<circle cx="6" cy="34" r="2.6" />
				</g>
			</g>
			<circle r="49.6" fill="none" stroke="rgba(255,255,255,0.1)" />
		</svg>
	);
});
