import { Moon } from 'lucide-react';
import { About } from '@/components/about';
import { ManualForm } from '@/components/manual-form';
import { NightHero } from '@/components/night-hero';
import { NightTimeline } from '@/components/night-timeline';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNow } from '@/hooks/use-now';
import { usePrayerSource, type Source } from '@/hooks/use-prayer-source';
import { calculateTimes } from '@/lib/time';

const today = new Intl.DateTimeFormat('en-GB', {
	weekday: 'short',
	day: 'numeric',
	month: 'short'
}).format(new Date());

export function App() {
	const now = useNow();
	const p = usePrayerSource();
	const results = p.times ? calculateTimes(p.times.maghrib, p.times.fajr) : null;

	return (
		<main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))]">
			<header className="rise flex items-center justify-between" style={{ '--i': 0 } as never}>
				<div className="flex items-center gap-2">
					<Moon className="size-5 text-primary" aria-hidden />
					<h1 className="text-base font-semibold tracking-tight">Night Prayer Times</h1>
				</div>
				<span className="text-sm text-muted-foreground">{today}</span>
			</header>

			<Tabs
				value={p.source}
				onValueChange={(v) => p.chooseSource(v as Source)}
				className="rise mt-6"
				style={{ '--i': 1 } as never}
			>
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="london">London</TabsTrigger>
					<TabsTrigger value="manual">Manual</TabsTrigger>
				</TabsList>
			</Tabs>

			<div className="rise mt-8" style={{ '--i': 2 } as never}>
				{p.source === 'manual' && (
					<div className="mb-8">
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
				{p.source === 'london' && p.fetchState === 'loading' && (
					<p className="py-16 text-center text-sm text-muted-foreground">Fetching today's times…</p>
				)}
				{results && <NightHero times={results} now={now} />}
			</div>

			{results && (
				<Card className="rise mt-8 bg-card py-0" style={{ '--i': 3 } as never}>
					<CardContent className="p-5">
						<NightTimeline times={results} now={now} />
					</CardContent>
				</Card>
			)}

			<div className="rise mt-6" style={{ '--i': 4 } as never}>
				<About />
			</div>

			<footer className="mt-auto flex items-center justify-center gap-4 pt-10 text-xs text-muted-foreground">
				<a
					className="rounded px-1 py-1 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
					href="https://github.com/mohammed-ysn/night-prayer-times/issues"
					target="_blank"
					rel="noopener noreferrer"
				>
					Report a bug
				</a>
				<span aria-hidden>·</span>
				<a
					className="rounded px-1 py-1 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
					href="mailto:mohammedysn15@gmail.com"
				>
					Email
				</a>
			</footer>
		</main>
	);
}
