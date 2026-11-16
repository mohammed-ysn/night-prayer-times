import { TriangleAlert } from 'lucide-react';
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
	const warns = [
		mh !== null &&
			(mh < 13 || mh > 23) &&
			"That doesn't look like Maghrib. It's usually in the evening.",
		fh !== null && fh > 8 && "That doesn't look like Fajr. It's usually early morning."
	].filter(Boolean) as string[];

	return (
		<div className="space-y-4">
			{error && <Notice>{error}</Notice>}
			<p className="text-sm text-muted-foreground">
				Enter Maghrib and the following morning's Fajr.
			</p>
			<div className="grid grid-cols-2 gap-3">
				<div className="space-y-2">
					<Label htmlFor="maghrib">Maghrib</Label>
					<Input
						id="maghrib"
						type="time"
						value={value.maghrib}
						aria-invalid={mh !== null && (mh < 13 || mh > 23)}
						onChange={(e) => onChange('maghrib', e.target.value)}
						className="h-12 font-mono tabular-nums"
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="fajr">Fajr (tomorrow)</Label>
					<Input
						id="fajr"
						type="time"
						value={value.fajr}
						aria-invalid={fh !== null && fh > 8}
						onChange={(e) => onChange('fajr', e.target.value)}
						className="h-12 font-mono tabular-nums"
					/>
				</div>
			</div>
			{warns.map((w) => (
				<Notice key={w}>{w}</Notice>
			))}
			{lastSaved && <p className="text-xs text-muted-foreground">Saved {lastSaved}</p>}
		</div>
	);
}

function Notice({ children }: { children: React.ReactNode }) {
	return (
		<p
			role="status"
			className="flex items-start gap-2 rounded-lg border border-warn/25 bg-warn/10 px-3 py-2 text-xs text-warn"
		>
			<TriangleAlert className="mt-px size-3.5 shrink-0" />
			{children}
		</p>
	);
}
