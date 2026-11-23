import type { ReactNode } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { Help } from '@/lib/help';

interface MarkPopoverProps {
	help: Help;
	/** Shown under the title, e.g. the time. */
	meta?: ReactNode;
	className?: string;
	children: ReactNode;
}

/** A tap target that opens a short explanation. */
export function MarkPopover({ help, meta, className, children }: MarkPopoverProps) {
	return (
		<Popover>
			<PopoverTrigger className={className}>{children}</PopoverTrigger>
			<PopoverContent
				className="flex w-64 flex-col gap-1.5 text-[13px] leading-snug"
				sideOffset={8}
			>
				<p className="font-semibold">
					{help.title}
					{meta && (
						<span className="ml-2 font-normal text-muted-foreground tabular-nums">{meta}</span>
					)}
				</p>
				<p className="text-muted-foreground">{help.body}</p>
				{help.note && <p className="text-xs text-muted-foreground/70">{help.note}</p>}
			</PopoverContent>
		</Popover>
	);
}
