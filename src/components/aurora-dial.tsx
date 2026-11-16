import { makeArc } from '@/lib/arc';
import type { Night } from '@/lib/night';
import { formatCountdown } from '@/lib/time';
import { cn } from '@/lib/utils';

// 270° gauge, open at the bottom: Maghrib bottom-left, Fajr bottom-right.
const { d: ARC, p: point } = makeArc({ r: 118, start: 135, sweep: 270 });
const track = {
	d: ARC,
	fill: 'none',
	stroke: 'url(#aurora)',
	strokeWidth: 16,
	strokeLinecap: 'round'
} as const;

export function AuroraDial({ night, now }: { night: Night; now: Date }) {
	const { f, phase, inNight, target, eyebrow, caption } = night;
	const filled = phase === 'before' ? 0 : f;
	const marker = point(f);
	const fill = {
		pathLength: 100,
		strokeDasharray: `${filled * 100} 200`,
		style: { transition: 'stroke-dasharray 1s linear' }
	};

	return (
		<section className="relative mx-auto aspect-square w-full max-w-[340px]">
			<svg
				viewBox="0 0 300 300"
				className="size-full overflow-visible"
				role="img"
				aria-label={`Night is ${Math.round(f * 100)}% over`}
			>
				<defs>
					<linearGradient id="aurora" x1="0" y1="1" x2="1" y2="0">
						<stop offset="0" stopColor="var(--aurora-1)" />
						<stop offset="0.45" stopColor="var(--aurora-2)" />
						<stop offset="0.75" stopColor="var(--aurora-3)" />
						<stop offset="1" stopColor="var(--aurora-4)" />
					</linearGradient>
					<filter id="aurora-glow" x="-30%" y="-30%" width="160%" height="160%">
						<feGaussianBlur stdDeviation="7" />
					</filter>
				</defs>
				<path {...track} opacity={0.16} />
				{filled > 0 && (
					<>
						<path {...track} {...fill} filter="url(#aurora-glow)" opacity={0.55} />
						<path {...track} {...fill} />
					</>
				)}
				{[1 / 3, 1 / 2, 2 / 3].map((k) => (
					<circle key={k} cx={point(k).x} cy={point(k).y} r={2} className="fill-white/60" />
				))}
				{inNight && (
					<g
						style={{
							transform: `translate(${marker.x}px, ${marker.y}px)`,
							transition: 'transform 1s linear'
						}}
					>
						<circle r={18} fill="#fff" opacity={0.18} filter="url(#aurora-glow)" />
						<circle r={7} fill="#fff" />
					</g>
				)}
			</svg>

			<div className="absolute inset-0 flex flex-col items-center justify-center text-center">
				<p className="text-sm text-muted-foreground">{eyebrow}</p>
				<p
					className="mt-1 bg-gradient-to-b from-white to-[#c9bcff] bg-clip-text font-mono text-5xl font-extralight tabular-nums tracking-tight text-transparent"
					aria-label={eyebrow}
				>
					{target ? formatCountdown(target.getTime() - now.getTime()) : '—'}
				</p>
				<p
					className={cn(
						'mt-2 rounded-full px-3 py-1 text-xs',
						phase === 'last' ? 'bg-primary/15 text-primary' : 'bg-white/8 text-muted-foreground'
					)}
				>
					{caption}
				</p>
			</div>
		</section>
	);
}
