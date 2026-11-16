import type { Night } from '@/lib/night';
import { formatTime } from '@/lib/time';
import { cn } from '@/lib/utils';

export function Schedule({ night, now }: { night: Night; now: Date }) {
	return (
		<div className="overflow-hidden rounded-3xl border border-border bg-card p-2 backdrop-blur-xl">
			{night.marks.map((m) => (
				<div
					key={m.key}
					className={cn(
						'flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-[opacity,background-color] duration-200 ease-[var(--ease-out)]',
						m.next && 'bg-primary/10',
						now >= m.time && 'opacity-45'
					)}
				>
					<span
						className={cn(
							'size-2 rounded-full transition-colors duration-200',
							m.next ? 'bg-primary' : 'bg-white/40'
						)}
					/>
					<span
						className={cn(
							'flex-1 text-sm transition-colors duration-200',
							m.next && 'text-primary'
						)}
					>
						{m.label}
					</span>
					<span className="font-mono text-sm tabular-nums">{formatTime(m.time)}</span>
				</div>
			))}
		</div>
	);
}
