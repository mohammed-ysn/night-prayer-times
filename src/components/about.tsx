import { ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export function About() {
	return (
		<Collapsible className="group/about">
			<CollapsibleTrigger className="flex w-full items-center justify-between rounded-md py-1 text-left font-medium outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
				What do these mean?
				<ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 ease-out group-data-[state=open]/about:rotate-180" />
			</CollapsibleTrigger>
			<CollapsibleContent className="data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 overflow-hidden duration-200">
				<dl className="mt-3 flex flex-col gap-4 text-muted-foreground">
					<div>
						<dt className="font-semibold text-foreground">Isha ends</dt>
						<dd>
							Two valid opinions on when Isha's time ends: ⅓ of the night after Maghrib, or ½ of the
							night (the midpoint between Maghrib and Fajr). In necessity, Isha stays valid until
							Fajr.
						</dd>
					</div>
					<div>
						<dt className="font-semibold text-foreground">Last third</dt>
						<dd>The final third of the night. A recommended time for night prayer (Tahajjud).</dd>
					</div>
				</dl>
			</CollapsibleContent>
		</Collapsible>
	);
}
