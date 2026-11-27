import type { MarkKey } from '@/lib/night';

export interface Help {
	title: string;
	body: string;
	/** Shown dimmer beneath the body. */
	note?: string;
}

const ISHA_NOTE =
	'A recommendation, not a requirement: ʿIshāʾ prayed after this is still valid until Fajr.';

export const MARK_HELP: Record<MarkKey, Help> = {
	maghrib: {
		title: 'Maghrib',
		body: 'The sunset prayer. The night begins when it starts.'
	},
	isha: {
		title: 'ʿIshāʾ starts',
		body: 'The night prayer. Its time begins once the evening twilight has gone.'
	},
	third: {
		title: 'ʿIshāʾ ends (⅓)',
		body: 'Another opinion: the time of choice for ʿIshāʾ lasts until a third of the night has passed, counting from Maghrib to Fajr.',
		note: ISHA_NOTE
	},
	half: {
		title: 'ʿIshāʾ ends',
		body: 'The time of choice for ʿIshāʾ lasts until the middle of the night, halfway from Maghrib to Fajr.',
		note: ISHA_NOTE
	},
	last: {
		title: 'Last third',
		body: 'The final third of the night. A blessed time for Tahajjud, the voluntary night prayer.'
	},
	fajr: {
		title: 'Fajr',
		body: "The dawn prayer. ʿIshāʾ's time ends when Fajr begins."
	}
};

export const WINDOWS_HELP = {
	title: "ʿIshāʾ's two times",
	choice: {
		name: 'Time of choice (ikhtiyār)',
		body: "From ʿIshāʾ's start until the middle of the night. Another opinion ends it at ⅓, shown as a small tick. Better and more rewarding to pray within it."
	},
	permissible: {
		name: 'Time of permissibility (jawāz)',
		body: "From ʿIshāʾ's start until Fajr. ʿIshāʾ prayed any time in it is valid."
	}
};
