import { TriangleAlert } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { TimeField } from '@/components/time-field';
import type { Times } from '@/hooks/use-prayer-source';

const hourOf = (v: string) => (v ? Number(v.split(':')[0]) : null);

export function ManualForm({
	value,
	onChange,
	lastSaved,
	error
}: {
	value: Times;
	onChange: (key: keyof Times, v: string) => void;
	lastSaved: string;
	error?: string;
}) {
	const mh = hourOf(value.maghrib);
	const fh = hourOf(value.fajr);
	const maghribOff = mh !== null && (mh < 13 || mh > 23);
	const fajrOff = fh !== null && fh > 8;
	const warns = [
		maghribOff && "That doesn't look like Maghrib. It's usually in the evening.",
		fajrOff && "That doesn't look like Fajr. It's usually early morning."
	].filter(Boolean) as string[];

	return (
		<form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
			{error && (
				<Alert variant="destructive">
					<TriangleAlert />
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}
			<p className="text-muted-foreground">Enter Maghrib and the following morning's Fajr.</p>
			<div className="grid grid-cols-2 gap-3">
				<div className="flex flex-col gap-2">
					<Label htmlFor="maghrib">Maghrib</Label>
					<TimeField
						id="maghrib"
						value={value.maghrib}
						onChange={(v) => onChange('maghrib', v)}
						defaultValue="18:00"
						invalid={maghribOff}
					/>
				</div>
				<div className="flex flex-col gap-2">
					<Label htmlFor="fajr">Fajr (tomorrow)</Label>
					<TimeField
						id="fajr"
						value={value.fajr}
						onChange={(v) => onChange('fajr', v)}
						defaultValue="05:00"
						invalid={fajrOff}
					/>
				</div>
			</div>
			{warns.map((w) => (
				<Alert key={w} className="border-gold/30 text-gold">
					<TriangleAlert />
					<AlertDescription className="text-gold/90">{w}</AlertDescription>
				</Alert>
			))}
			{lastSaved && <p className="text-xs text-muted-foreground">Saved {lastSaved}</p>}
		</form>
	);
}
