import { useCallback, useEffect, useRef, useState } from 'react';

/** Exponentially smoothed value: interruptible, always heading for the latest goal. */
export function useSmooth(initial: number) {
	const [value, setValue] = useState(initial);
	const cur = useRef(initial);
	const goal = useRef(initial);
	const tau = useRef(150);
	const raf = useRef(0);

	useEffect(
		() => () => {
			cancelAnimationFrame(raf.current);
			raf.current = 0;
		},
		[]
	);

	const to = useCallback((g: number, t = 150) => {
		goal.current = g;
		tau.current = t;
		if (raf.current) return;
		let last = performance.now();
		const step = (n: number) => {
			const dt = Math.min(64, n - last);
			last = n;
			cur.current += (goal.current - cur.current) * (1 - Math.exp(-dt / tau.current));
			if (Math.abs(goal.current - cur.current) < 1e-4) {
				cur.current = goal.current;
				raf.current = 0;
			} else {
				raf.current = requestAnimationFrame(step);
			}
			setValue(cur.current);
		};
		raf.current = requestAnimationFrame(step);
	}, []);

	return [value, to] as const;
}

/** Eases from 0 to `target` once on mount, then just follows it. */
export function useIntroValue(target: number) {
	const [v, to] = useSmooth(0);
	useEffect(() => {
		to(target, 340);
	}, [target, to]);
	return v;
}
