/** A circular arc with a point-at-fraction helper. Angles in degrees, clockwise from 3 o'clock. */
export function makeArc({
	cx = 150,
	cy = 150,
	r,
	start,
	sweep
}: {
	cx?: number;
	cy?: number;
	r: number;
	start: number;
	sweep: number;
}) {
	const p = (f: number, rr = r) => {
		const a = ((start + sweep * f) * Math.PI) / 180;
		return { x: cx + rr * Math.cos(a), y: cy + rr * Math.sin(a) };
	};
	const s = p(0);
	const e = p(1);
	return { d: `M ${s.x} ${s.y} A ${r} ${r} 0 ${sweep > 180 ? 1 : 0} 1 ${e.x} ${e.y}`, p };
}
