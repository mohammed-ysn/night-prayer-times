import { formatTime, type PrayerTimes } from '@/lib/time';

export type Phase = 'before' | 'isha-third' | 'isha-half' | 'between' | 'last' | 'after';

export type MarkKey = 'maghrib' | 'isha' | 'third' | 'half' | 'last' | 'fajr';

export interface Mark {
	key: MarkKey;
	label: string;
	time: Date;
	/** Position along the night, 0 (Maghrib) to 1 (Fajr). */
	pos: number;
	/** The mark the countdown is running to. */
	next?: boolean;
}

interface Step {
	/** Sky phase while this step is running. */
	phase: Phase;
	end: Date;
	eyebrow: string;
}

/** Everything the UI needs to know about where we are in the night. */
export function getNight(times: PrayerTimes, now: Date) {
	const start = times.maghribTime.getTime();
	const span = times.fajrTime.getTime() - start;
	const f = Math.min(1, Math.max(0, (now.getTime() - start) / span));
	const at = (time: Date) => (time.getTime() - start) / span;

	// Each step counts down to the next mark.
	const steps: Step[] = [
		{
			phase: 'before',
			end: times.maghribTime,
			eyebrow: 'Maghrib in'
		}
	];
	if (times.ishaTime) {
		steps.push({
			phase: 'isha-third',
			end: times.ishaTime,
			eyebrow: 'Isha begins in'
		});
	}
	steps.push(
		{
			phase: 'isha-third',
			end: times.endOfIshaThird,
			eyebrow: 'Isha ends (⅓) in'
		},
		{
			phase: 'isha-half',
			end: times.endOfIsha,
			eyebrow: 'Isha ends (½) in'
		},
		{
			phase: 'between',
			end: times.lastThird,
			eyebrow: 'Last third begins in'
		},
		{
			phase: 'last',
			end: times.fajrTime,
			eyebrow: 'Fajr in'
		}
	);
	const step = steps.find((s) => now < s.end);
	const phase: Phase = step ? step.phase : 'after';
	// After Fajr, count down to tomorrow's Maghrib (assumed close to today's).
	const nextMaghrib = new Date(start + 24 * 60 * 60 * 1000);
	const target = step ? step.end : nextMaghrib;
	const eyebrow = step ? step.eyebrow : 'Maghrib in';

	const caption = step ? `at ${formatTime(target)}` : `around ${formatTime(target)}`;

	const base: Mark[] = [{ key: 'maghrib', label: 'Maghrib', time: times.maghribTime, pos: 0 }];
	if (times.ishaTime) {
		base.push({ key: 'isha', label: 'Isha starts', time: times.ishaTime, pos: at(times.ishaTime) });
	}
	base.push(
		{
			key: 'third',
			label: 'Isha ⅓ end',
			time: times.endOfIshaThird,
			pos: at(times.endOfIshaThird)
		},
		{ key: 'half', label: 'Isha ½ end', time: times.endOfIsha, pos: at(times.endOfIsha) },
		{ key: 'last', label: 'Last third', time: times.lastThird, pos: at(times.lastThird) },
		{ key: 'fajr', label: 'Fajr', time: times.fajrTime, pos: 1 }
	);
	const nextKey = base.find((m) => now < m.time)?.key;
	const marks = base.map((m) => ({ ...m, next: m.key === nextKey }));

	// Where Isha's two windows sit along the night. Choice: start to ⅓ or ½. Permissible: to Fajr.
	const windows = {
		start: times.ishaTime ? at(times.ishaTime) : 0,
		third: at(times.endOfIshaThird),
		half: at(times.endOfIsha)
	};

	return {
		phase,
		f,
		eyebrow,
		target,
		caption,
		marks,
		windows,
		inNight: phase !== 'before' && phase !== 'after'
	};
}

export type Night = ReturnType<typeof getNight>;
