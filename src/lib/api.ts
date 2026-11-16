const KEY = '2a99f189-6e3b-4015-8fb8-ff277642561d';
const BASE = 'https://www.londonprayertimes.com/api/times/';

const LONDON_TZ = 'Europe/London';

/** YYYY-MM-DD for a given instant in London (en-CA formats as ISO). */
function londonDate(offsetDays = 0): string {
	const d = new Date(Date.now() + offsetDays * 86400000);
	return new Intl.DateTimeFormat('en-CA', { timeZone: LONDON_TZ }).format(d);
}

export interface LondonTimes {
	maghrib: string;
	fajr: string;
}

export async function fetchLondonTimes(): Promise<LondonTimes> {
	const today = londonDate();

	// Return cached values if already fetched today
	if (localStorage.getItem('apiDate') === today) {
		const m = localStorage.getItem('apiMaghrib');
		const f = localStorage.getItem('apiFajr');
		if (m && f) return { maghrib: m, fajr: f };
	}

	const tomorrow = londonDate(1);
	const params = `format=json&key=${KEY}&24hours=true`;

	const [todayRes, tomorrowRes] = await Promise.all([
		fetch(`${BASE}?${params}&date=${today}`),
		fetch(`${BASE}?${params}&date=${tomorrow}`)
	]);

	if (!todayRes.ok || !tomorrowRes.ok) throw new Error('API error');

	const todayData = await todayRes.json();
	const tomorrowData = await tomorrowRes.json();

	const m: string = todayData.magrib || todayData.maghrib;
	const f: string = tomorrowData.fajr;

	if (!m || !f) throw new Error('Unexpected response format');

	localStorage.setItem('apiDate', today);
	localStorage.setItem('apiMaghrib', m);
	localStorage.setItem('apiFajr', f);

	return { maghrib: m, fajr: f };
}

export function getCachedLondonTimes(): LondonTimes | null {
	const m = localStorage.getItem('apiMaghrib');
	const f = localStorage.getItem('apiFajr');
	return m && f ? { maghrib: m, fajr: f } : null;
}
