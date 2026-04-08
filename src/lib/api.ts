const KEY = '2a99f189-6e3b-4015-8fb8-ff277642561d';
const BASE = 'https://www.londonprayertimes.com/api/times/';

function todayStr(): string {
	return new Date().toISOString().split('T')[0];
}

function tomorrowStr(): string {
	const d = new Date();
	d.setDate(d.getDate() + 1);
	return d.toISOString().split('T')[0];
}

export interface LondonTimes {
	maghrib: string;
	fajr: string;
}

export async function fetchLondonTimes(): Promise<LondonTimes> {
	const today = todayStr();

	// Return cached values if already fetched today
	if (localStorage.getItem('apiDate') === today) {
		const m = localStorage.getItem('apiMaghrib');
		const f = localStorage.getItem('apiFajr');
		if (m && f) return { maghrib: m, fajr: f };
	}

	const tomorrow = tomorrowStr();
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
