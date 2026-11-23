export interface PrayerTimes {
	maghribTime: Date;
	fajrTime: Date;
	/** When Isha begins. Only known for London times, and only if it falls before the first third. */
	ishaTime?: Date;
	endOfIshaThird: Date;
	endOfIsha: Date;
	lastThird: Date;
}

export function calculateTimes(maghribStr: string, fajrStr: string, ishaStr?: string): PrayerTimes {
	const now = new Date();
	const [maghribH, maghribM] = maghribStr.split(':').map(Number);
	const [fajrH, fajrM] = fajrStr.split(':').map(Number);

	const maghribTime = new Date(now);
	maghribTime.setHours(maghribH, maghribM, 0, 0);

	const fajrTime = new Date(now);
	fajrTime.setHours(fajrH, fajrM, 0, 0);

	// Fajr is next day if it's before Maghrib
	if (fajrTime <= maghribTime) {
		fajrTime.setDate(fajrTime.getDate() + 1);
	}

	// If current time is before Fajr but after midnight, we're in the "night" period
	// and should use yesterday's Maghrib as the start
	if (now < fajrTime && now.getHours() < 12 && maghribTime > now) {
		maghribTime.setDate(maghribTime.getDate() - 1);
		fajrTime.setDate(fajrTime.getDate() - 1);
	}

	const diff = fajrTime.getTime() - maghribTime.getTime();

	const endOfIshaThird = new Date(maghribTime.getTime() + diff * (1 / 3));
	const endOfIsha = new Date(maghribTime.getTime() + diff * 0.5);
	const lastThird = new Date(maghribTime.getTime() + diff * (2 / 3));

	let ishaTime: Date | undefined;
	if (ishaStr) {
		const [ishaH, ishaM] = ishaStr.split(':').map(Number);
		const candidate = new Date(maghribTime);
		candidate.setHours(ishaH, ishaM, 0, 0);
		if (candidate <= maghribTime) candidate.setDate(candidate.getDate() + 1);
		if (candidate < endOfIshaThird) ishaTime = candidate;
	}

	return { maghribTime, fajrTime, ishaTime, endOfIshaThird, endOfIsha, lastThird };
}

export function formatTime(date: Date): string {
	const hours = date.getHours();
	const minutes = date.getMinutes().toString().padStart(2, '0');
	const period = hours >= 12 ? 'PM' : 'AM';
	const displayHour = hours % 12 || 12;
	return `${displayHour}:${minutes} ${period}`;
}

export function getRelativeTime(target: Date, current: Date): string {
	const diffMs = target.getTime() - current.getTime();
	const absDiffMs = Math.abs(diffMs);

	const hours = Math.floor(absDiffMs / (1000 * 60 * 60));
	const minutes = Math.floor((absDiffMs % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((absDiffMs % (1000 * 60)) / 1000);

	const timeStr =
		hours > 0 ? `${hours}h ${minutes}m` : minutes >= 10 ? `${minutes}m` : `${minutes}m ${seconds}s`;

	return diffMs > 0 ? `in ${timeStr}` : `${timeStr} ago`;
}

/** H:MM:SS countdown, clamped at zero. */
export function formatCountdown(ms: number): string {
	const total = Math.max(0, Math.floor(ms / 1000));
	const h = Math.floor(total / 3600);
	const m = Math.floor((total % 3600) / 60)
		.toString()
		.padStart(2, '0');
	const s = (total % 60).toString().padStart(2, '0');
	return `${h}:${m}:${s}`;
}

/** "16 Nov, 9:53 pm" for an ISO timestamp. */
export function formatSavedDate(iso: string): string {
	return new Date(iso).toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'short',
		hour: 'numeric',
		minute: '2-digit',
		hour12: true
	});
}
