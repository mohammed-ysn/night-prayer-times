import { CircleHelp } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { WINDOWS_HELP } from '@/lib/help';

/** A small ? that explains the two times of Isha. */
export function WindowsPopover() {
	return (
		<Popover>
			<PopoverTrigger
				aria-label="What do these times mean?"
				className="-m-2 rounded-full p-2 text-white/50 transition-colors duration-150 outline-none hover:text-white focus-visible:ring-[3px] focus-visible:ring-white/30"
			>
				<CircleHelp className="size-3.5" aria-hidden="true" />
			</PopoverTrigger>
			<PopoverContent className="flex w-72 flex-col gap-2 text-[13px] leading-snug" sideOffset={8}>
				<p className="font-semibold">{WINDOWS_HELP.title}</p>
				<div>
					<p className="font-medium text-gold">{WINDOWS_HELP.choice.name}</p>
					<p className="text-muted-foreground">{WINDOWS_HELP.choice.body}</p>
				</div>
				<div>
					<p className="font-medium">{WINDOWS_HELP.permissible.name}</p>
					<p className="text-muted-foreground">{WINDOWS_HELP.permissible.body}</p>
				</div>
			</PopoverContent>
		</Popover>
	);
}
