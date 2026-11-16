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
	return Array.from({ length: count }, () => {
		const big = next() > 0.88;
		return {
			x: next() * 400,
			y: next() * 800,
			r: big ? 1.1 + next() * 0.6 : 0.35 + next() * 0.7,
			o: 0.3 + next() * 0.7,
			twinkle: next() > 0.55,
			delay: -next() * 6,
			duration: 2.4 + next() * 3.6
		};
	});
}

/** Fixed starfield (seeded, so it never reshuffles). Its overall opacity follows `--stars`. */
export function Stars({ count = 80, seed = 5 }: { count?: number; seed?: number }) {
	const stars = useMemo(() => makeStars(count, seed), [count, seed]);
	return (
		<svg
			className="stars"
			viewBox="0 0 400 800"
			preserveAspectRatio="xMidYMid slice"
			aria-hidden="true"
		>
			{stars.map((s, i) => (
				<circle
					key={i}
					className={s.twinkle ? 'twinkle' : undefined}
					style={{ '--d': `${s.delay}s`, '--dur': `${s.duration}s` } as CSSProperties}
					cx={s.x}
					cy={s.y}
					r={s.r}
					fill="#fff"
					opacity={s.o}
				/>
			))}
		</svg>
	);
}
