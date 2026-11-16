const glow = (colour: string) => `radial-gradient(closest-side, var(${colour}), transparent)`;

/** Soft colour glows behind the page. Gradients, not blur filters, so scrolling stays cheap. */
export function AuroraBackground() {
	return (
		<div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
			<div
				className="absolute -left-[186px] -top-[170px] size-[560px] opacity-30"
				style={{ background: glow('--aurora-1') }}
			/>
			<div
				className="absolute -bottom-[192px] -right-[176px] size-[520px] opacity-15"
				style={{ background: glow('--aurora-3') }}
			/>
			<div
				className="absolute -right-[80px] top-[calc(33.333%-80px)] size-[400px] opacity-10"
				style={{ background: glow('--aurora-4') }}
			/>
		</div>
	);
}
