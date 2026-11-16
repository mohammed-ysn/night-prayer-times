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
		<form onSubmit={(e) => e.preventDefault()}>
			{error && <p role="status">{error}</p>}
			<p>Enter Maghrib and the following morning's Fajr.</p>
			<p>
				<label htmlFor="maghrib">Maghrib</label>{' '}
				<input
					id="maghrib"
					type="time"
					value={value.maghrib}
					aria-invalid={mh !== null && (mh < 13 || mh > 23)}
					onChange={(e) => onChange('maghrib', e.target.value)}
				/>
			</p>
			<p>
				<label htmlFor="fajr">Fajr (tomorrow)</label>{' '}
				<input
					id="fajr"
					type="time"
					value={value.fajr}
					aria-invalid={fh !== null && fh > 8}
					onChange={(e) => onChange('fajr', e.target.value)}
				/>
			</p>
			{warns.map((w) => (
				<p key={w} role="status">
					{w}
				</p>
			))}
			{lastSaved && <p>Saved {lastSaved}</p>}
		</form>
	);
}
