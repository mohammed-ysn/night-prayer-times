import { useEffect, useLayoutEffect, useRef } from 'react';

/**
 * Eases from 0 to `target` (and then follows it), calling `apply` each frame. The value never
 * touches React state, so a frame costs one DOM write instead of a re-render. `apply` is also
 * re-run whenever its identity changes, so layout changes keep the current position.
 */
export function useSmoothValue(target: number, apply: (v: number) => void, tau = 340) {
	const cur = useRef(0);
	const goal = useRef(target);
	const raf = useRef(0);
	const fn = useRef(apply);

	useLayoutEffect(() => {
		fn.current = apply;
		fn.current(cur.current);
	}, [apply]);

	useEffect(() => {
		goal.current = target;
		if (raf.current) return;
		let last = performance.now();
		const step = (n: number) => {
			const dt = Math.min(64, n - last);
			last = n;
			cur.current += (goal.current - cur.current) * (1 - Math.exp(-dt / tau));
			if (Math.abs(goal.current - cur.current) < 1e-4) {
				cur.current = goal.current;
				raf.current = 0;
			} else {
				raf.current = requestAnimationFrame(step);
			}
			fn.current(cur.current);
		};
		raf.current = requestAnimationFrame(step);
	}, [target, tau]);

	useEffect(
		() => () => {
			cancelAnimationFrame(raf.current);
			raf.current = 0;
		},
		[]
	);
}
