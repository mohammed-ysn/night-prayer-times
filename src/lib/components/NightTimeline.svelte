<script lang="ts">
	import { formatTime, getRelativeTime } from '$lib/time';
	import type { PrayerTimes } from '$lib/time';

	let {
		times,
		now
	}: {
		times: PrayerTimes;
		now: Date;
	} = $props();

	function percent(time: Date): number {
		const total = times.fajrTime.getTime() - times.maghribTime.getTime();
		const elapsed = time.getTime() - times.maghribTime.getTime();
		return Math.min(100, Math.max(0, (elapsed / total) * 100));
	}

	let nowPercent = $derived(percent(now));
	let nightOver = $derived(now >= times.fajrTime);

	let markers = $derived([
		{
			icon: '🌒',
			label: 'Isha ends · ⅓',
			time: times.endOfIshaThird,
			percent: percent(times.endOfIshaThird)
		},
		{
			icon: '🌓',
			label: 'Isha ends · ½',
			time: times.endOfIsha,
			percent: percent(times.endOfIsha)
		},
		{
			icon: '✨',
			label: 'Last third begins',
			time: times.lastThird,
			percent: percent(times.lastThird)
		}
	]);
</script>

<div class="timeline">
	<div class="track">
		<div class="track-fill" style="width: {nowPercent}%"></div>
		{#each markers as marker (marker.label)}
			<div
				class="tick"
				class:upcoming={now < marker.time}
				style="left: {marker.percent}%"
				title="{marker.label} · {formatTime(marker.time)}"
			>
				<span class="tick-dot">{marker.icon}</span>
			</div>
		{/each}
		{#if !nightOver}
			<div class="now-marker" style="left: {nowPercent}%">
				<span class="now-dot"></span>
			</div>
		{/if}
	</div>

	<div class="track-ends">
		<span>🕌 {formatTime(times.maghribTime)}</span>
		<span>🌄 {formatTime(times.fajrTime)}</span>
	</div>

	<div class="markers">
		{#each markers as marker (marker.label)}
			<div class="marker" class:upcoming={now < marker.time}>
				<span class="marker-icon">{marker.icon}</span>
				<span class="marker-label">{marker.label}</span>
				<span class="marker-time">{formatTime(marker.time)}</span>
				<span class="marker-relative">{getRelativeTime(marker.time, now)}</span>
			</div>
		{/each}
	</div>
</div>

<style>
	.timeline {
		margin-top: 1.5rem;
	}

	.track {
		position: relative;
		height: 6px;
		border-radius: 3px;
		background: linear-gradient(to right, rgba(80, 100, 160, 0.35), rgba(150, 130, 200, 0.35));
	}

	.track-fill {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		border-radius: 3px;
		background: linear-gradient(to right, rgba(120, 200, 150, 0.7), rgba(120, 200, 150, 0.9));
		transition: width 1s linear;
	}

	.tick {
		position: absolute;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	.tick-dot {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.4rem;
		height: 1.4rem;
		border-radius: 50%;
		background: rgba(10, 10, 26, 0.9);
		border: 1px solid rgba(255, 255, 255, 0.25);
		font-size: 0.75rem;
		opacity: 1;
		transition: all 0.3s ease;
	}

	.tick:not(.upcoming) .tick-dot {
		opacity: 0.55;
	}

	.tick.upcoming .tick-dot {
		border-color: rgba(120, 200, 150, 0.5);
	}

	.now-marker {
		position: absolute;
		top: 50%;
		transform: translate(-50%, -50%);
		transition: left 1s linear;
	}

	.now-dot {
		display: block;
		width: 0.6rem;
		height: 0.6rem;
		border-radius: 50%;
		background: #fff;
		box-shadow: 0 0 8px 2px rgba(255, 255, 255, 0.7);
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.3);
		}
	}

	.track-ends {
		display: flex;
		justify-content: space-between;
		margin-top: 0.5rem;
		font-size: 0.7rem;
		color: rgba(255, 255, 255, 0.35);
	}

	.markers {
		display: flex;
		gap: 0.5rem;
		margin-top: 1.5rem;
	}

	.marker {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 0.15rem;
		padding: 0.75rem 0.4rem;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 0.75rem;
		opacity: 0.6;
		transition: all 0.3s ease;
	}

	.marker.upcoming {
		opacity: 1;
		border-color: rgba(120, 200, 150, 0.25);
		background: rgba(120, 200, 150, 0.06);
	}

	.marker-icon {
		font-size: 1rem;
	}

	.marker-label {
		font-size: 0.68rem;
		color: rgba(255, 255, 255, 0.55);
		line-height: 1.3;
	}

	.marker-time {
		font-weight: 600;
		font-size: 1rem;
		color: #fff;
		letter-spacing: -0.3px;
	}

	.marker-relative {
		font-size: 0.68rem;
		color: rgba(255, 255, 255, 0.4);
	}

	@media (max-width: 500px) {
		.marker-label {
			font-size: 0.62rem;
		}

		.marker-time {
			font-size: 0.85rem;
		}
	}
</style>
