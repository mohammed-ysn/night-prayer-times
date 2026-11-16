/** Soft colour glows behind the page. Static, so no per-frame cost. */
export function AuroraBackground() {
	return (
		<div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
			<div className="absolute -left-24 -top-20 size-[380px] rounded-full bg-aurora-1/30 blur-[100px]" />
			<div className="absolute -bottom-28 -right-24 size-[360px] rounded-full bg-aurora-3/15 blur-[100px]" />
			<div className="absolute right-0 top-1/3 size-[240px] rounded-full bg-aurora-4/10 blur-[90px]" />
		</div>
	);
}
