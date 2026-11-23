import { useCallback, useRef, type CSSProperties, type ReactNode } from 'react';
import { useSmoothValue } from '@/hooks/use-smooth';
import { useSize } from '@/hooks/use-size';
import { moonPhase } from '@/lib/moon';
import type { Night } from '@/lib/night';
import { formatCountdown, formatTime } from '@/lib/time';
import { Moon } from './moon';
import { Stars } from './stars';
import './skyline.css';

// The scene is drawn in a 400×360 box with the waterline at y=200.
const VB_W = 400;
const VB_H = 360;
const BASE = 200;
// Drawn 1.5× wider than the screen and cropped, so the mosque stays large on a phone.
const SCENE = 1.5;
// The land and water run on far beyond the drawing so a wide window never sees an edge.
const EXT = 2400;

const windows: [number, number][] = [
	[31, 191],
	[52, 187],
	[52, 193],
	[70, 194],
	[350, 181],
	[350, 189],
	[370, 192],
	[180, 186],
	[200, 186],
	[220, 186],
	[100, 195],
	[300, 195],
	[392, 194]
];

function City() {
	return (
		<>
			<rect className="sk-far" x={-EXT} y="150" width={EXT} height="60" />
			<rect className="sk-far" x={VB_W} y="124" width={EXT} height="86" />
			<rect className="sk-mid" x={-EXT} y="172" width={EXT} height="38" />
			<rect className="sk-mid" x={VB_W} y="160" width={EXT} height="50" />
			<path
				className="sk-far"
				d="M0 150 C30 132 60 142 100 128 S170 118 215 132 S300 124 340 120 S390 126 400 124 V210 H0Z"
			/>
			<path
				className="sk-mid"
				d="M0 172 C50 158 90 170 140 160 S230 150 280 162 S360 156 400 160 V210 H0Z"
			/>
			<g className="sk-near">
				<rect x={-EXT} y="190" width={EXT} height="10" />
				<rect x={VB_W} y="190" width={EXT} height="10" />
				{/* main hall + dome */}
				<rect x="160" y="172" width="80" height="28" />
				<path d="M170 172 V166 A30 30 0 0 1 230 166 V172Z" />
				<rect x="196" y="130" width="8" height="8" />
				<path d="M200 130 V116" stroke="currentColor" strokeWidth="1.4" />
				<circle cx="200" cy="113" r="2.6" />
				{/* minarets */}
				{[132, 268].map((x) => (
					<g key={x}>
						<rect x={x - 4} y="112" width="8" height="88" />
						<rect x={x - 7} y="130" width="14" height="3.5" />
						<polygon points={`${x - 5},112 ${x + 5},112 ${x},94`} />
						<path d={`M${x} 94 V86`} stroke="currentColor" strokeWidth="1.2" />
						<circle cx={x} cy="84" r="2" />
					</g>
				))}
				{/* side domes */}
				<path d="M84 200 V190 A16 16 0 0 1 116 190 V200Z" />
				<path d="M284 200 V190 A16 16 0 0 1 316 190 V200Z" />
				{/* houses */}
				<rect x="0" y="190" width="18" height="10" />
				<rect x="20" y="184" width="22" height="16" />
				<rect x="44" y="178" width="16" height="22" />
				<rect x="62" y="188" width="18" height="12" />
				<rect x="320" y="186" width="20" height="14" />
				<rect x="342" y="176" width="16" height="24" />
				<rect x="360" y="184" width="22" height="16" />
				<rect x="384" y="190" width="16" height="10" />
			</g>
			<g className="sk-lit">
				{windows.map(([x, y], i) => (
					<circle key={i} cx={x} cy={y} r="1.15" />
				))}
			</g>
		</>
	);
}

interface SkylineProps {
	/** Tonight, or null while there are no times to show. */
	night: Night | null;
	now: Date;
	/** Shown in place of the countdown when there is no night yet. */
	status?: string;
	/** Rendered at the top of the sky (date, source switch). */
	header?: ReactNode;
}

/**
 * The hero: a moonlit shoreline. The sky takes its colour from the phase of the night, the moon
 * crosses it as the night passes and sets behind the mosque, and each mark is a lamp that lights
 * once its time has passed.
 */
export function Skyline({ night, now, status, header }: SkylineProps) {
	const [ref, { w, h }] = useSize<HTMLDivElement>();
	const moonEl = useRef<HTMLDivElement>(null);
	const pathEl = useRef<HTMLDivElement>(null);

	const phase = night?.phase ?? 'between';
	const moonOn = night?.inNight ?? false;
	const eyebrow = night?.eyebrow ?? 'Tonight';
	const caption = night?.caption ?? status ?? '';
	const countdown = night ? formatCountdown(night.target.getTime() - now.getTime()) : null;
	const split = countdown ? countdown.lastIndexOf(':') : 0;
	const [hm, ss] = countdown ? [countdown.slice(0, split), countdown.slice(split)] : ['', ''];

	const scale = (w * SCENE) / VB_W;
	const yHor = h - VB_H * scale + BASE * scale;

	// Moon and its reflection are positioned straight on the DOM each frame: no re-render.
	const place = useCallback(
		(f: number) => {
			const lift = Math.sin(Math.PI * f);
			const cx = w * 0.12 + w * 0.76 * f;
			const cy = yHor + 26 - (yHor + 26 - h * 0.33) * lift;
			if (moonEl.current)
				moonEl.current.style.transform = `translate3d(${cx - 34}px, ${cy - 34}px, 0)`;
			if (pathEl.current) {
				pathEl.current.style.transform = `translate3d(${cx - 9 * scale}px, 0, 0)`;
				pathEl.current.style.opacity = String(moonOn ? (0.22 + 0.55 * lift) * 0.4 : 0);
			}
		},
		[w, h, yHor, scale, moonOn]
	);
	useSmoothValue(night ? night.f : 0.5, place);

	return (
		<div className="sky sk" data-phase={phase} data-idle={night ? undefined : ''}>
			<div className="sky-bg" />
			<div className="sk-glow" style={{ top: yHor - 230, height: 300 }} aria-hidden="true" />
			<Stars />

			<div ref={ref} className="sk-col">
				<div
					className="sk-moon"
					aria-hidden="true"
					ref={moonEl}
					style={{ opacity: moonOn ? 1 : 0 }}
				>
					<div className="sk-moon-halo" />
					<Moon phase={moonPhase(now)} size={68} />
				</div>

				<svg
					className="sk-scene"
					viewBox={`0 0 ${VB_W} ${VB_H}`}
					preserveAspectRatio="xMidYMax slice"
					aria-hidden="true"
				>
					<defs>
						<linearGradient id="sk-water" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0" stopColor="var(--water-a)" />
							<stop offset="1" stopColor="#03040c" />
						</linearGradient>
						<linearGradient id="sk-fade" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0" stopColor="#fff" stopOpacity="0.9" />
							<stop offset="0.5" stopColor="#fff" stopOpacity="0.25" />
							<stop offset="1" stopColor="#fff" stopOpacity="0" />
						</linearGradient>
						<mask
							id="sk-reflect-mask"
							maskUnits="userSpaceOnUse"
							x={-EXT}
							y={BASE}
							width={VB_W + EXT * 2}
							height={VB_H - BASE}
						>
							<rect
								x={-EXT}
								y={BASE}
								width={VB_W + EXT * 2}
								height={VB_H - BASE}
								fill="url(#sk-fade)"
							/>
						</mask>
						<g id="sk-city">
							<City />
						</g>
					</defs>

					<use href="#sk-city" />
					<rect
						x={-EXT}
						y={BASE}
						width={VB_W + EXT * 2}
						height={VB_H - BASE}
						fill="url(#sk-water)"
					/>
					<g mask="url(#sk-reflect-mask)">
						<use
							href="#sk-city"
							transform={`translate(0 ${BASE * 2}) scale(1 -1)`}
							opacity="0.32"
						/>
					</g>
					<rect
						x={-EXT}
						y={BASE - 0.5}
						width={VB_W + EXT * 2}
						height="1"
						fill="rgba(255,255,255,0.14)"
					/>
				</svg>

				<div
					ref={pathEl}
					className="sk-path"
					aria-hidden="true"
					style={
						{
							top: yHor + 2 * scale,
							width: 18 * scale,
							height: 150 * scale,
							'--period': `${3.4 * scale}px`
						} as CSSProperties
					}
				/>

				{header}

				<section className="relative z-3 flex flex-col gap-2 px-6 pt-8.5" aria-label="Countdown">
					<p className="text-[15px] font-medium tracking-[-0.005em] text-white/80">{eyebrow}</p>
					{night && (
						<p
							className="text-[clamp(54px,17vw,78px)] leading-[0.95] font-semibold tracking-[-0.045em] text-white tabular-nums [text-shadow:0_2px_30px_rgba(0,0,0,0.25)]"
							role="timer"
							aria-label={eyebrow}
						>
							{hm}
							<span className="opacity-40">{ss}</span>
						</p>
					)}
					<p className="text-sm text-white/55 tabular-nums">{caption}</p>
				</section>

				{night && (
					<ol className="sk-lamps" aria-label="Schedule">
						{night.marks.map((m, i) => (
							<li
								key={m.key}
								aria-current={m.next ? 'true' : undefined}
								data-passed={now >= m.time ? '' : undefined}
								data-edge={i === 0 ? 'start' : i === night.marks.length - 1 ? 'end' : undefined}
								style={{ left: `${m.pos * 100}%`, '--i': i } as CSSProperties}
							>
								<span className="sk-lamp" />
								<span className="sk-name">{m.label}</span>
								<time dateTime={m.time.toISOString()}>{formatTime(m.time)}</time>
							</li>
						))}
					</ol>
				)}
			</div>
		</div>
	);
}
