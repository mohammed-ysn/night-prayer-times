import type { Night } from '@/lib/night';
import { formatCountdown } from '@/lib/time';

export function Countdown({ night, now }: { night: Night; now: Date }) {
	const { eyebrow, target, caption } = night;
	return (
		<section aria-label="Countdown">
			<p>{eyebrow}</p>
			<p role="timer" aria-label={eyebrow}>
				{target ? formatCountdown(target.getTime() - now.getTime()) : '—'}
			</p>
			<p>{caption}</p>
		</section>
	);
}
