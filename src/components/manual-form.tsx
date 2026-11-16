import { TriangleAlert } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
					<Input
						id="maghrib"
						type="time"
						value={value.maghrib}
						aria-invalid={maghribOff}
						onChange={(e) => onChange('maghrib', e.target.value)}
						className="tabular-nums"
					/>
				</div>
				<div className="flex flex-col gap-2">
					<Label htmlFor="fajr">Fajr (tomorrow)</Label>
					<Input
						id="fajr"
						type="time"
						value={value.fajr}
						aria-invalid={fajrOff}
						onChange={(e) => onChange('fajr', e.target.value)}
						className="tabular-nums"
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
