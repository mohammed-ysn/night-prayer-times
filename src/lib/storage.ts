const MAX_AGE_DAYS = 30;

export interface ManualTimes {
	maghrib: string;
	fajr: string;
	savedDate: string;
}

export function formatSavedDate(dateStr: string): string {
	return new Date(dateStr).toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'short',
		hour: 'numeric',
		minute: '2-digit',
		hour12: true
	});
}

export function loadManualTimes(): ManualTimes | null {
	const savedDate = localStorage.getItem('savedDate');
	if (!savedDate) return null;

	const age = Math.floor((Date.now() - new Date(savedDate).getTime()) / 86400000);
	if (age > MAX_AGE_DAYS) {
		clearManualTimes();
		return null;
	}

	const maghrib = localStorage.getItem('maghrib') || '';
	const fajr = localStorage.getItem('fajr') || '';
	if (!maghrib && !fajr) return null;

	return { maghrib, fajr, savedDate };
}

export function saveManualTime(key: 'maghrib' | 'fajr', value: string): string {
	const ts = new Date().toISOString();
	localStorage.setItem(key, value);
	localStorage.setItem('savedDate', ts);
	return ts;
}

export function clearManualTimes(): void {
	localStorage.removeItem('maghrib');
	localStorage.removeItem('fajr');
	localStorage.removeItem('savedDate');
}

export function getManualModePreference(): boolean {
	return localStorage.getItem('preferManual') === 'true';
}

export function setManualModePreference(value: boolean): void {
	if (value) {
		localStorage.setItem('preferManual', 'true');
	} else {
		localStorage.removeItem('preferManual');
	}
}
