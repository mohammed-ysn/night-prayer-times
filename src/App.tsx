import { About } from '@/components/about';
import { Countdown } from '@/components/countdown';
import { ManualForm } from '@/components/manual-form';
import { Schedule } from '@/components/schedule';
import { useNow } from '@/hooks/use-now';
import { usePrayerSource } from '@/hooks/use-prayer-source';
import { getNight } from '@/lib/night';
import { calculateTimes } from '@/lib/time';

const dateFormat = new Intl.DateTimeFormat('en-GB', {
	weekday: 'short',
	day: 'numeric',
	month: 'short'
});

export function App() {
	const now = useNow();
	const p = usePrayerSource();
	const times = p.times ? calculateTimes(p.times.maghrib, p.times.fajr) : null;
	const night = times ? getNight(times, now) : null;
	const loading = p.source === 'london' && p.fetchState === 'loading';

	return (
		<main>
			<header>
				<h1>Tonight</h1>
				<p>{dateFormat.format(now)}</p>
			</header>

			<div role="group" aria-label="Times source">
				<button
					type="button"
					aria-pressed={p.source === 'london'}
					onClick={() => p.chooseSource('london')}
				>
					London
				</button>
				<button
					type="button"
					aria-pressed={p.source === 'manual'}
					onClick={() => p.chooseSource('manual')}
				>
					Manual
				</button>
			</div>

			{loading && <p>Fetching today's times…</p>}

			{night && (
				<>
					<Countdown night={night} now={now} />
					<Schedule night={night} />
				</>
			)}

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

			<footer>
				<a
					href="https://github.com/mohammed-ysn/night-prayer-times/issues"
					target="_blank"
					rel="noopener noreferrer"
				>
					Report a bug
				</a>{' '}
				<a href="mailto:mohammedysn15@gmail.com">Email</a>
			</footer>
		</main>
	);
}
