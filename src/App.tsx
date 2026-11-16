import { About } from '@/components/about';
import { ManualForm } from '@/components/manual-form';
import { Skyline } from '@/components/skyline';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useNow } from '@/hooks/use-now';
import { usePrayerSource, type Source } from '@/hooks/use-prayer-source';
import { getNight } from '@/lib/night';
import { calculateTimes } from '@/lib/time';

const dateFormat = new Intl.DateTimeFormat('en-GB', {
	weekday: 'short',
	day: 'numeric',
	month: 'short'
});

const sourceItem =
	'h-[26px] rounded-full px-3 text-[11px] font-medium tracking-[0.08em] text-white/55 uppercase ' +
	'transition-[color,background-color,transform] duration-150 ease-out active:scale-[0.97] ' +
	'hover:bg-transparent hover:text-white data-[state=on]:bg-white/16 data-[state=on]:text-white';

export function App() {
	const now = useNow();
	const p = usePrayerSource();
	const times = p.times ? calculateTimes(p.times.maghrib, p.times.fajr) : null;
	const night = times ? getNight(times, now) : null;
	const loading = p.source === 'london' && p.fetchState === 'loading';

	const status = loading
		? "Fetching today's times…"
		: p.source === 'manual'
			? 'Enter Maghrib and Fajr below'
			: undefined;

	return (
		<main className="mx-auto max-w-120">
			<Skyline
				night={night}
				now={now}
				status={status}
				header={
					<header className="relative z-4 flex items-center justify-between pt-[calc(env(safe-area-inset-top)+20px)] pr-5 pl-6 text-[11px] font-medium tracking-[0.1em] text-white/60 uppercase">
						<span>Tonight · {dateFormat.format(now)}</span>
						<ToggleGroup
							type="single"
							spacing={0.5}
							value={p.source}
							onValueChange={(v) => v && p.chooseSource(v as Source)}
							aria-label="Times source"
							className="rounded-full bg-white/8 p-0.5 ring-1 ring-white/8"
						>
							<ToggleGroupItem value="london" className={sourceItem}>
								London
							</ToggleGroupItem>
							<ToggleGroupItem value="manual" className={sourceItem}>
								Manual
							</ToggleGroupItem>
						</ToggleGroup>
					</header>
				}
			/>

			<div className="flex flex-col gap-7 bg-[#03040c] px-6 pt-7 pb-[calc(env(safe-area-inset-bottom)+40px)] text-sm leading-normal">
				{p.source === 'manual' && (
					<ManualForm
						value={p.manual}
						onChange={p.setManualTime}
						lastSaved={p.lastSaved}
						error={
							p.fetchState === 'error'
								? 'Could not fetch London times. Enter them manually.'
								: undefined
						}
					/>
				)}

				<About />

				<footer className="flex gap-1 text-muted-foreground">
					<Button variant="link" size="sm" className="h-auto px-0 text-muted-foreground" asChild>
						<a
							href="https://github.com/mohammed-ysn/night-prayer-times/issues"
							target="_blank"
							rel="noopener noreferrer"
						>
							Report a bug
						</a>
					</Button>
					<span aria-hidden="true">·</span>
					<Button variant="link" size="sm" className="h-auto px-0 text-muted-foreground" asChild>
						<a href="mailto:mohammedysn15@gmail.com">Email</a>
					</Button>
				</footer>
			</div>
		</main>
	);
}
