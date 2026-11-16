import { formatTime, type PrayerTimes } from '@/lib/time';

export type Phase = 'before' | 'isha-third' | 'isha-half' | 'between' | 'last' | 'after';

export interface Mark {
	key: string;
	label: string;
	time: Date;
	/** The mark the countdown is running to. */
	next?: boolean;
}

/** Everything the UI needs to know about where we are in the night. */
export function getNight(times: PrayerTimes, now: Date) {
	const start = times.maghribTime.getTime();
	const span = times.fajrTime.getTime() - start;
	const f = Math.min(1, Math.max(0, (now.getTime() - start) / span));

	// Each phase counts down to the next mark.
	const steps: [Phase, Date, string][] = [
		['before', times.maghribTime, 'Maghrib in'],
		['isha-third', times.endOfIshaThird, 'Isha ends (⅓) in'],
		['isha-half', times.endOfIsha, 'Isha ends (½) in'],
		['between', times.lastThird, 'Last third begins in'],
		['last', times.fajrTime, 'Fajr in']
	];
	const step = steps.find(([, end]) => now < end);
	const phase: Phase = step ? step[0] : 'after';
	// After Fajr, count down to tomorrow's Maghrib (assumed close to today's).
	const nextMaghrib = new Date(start + 24 * 60 * 60 * 1000);
	const target = step ? step[1] : nextMaghrib;
	const eyebrow = step ? step[2] : 'Maghrib in';

	const caption = step ? `at ${formatTime(target)}` : `around ${formatTime(target)}`;

	const base: Mark[] = [
		{ key: 'maghrib', label: 'Maghrib', time: times.maghribTime },
		{ key: 'third', label: 'Isha ends by ⅓', time: times.endOfIshaThird },
		{ key: 'half', label: 'Isha ends by ½', time: times.endOfIsha },
		{ key: 'last', label: 'Last third', time: times.lastThird },
		{ key: 'fajr', label: 'Fajr', time: times.fajrTime }
	];
	const nextKey = base.find((m) => now < m.time)?.key;
	const marks = base.map((m) => ({ ...m, next: m.key === nextKey }));

	return {
		phase,
		f,
		eyebrow,
		target,
		caption,
		marks,
		inNight: phase !== 'before' && phase !== 'after'
	};
}

export type Night = ReturnType<typeof getNight>;
