import { formatTime, type PrayerTimes } from '@/lib/time';

export type Phase = 'before' | 'early' | 'last' | 'after';

export interface Mark {
	key: string;
	label: string;
	time: Date;
	gold?: boolean;
}

/** Everything the UI needs to know about where we are in the night. */
export function getNight(times: PrayerTimes, now: Date) {
	const start = times.maghribTime.getTime();
	const span = times.fajrTime.getTime() - start;
	const phase: Phase =
		now < times.maghribTime
			? 'before'
			: now < times.lastThird
				? 'early'
				: now < times.fajrTime
					? 'last'
					: 'after';
	const f = Math.min(1, Math.max(0, (now.getTime() - start) / span));

	const [eyebrow, target]: [string, Date | null] =
		phase === 'before'
			? ['Night begins in', times.maghribTime]
			: phase === 'early'
				? ['Last third begins in', times.lastThird]
				: phase === 'last'
					? ['Fajr in', times.fajrTime]
					: ['Night has ended', null];

	const caption = target ? `at ${formatTime(target)}` : `Fajr was ${formatTime(times.fajrTime)}`;

	const marks: Mark[] = [
		{ key: 'maghrib', label: 'Maghrib', time: times.maghribTime },
		{ key: 'third', label: 'Isha ends by ⅓', time: times.endOfIshaThird },
		{ key: 'half', label: 'Isha ends by ½', time: times.endOfIsha },
		{ key: 'last', label: 'Last third', time: times.lastThird, gold: true },
		{ key: 'fajr', label: 'Fajr', time: times.fajrTime }
	];

	return {
		phase,
		f,
		eyebrow,
		target,
		caption,
		marks,
		inNight: phase === 'early' || phase === 'last'
	};
}

export type Night = ReturnType<typeof getNight>;
