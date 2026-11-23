import type { MarkKey } from '@/lib/night';

export interface Help {
	title: string;
	body: string;
	/** Shown dimmer beneath the body. */
	note?: string;
}

const ISHA_NOTE =
	'A recommendation, not a requirement: Isha prayed after this is still valid until Fajr.';

export const MARK_HELP: Record<MarkKey, Help> = {
	maghrib: {
		title: 'Maghrib',
		body: 'The sunset prayer. The night begins when it starts.'
	},
	isha: {
		title: 'Isha starts',
		body: 'The night prayer. Its time begins once the evening twilight has gone.'
	},
	third: {
		title: 'Isha ends (⅓)',
		body: 'One opinion: the time of choice for Isha lasts until a third of the night has passed, counting from Maghrib to Fajr.',
		note: ISHA_NOTE
	},
	half: {
		title: 'Isha ends (½)',
		body: 'The other opinion: the time of choice for Isha lasts until the middle of the night, halfway from Maghrib to Fajr.',
		note: ISHA_NOTE
	},
	last: {
		title: 'Last third',
		body: 'The final third of the night. A blessed time for Tahajjud, the voluntary night prayer.'
	},
	fajr: {
		title: 'Fajr',
		body: "The dawn prayer. Isha's time ends when Fajr begins."
	}
};

export const WINDOWS_HELP = {
	title: "Isha's two times",
	choice: {
		name: 'Time of choice (ikhtiyār)',
		body: "From Isha's start until ⅓ or ½ of the night, depending on the opinion. Better and more rewarding to pray within it."
	},
	permissible: {
		name: 'Time of permissibility (jawāz)',
		body: "From Isha's start until Fajr. Isha prayed any time in it is valid."
	}
};
