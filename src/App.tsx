import { About } from '@/components/about';
import { AuroraBackground } from '@/components/aurora-background';
import { AuroraDial } from '@/components/aurora-dial';
import { ManualForm } from '@/components/manual-form';
import { Schedule } from '@/components/schedule';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNow } from '@/hooks/use-now';
import { usePrayerSource, type Source } from '@/hooks/use-prayer-source';
import { getNight } from '@/lib/night';
import { calculateTimes } from '@/lib/time';

const dateFormat = new Intl.DateTimeFormat('en-GB', {
	weekday: 'short',
	day: 'numeric',
	month: 'short'
});

// The sliding pill behind the tabs draws the active state, so the trigger itself stays clear.
const TAB =
	'rounded-full data-[state=active]:border-transparent data-[state=active]:bg-transparent dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-transparent';

export function App() {
	const now = useNow();
	const p = usePrayerSource();
	const times = p.times ? calculateTimes(p.times.maghrib, p.times.fajr) : null;
	const night = times ? getNight(times, now) : null;
	const loading = p.source === 'london' && p.fetchState === 'loading';

	return (
		<main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))]">
			<AuroraBackground />

			<header className="rise flex items-center justify-between" style={{ '--i': 0 } as never}>
				<h1 className="text-sm font-medium tracking-tight">Tonight</h1>
				<span className="rounded-full border border-border bg-secondary px-3 py-1 text-xs text-muted-foreground backdrop-blur">
					{dateFormat.format(now)}
				</span>
			</header>

			<Tabs
				value={p.source}
				onValueChange={(v) => p.chooseSource(v as Source)}
				className="rise mt-5"
				style={{ '--i': 1 } as never}
			>
				<TabsList className="relative grid h-11! w-full grid-cols-2 rounded-full">
					<span
						aria-hidden
						className="absolute inset-y-[3px] left-[3px] w-[calc(50%-3px)] rounded-full border border-input bg-input/30 transition-transform duration-200 ease-[var(--ease-out)]"
						style={{ transform: p.source === 'manual' ? 'translateX(100%)' : 'none' }}
					/>
					<TabsTrigger value="london" className={TAB}>
						London
					</TabsTrigger>
					<TabsTrigger value="manual" className={TAB}>
						Manual
					</TabsTrigger>
				</TabsList>
			</Tabs>

			{loading && (
				<div aria-busy aria-label="Fetching today's times" className="animate-pulse">
					<div className="relative mx-auto mt-6 aspect-[6/5] w-full max-w-[340px]">
						<div className="absolute left-[8%] top-[9.6%] aspect-square w-[84%] rounded-full border-[16px] border-white/5" />
					</div>
					<div className="mt-4 h-[216px] rounded-3xl border border-border bg-card" />
				</div>
			)}

			{night && (
				<>
					<div className="rise mt-6" style={{ '--i': 2 } as never}>
						<AuroraDial night={night} now={now} />
					</div>
					<div className="rise mt-4" style={{ '--i': 3 } as never}>
						<Schedule night={night} now={now} />
					</div>
				</>
			)}

			{p.source === 'manual' && (
				<div className="rise mt-4" style={{ '--i': 4 } as never}>
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
				</div>
			)}

			<div className="rise mt-4" style={{ '--i': 5 } as never}>
				<About />
			</div>

			<footer className="mt-auto flex items-center justify-center gap-4 pt-7 text-xs text-muted-foreground">
				<a
					className="rounded px-1 py-3 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
					href="https://github.com/mohammed-ysn/night-prayer-times/issues"
					target="_blank"
					rel="noopener noreferrer"
				>
					Report a bug
				</a>
				<span aria-hidden>·</span>
				<a
					className="rounded px-1 py-3 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
					href="mailto:mohammedysn15@gmail.com"
				>
					Email
				</a>
			</footer>
		</main>
	);
}
