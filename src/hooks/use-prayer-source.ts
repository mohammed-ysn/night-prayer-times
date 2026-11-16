import { useCallback, useEffect, useState } from 'react';
import { fetchLondonTimes, getCachedLondonTimes } from '@/lib/api';
import {
	formatSavedDate,
	getManualModePreference,
	loadManualTimes,
	saveManualTime,
	setManualModePreference
} from '@/lib/storage';

export type Source = 'london' | 'manual';
type Fetch = 'loading' | 'ok' | 'error';

export interface Times {
	maghrib: string;
	fajr: string;
}

export function usePrayerSource() {
	const [source, setSource] = useState<Source>(() =>
		getManualModePreference() ? 'manual' : 'london'
	);
	const [fetchState, setFetchState] = useState<Fetch>('loading');
	const [london, setLondon] = useState<Times | null>(null);
	const [manual, setManual] = useState<Times>(() => {
		const saved = loadManualTimes();
		return { maghrib: saved?.maghrib ?? '', fajr: saved?.fajr ?? '' };
	});
	const [lastSaved, setLastSaved] = useState(() => {
		const saved = loadManualTimes();
		return saved ? formatSavedDate(saved.savedDate) : '';
	});

	useEffect(() => {
		let cancelled = false;
		fetchLondonTimes()
			.then((t) => {
				if (cancelled) return;
				setLondon(t);
				setFetchState('ok');
			})
			.catch(() => {
				if (cancelled) return;
				setLondon(getCachedLondonTimes());
				setFetchState('error');
				setSource('manual');
			});
		return () => {
			cancelled = true;
		};
	}, []);

	const chooseSource = useCallback((next: Source) => {
		setSource(next);
		setManualModePreference(next === 'manual');
	}, []);

	const setManualTime = useCallback((key: keyof Times, value: string) => {
		setManual((m) => ({ ...m, [key]: value }));
		if (value) setLastSaved(formatSavedDate(saveManualTime(key, value)));
	}, []);

	const active = source === 'london' ? london : manual;
	const times = active && active.maghrib && active.fajr ? active : null;

	return { source, chooseSource, fetchState, manual, setManualTime, lastSaved, times };
}
