import { Clock } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const ROW = 40;
const VISIBLE = 5;
const PAD = ROW * Math.floor(VISIBLE / 2);

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
const PERIODS = ['AM', 'PM'];

interface Parts {
	hour: number; // 1–12
	minute: number;
	pm: boolean;
}

function parse(value: string, fallback: string): Parts {
	const [h, m] = (value || fallback).split(':').map(Number);
	return { hour: h % 12 || 12, minute: m, pm: h >= 12 };
}

function format({ hour, minute, pm }: Parts): string {
	const h24 = (hour % 12) + (pm ? 12 : 0);
	return `${String(h24).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function label(value: string): string {
	const { hour, minute, pm } = parse(value, '00:00');
	return `${hour}:${String(minute).padStart(2, '0')} ${pm ? 'PM' : 'AM'}`;
}

/** One scroll-snap column. The row under the highlight bar is the selected one. */
function Wheel({
	items,
	index,
	onIndex,
	label: name,
	className
}: {
	items: string[];
	index: number;
	onIndex: (i: number) => void;
	label: string;
	className?: string;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const settle = useRef<ReturnType<typeof setTimeout>>(undefined);

	useLayoutEffect(() => {
		if (ref.current) ref.current.scrollTop = index * ROW;
		// Initial position only; later changes are handled below.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Follow changes that didn't come from scrolling (tap, keyboard).
	useEffect(() => {
		const el = ref.current;
		if (el && Math.abs(el.scrollTop - index * ROW) > ROW / 2) {
			el.scrollTo({ top: index * ROW, behavior: 'smooth' });
		}
	}, [index]);

	useEffect(() => () => clearTimeout(settle.current), []);

	const onScroll = () => {
		clearTimeout(settle.current);
		settle.current = setTimeout(() => {
			const el = ref.current;
			if (!el) return;
			const i = Math.min(items.length - 1, Math.max(0, Math.round(el.scrollTop / ROW)));
			if (i !== index) onIndex(i);
		}, 90);
	};

	const step = (delta: number) => onIndex(Math.min(items.length - 1, Math.max(0, index + delta)));

	return (
		<div
			ref={ref}
			role="listbox"
			aria-label={name}
			tabIndex={0}
			onScroll={onScroll}
			onKeyDown={(e) => {
				if (e.key === 'ArrowDown') step(1);
				else if (e.key === 'ArrowUp') step(-1);
				else return;
				e.preventDefault();
			}}
			style={{ height: ROW * VISIBLE, paddingBlock: PAD }}
			className={cn(
				'snap-y snap-mandatory overflow-y-auto overscroll-contain outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
				'[mask-image:linear-gradient(to_bottom,transparent,#000_30%,#000_70%,transparent)]',
				'motion-reduce:scroll-auto',
				className
			)}
		>
			{items.map((item, i) => (
				<div
					key={item}
					role="option"
					aria-selected={i === index}
					onClick={() => onIndex(i)}
					style={{ height: ROW }}
					className={cn(
						'flex snap-center items-center justify-center text-lg tabular-nums transition-colors duration-150',
						i === index ? 'font-semibold text-foreground' : 'text-foreground/35'
					)}
				>
					{item}
				</div>
			))}
		</div>
	);
}

/**
 * Time picker built from three scroll-snap wheels in a popover. Stores `HH:MM` (24h), like a
 * native time input, and only commits once the person actually moves a wheel.
 */
export function TimeField({
	id,
	value,
	onChange,
	defaultValue = '12:00',
	invalid,
	placeholder = 'Set time'
}: {
	id?: string;
	value: string;
	onChange: (value: string) => void;
	/** Where the wheels start when nothing is set yet. */
	defaultValue?: string;
	invalid?: boolean;
	placeholder?: string;
}) {
	const [open, setOpen] = useState(false);
	const parts = parse(value, defaultValue);

	const update = (patch: Partial<Parts>) => onChange(format({ ...parts, ...patch }));

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					id={id}
					type="button"
					variant="outline"
					aria-invalid={invalid || undefined}
					className={cn(
						'h-10 w-full justify-between bg-white/5 px-3 font-normal tabular-nums hover:bg-white/8 hover:text-foreground',
						!value && 'text-muted-foreground'
					)}
				>
					{value ? label(value) : placeholder}
					<Clock className="size-4 text-muted-foreground" />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				align="start"
				className="w-(--radix-popover-trigger-width) min-w-52 border-white/10 bg-popover/85 p-2 backdrop-blur-xl"
			>
				<div className="relative">
					<div
						aria-hidden="true"
						style={{ top: PAD, height: ROW }}
						className="pointer-events-none absolute inset-x-1 rounded-lg bg-white/10 ring-1 ring-white/10"
					/>
					<div className="relative flex">
						<Wheel
							label="Hour"
							items={HOURS}
							index={parts.hour - 1}
							onIndex={(i) => update({ hour: i + 1 })}
							className="flex-1"
						/>
						<Wheel
							label="Minute"
							items={MINUTES}
							index={parts.minute}
							onIndex={(i) => update({ minute: i })}
							className="flex-1"
						/>
						<Wheel
							label="AM or PM"
							items={PERIODS}
							index={parts.pm ? 1 : 0}
							onIndex={(i) => update({ pm: i === 1 })}
							className="flex-1"
						/>
					</div>
				</div>
				<Button
					type="button"
					size="sm"
					variant="secondary"
					className="mt-2 w-full"
					onClick={() => {
						if (!value) onChange(format(parts));
						setOpen(false);
					}}
				>
					Done
				</Button>
			</PopoverContent>
		</Popover>
	);
}
