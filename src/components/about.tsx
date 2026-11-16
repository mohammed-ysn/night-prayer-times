import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export function About() {
	return (
		<Collapsible className="group">
			<CollapsibleTrigger asChild>
				<Button
					data-no-press
					variant="ghost"
					className="h-11 w-full justify-between px-1 has-[>svg]:px-1 text-muted-foreground hover:bg-transparent hover:text-foreground dark:hover:bg-transparent"
				>
					What do these mean?
					<ChevronDown className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
				</Button>
			</CollapsibleTrigger>
			<CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
				<dl className="space-y-4 px-1 pb-2 pt-2 text-sm leading-relaxed text-muted-foreground">
					<div>
						<dt className="font-medium text-foreground">Isha ends</dt>
						<dd>
							Two valid opinions on when Isha's time ends: ⅓ of the night after Maghrib, or ½ of the
							night (the midpoint between Maghrib and Fajr). In necessity, Isha stays valid until
							Fajr.
						</dd>
					</div>
					<div>
						<dt className="font-medium text-foreground">Last third</dt>
						<dd>The final third of the night. A recommended time for night prayer (Tahajjud).</dd>
					</div>
				</dl>
			</CollapsibleContent>
		</Collapsible>
	);
}
