import type { CSSProperties, ReactNode } from 'react';
import { moonPhase } from '@/lib/moon';
import type { Night } from '@/lib/night';
import { formatCountdown, formatTime } from '@/lib/time';
import { SkyCanvas } from './sky-canvas';
import './skyline.css';

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
	const phase = night?.phase ?? 'between';
	const moonOn = night?.inNight ?? false;
	const eyebrow = night?.eyebrow ?? 'Tonight';
	const caption = night?.caption ?? status ?? '';
	const countdown = night ? formatCountdown(night.target.getTime() - now.getTime()) : null;
	const split = countdown ? countdown.lastIndexOf(':') : 0;
	const [hm, ss] = countdown ? [countdown.slice(0, split), countdown.slice(split)] : ['', ''];

	return (
		<div className="sky sk" data-phase={phase} data-idle={night ? undefined : ''}>
			<div className="sky-bg" />
			<SkyCanvas
				phase={phase}
				moonPhase={moonPhase(now)}
				f={night ? night.f : 0.5}
				moonOn={moonOn}
			/>

			<div className="sk-col">
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
