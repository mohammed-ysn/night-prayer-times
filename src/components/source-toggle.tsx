import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useActiveSource, usePrayerStore, type Source } from '@/stores/prayer-store';

const item =
	'h-[26px] rounded-full px-3 text-[11px] font-medium tracking-[0.08em] text-white/55 uppercase ' +
	'transition-[color,background-color,transform] duration-150 ease-out active:scale-[0.97] ' +
	'hover:bg-transparent hover:text-white data-[state=on]:bg-white/16 data-[state=on]:text-white';

export function SourceToggle() {
	const source = useActiveSource();
	const chooseSource = usePrayerStore((s) => s.chooseSource);
	return (
		<ToggleGroup
			type="single"
			spacing={0.5}
			value={source}
			onValueChange={(v) => v && chooseSource(v as Source)}
			aria-label="Times source"
			className="rounded-full bg-white/8 p-0.5 ring-1 ring-white/8"
		>
			<ToggleGroupItem value="london" className={item}>
				London
			</ToggleGroupItem>
			<ToggleGroupItem value="manual" className={item}>
				Manual
			</ToggleGroupItem>
		</ToggleGroup>
	);
}
