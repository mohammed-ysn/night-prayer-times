import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchLondonTimes, getCachedLondonTimes } from '@/lib/api';

const MAX_AGE_DAYS = 30;

export type Source = 'london' | 'manual';
export type FetchState = 'idle' | 'loading' | 'ok' | 'error';

export interface ManualTimes {
	maghrib: string;
	fajr: string;
}

export interface Times extends ManualTimes {
	/** Isha start. London only. */
	isha?: string;
}

interface PrayerState {
	/** Which source the person prefers. Persisted. */
	source: Source;
	/** Manually entered times. Persisted. */
	manual: ManualTimes;
	/** When a manual time was last changed (ISO). Persisted. */
	savedDate: string | null;
	london: Times | null;
	fetchState: FetchState;
	chooseSource: (source: Source) => void;
	setManualTime: (key: keyof ManualTimes, value: string) => void;
	fetchLondon: () => Promise<void>;
}

export const usePrayerStore = create<PrayerState>()(
	persist(
		(set, get) => ({
			source: 'london',
			manual: { maghrib: '', fajr: '' },
			savedDate: null,
			london: null,
			fetchState: 'idle',

			chooseSource: (source) => set({ source }),

			setManualTime: (key, value) =>
				set((s) => ({
					manual: { ...s.manual, [key]: value },
					savedDate: value ? new Date().toISOString() : s.savedDate
				})),

			fetchLondon: async () => {
				if (get().fetchState === 'loading') return;
				set({ fetchState: 'loading' });
				try {
					set({ london: await fetchLondonTimes(), fetchState: 'ok' });
				} catch {
					set({ london: getCachedLondonTimes(), fetchState: 'error' });
				}
			}
		}),
		{
			name: 'night-prayer',
			version: 1,
			partialize: ({ source, manual, savedDate }) => ({ source, manual, savedDate }),
			// Manual times go stale: drop them after 30 days.
			merge: (persisted, current) => {
				const saved = persisted as Partial<PrayerState> | undefined;
				const age = saved?.savedDate
					? (Date.now() - new Date(saved.savedDate).getTime()) / 86_400_000
					: 0;
				return age > MAX_AGE_DAYS ? current : { ...current, ...saved };
			}
		}
	)
);

/** If London times can't be fetched we fall back to manual, without changing the saved preference. */
export function useActiveSource(): Source {
	const source = usePrayerStore((s) => s.source);
	const failed = usePrayerStore((s) => s.fetchState === 'error');
	return failed ? 'manual' : source;
}

/** The times to show, or null until both Maghrib and Fajr are known. */
export function useActiveTimes(): Times | null {
	const source = useActiveSource();
	const london = usePrayerStore((s) => s.london);
	const manual = usePrayerStore((s) => s.manual);
	const times = source === 'london' ? london : manual;
	return times && times.maghrib && times.fajr ? times : null;
}
