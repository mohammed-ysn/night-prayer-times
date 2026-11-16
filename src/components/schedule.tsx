import type { Night } from '@/lib/night';
import { formatTime } from '@/lib/time';

export function Schedule({ night }: { night: Night }) {
	return (
		<ul aria-label="Schedule">
			{night.marks.map((m) => (
				<li key={m.key} aria-current={m.next ? 'true' : undefined}>
					{m.label}: {formatTime(m.time)}
				</li>
			))}
		</ul>
	);
}
