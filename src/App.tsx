import { useEffect } from 'react';
import { About } from '@/components/about';
import { ManualForm } from '@/components/manual-form';
import { Skyline } from '@/components/skyline';
import { SourceToggle } from '@/components/source-toggle';
import { Button } from '@/components/ui/button';
import { useNow } from '@/hooks/use-now';
import { getNight } from '@/lib/night';
import { calculateTimes } from '@/lib/time';
import { useActiveSource, useActiveTimes, usePrayerStore } from '@/stores/prayer-store';

const dateFormat = new Intl.DateTimeFormat('en-GB', {
	weekday: 'short',
	day: 'numeric',
	month: 'short'
});

export function App() {
	const now = useNow();
	const source = useActiveSource();
	const loading = usePrayerStore((s) => s.fetchState === 'loading');
	const activeTimes = useActiveTimes();

	useEffect(() => {
		void usePrayerStore.getState().fetchLondon();
	}, []);

	const times = activeTimes ? calculateTimes(activeTimes.maghrib, activeTimes.fajr) : null;
	const night = times ? getNight(times, now) : null;

	const status =
		source === 'london' && loading
			? "Fetching today's times…"
			: source === 'manual'
				? 'Enter Maghrib and Fajr below'
				: undefined;

	return (
		<main>
			<Skyline
				night={night}
				now={now}
				status={status}
				header={
					<header className="relative z-4 flex items-center justify-between pt-[calc(env(safe-area-inset-top)+20px)] pr-5 pl-6 text-[11px] font-medium tracking-[0.1em] text-white/60 uppercase">
						<span>Tonight · {dateFormat.format(now)}</span>
						<SourceToggle />
					</header>
				}
			/>

			<div className="bg-[#03040c]">
				<div className="mx-auto flex max-w-120 flex-col gap-7 px-6 pt-7 pb-[calc(env(safe-area-inset-bottom)+40px)] text-sm leading-normal">
					{source === 'manual' && <ManualForm />}

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
			</div>
		</main>
	);
}
