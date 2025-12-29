export interface PrayerTimes {
	endOfIsha: Date;
	lastThird: Date;
}

export function calculateTimes(maghribStr: string, fajrStr: string): PrayerTimes {
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

	const endOfIsha = new Date(maghribTime.getTime() + diff * 0.5);
	const lastThird = new Date(maghribTime.getTime() + diff * (2 / 3));

	return { endOfIsha, lastThird };
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

	let timeStr = '';
	if (hours > 0) {
		timeStr = `${hours}h ${minutes}m`;
	} else {
		timeStr = `${minutes}m`;
	}

	return diffMs > 0 ? `in ${timeStr}` : `${timeStr} ago`;
}
