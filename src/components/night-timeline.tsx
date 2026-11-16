import type { PrayerTimes } from '@/lib/time';
import { formatTime, getRelativeTime } from '@/lib/time';
import { cn } from '@/lib/utils';

interface Row {
	key: string;
	label: string;
	note?: string;
	time: Date;
	pct: number;
	emphasis?: boolean;
}

export function NightTimeline({ times, now }: { times: PrayerTimes; now: Date }) {
	const total = times.fajrTime.getTime() - times.maghribTime.getTime();
	const pct = (d: Date) =>
		Math.min(100, Math.max(0, ((d.getTime() - times.maghribTime.getTime()) / total) * 100));
	const nowPct = pct(now);
	const inNight = now >= times.maghribTime && now < times.fajrTime;

	const rows: Row[] = [
		{ key: 'maghrib', label: 'Maghrib', time: times.maghribTime, pct: 0 },
		{
			key: 'third',
			label: 'Isha ends',
			note: 'by ⅓ of the night',
			time: times.endOfIshaThird,
			pct: pct(times.endOfIshaThird)
		},
		{
			key: 'half',
			label: 'Isha ends',
			note: 'by ½ of the night',
			time: times.endOfIsha,
			pct: pct(times.endOfIsha)
		},
		{
			key: 'last',
			label: 'Last third begins',
			note: 'best for Tahajjud',
			time: times.lastThird,
			pct: pct(times.lastThird),
			emphasis: true
		},
		{ key: 'fajr', label: 'Fajr', time: times.fajrTime, pct: 100 }
	];

	return (
		<div>
			{/* Night bar: three thirds, filled up to now. */}
			<div
				role="img"
				aria-label={`Night is ${Math.round(nowPct)}% over`}
				className="relative h-2.5 overflow-hidden rounded-full bg-secondary"
			>
				<div
					className="absolute inset-y-0 left-0 bg-dusk/60"
					style={{ width: `${nowPct}%`, transition: 'width 1s linear' }}
				/>
				<div
					className="absolute inset-y-0 right-0 bg-primary/15"
					style={{ left: `${rows[3].pct}%` }}
				/>
				{[100 / 3, 50, (100 * 2) / 3].map((p) => (
					<span
						key={p}
						className="absolute inset-y-0 w-px bg-background/80"
						style={{ left: `${p}%` }}
					/>
				))}
			</div>
			<div className="relative h-0">
				{inNight && (
					<span
						className="absolute -top-[1.1rem] size-3 -translate-x-1/2 rounded-full bg-foreground shadow-[0_0_0_4px_oklch(0.96_0.008_265/0.15)]"
						style={{ left: `${nowPct}%`, transition: 'left 1s linear' }}
					/>
				)}
			</div>

			<ul className="mt-6 divide-y divide-border">
				{rows.map((r) => {
					const past = now >= r.time;
					return (
						<li
							key={r.key}
							className={cn(
								'flex items-baseline justify-between gap-4 py-3 transition-opacity duration-200',
								past && 'opacity-45'
							)}
						>
							<div className="min-w-0">
								<p className={cn('text-sm font-medium', r.emphasis && 'text-primary')}>{r.label}</p>
								{r.note && <p className="text-xs text-muted-foreground">{r.note}</p>}
							</div>
							<div className="text-right">
								<p className="font-mono text-base tabular-nums">{formatTime(r.time)}</p>
								<p className="text-xs text-muted-foreground tabular-nums">
									{getRelativeTime(r.time, now)}
								</p>
							</div>
						</li>
					);
				})}
			</ul>
			<p className="mt-3 text-xs text-muted-foreground">
				In necessity, Isha stays valid until Fajr.
			</p>
		</div>
	);
}
