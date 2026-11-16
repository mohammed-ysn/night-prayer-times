import type { PrayerTimes } from '@/lib/time';
import { formatCountdown, formatTime } from '@/lib/time';

/** The one number that matters: what's next, and how long until it. */
export function NightHero({ times, now }: { times: PrayerTimes; now: Date }) {
	let eyebrow: string;
	let target: Date | null;
	let caption: string;

	if (now < times.maghribTime) {
		eyebrow = 'Maghrib in';
		target = times.maghribTime;
		caption = `at ${formatTime(times.maghribTime)}`;
	} else if (now < times.lastThird) {
		eyebrow = 'Last third begins in';
		target = times.lastThird;
		caption = `at ${formatTime(times.lastThird)}`;
	} else if (now < times.fajrTime) {
		eyebrow = 'Last third · Fajr in';
		target = times.fajrTime;
		caption = `at ${formatTime(times.fajrTime)}`;
	} else {
		eyebrow = 'Night has ended';
		target = null;
		caption = `Fajr was at ${formatTime(times.fajrTime)}`;
	}

	return (
		<section aria-live="off" className="py-2 text-center">
			<p className="text-sm text-muted-foreground">{eyebrow}</p>
			{target ? (
				<p
					className="mt-1 font-mono text-6xl font-light tracking-tight tabular-nums sm:text-7xl"
					aria-label={eyebrow}
				>
					{formatCountdown(target.getTime() - now.getTime())}
				</p>
			) : (
				<p className="mt-1 text-4xl font-light tracking-tight">—</p>
			)}
			<p className="mt-2 text-sm text-primary">{caption}</p>
		</section>
	);
}
