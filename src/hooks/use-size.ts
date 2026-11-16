import { useLayoutEffect, useRef, useState } from 'react';

/** Content-box size of an element, kept up to date by a ResizeObserver. */
export function useSize<T extends HTMLElement>() {
	const ref = useRef<T>(null);
	const [size, setSize] = useState({ w: 390, h: 844 });
	useLayoutEffect(() => {
		const el = ref.current;
		if (!el) return;
		const ro = new ResizeObserver(([e]) =>
			setSize({ w: e.contentRect.width, h: e.contentRect.height })
		);
		ro.observe(el);
		return () => ro.disconnect();
	}, []);
	return [ref, size] as const;
}
