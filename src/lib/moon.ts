const SYNODIC_DAYS = 29.530588853;
const REFERENCE_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14);

/** Moon phase for a date: 0 = new, 0.25 = first quarter, 0.5 = full, 0.75 = last quarter. */
export function moonPhase(date: Date): number {
	const cycles = (date.getTime() - REFERENCE_NEW_MOON) / 86_400_000 / SYNODIC_DAYS;
	return ((cycles % 1) + 1) % 1;
}
