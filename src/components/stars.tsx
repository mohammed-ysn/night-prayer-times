import { useMemo, type CSSProperties } from 'react';

function lcg(seed: number) {
	const state = { s: seed };
	return () => {
		state.s = (state.s * 16807) % 2147483647;
		return state.s / 2147483647;
	};
}

function makeStars(count: number, seed: number) {
	const next = lcg(seed);
	return Array.from({ length: count }, (_, i) => {
		const big = next() > 0.88;
		return {
			i,
			x: next() * 1600,
			y: next() * 1000,
			r: big ? 1.1 + next() * 0.6 : 0.35 + next() * 0.7,
			o: 0.3 + next() * 0.7,
			twinkle: next() > 0.55
		};
	});
}

// Twinkling stars share a few animated groups: one animation per star restyled ~100 nodes a frame.
const GROUPS = [
	{ delay: -0.5, duration: 3.1 },
	{ delay: -2.2, duration: 4.3 },
	{ delay: -4.1, duration: 5.2 },
	{ delay: -1.4, duration: 3.8 },
	{ delay: -3.3, duration: 4.8 }
];

function star(s: ReturnType<typeof makeStars>[number]) {
	return <circle key={s.i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={s.o} />;
}

/** Fixed starfield (seeded, so it never reshuffles). Its overall opacity follows `--stars`. */
export function Stars({ count = 260, seed = 5 }: { count?: number; seed?: number }) {
	const stars = useMemo(() => makeStars(count, seed), [count, seed]);
	return (
		<svg
			className="stars"
			viewBox="0 0 1600 1000"
			preserveAspectRatio="xMidYMid slice"
			aria-hidden="true"
		>
			{GROUPS.map((g, gi) => (
				<g
					key={gi}
					className="twinkle"
					style={{ '--d': `${g.delay}s`, '--dur': `${g.duration}s` } as CSSProperties}
				>
					{stars.filter((s) => s.twinkle && s.i % GROUPS.length === gi).map(star)}
				</g>
			))}
			{stars.filter((s) => !s.twinkle).map(star)}
		</svg>
	);
}
