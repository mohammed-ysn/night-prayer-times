<script lang="ts">
	import { formatTime, getRelativeTime } from '$lib/time';

	let {
		label,
		time,
		now
	}: {
		label: string;
		time: Date;
		now: Date;
	} = $props();
</script>

<div class="result">
	<span class="label">{label}</span>
	<div class="time-group">
		<span class="time">{formatTime(time)}</span>
		<span class="relative">{getRelativeTime(time, now)}</span>
	</div>
</div>

<style>
	.result {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		background: rgba(255, 255, 255, 0.08);
		border-radius: 0.5rem;
	}

	.label {
		opacity: 0.8;
	}

	.time-group {
		text-align: right;
	}

	.time {
		font-weight: bold;
		font-size: 1.2rem;
	}

	.relative {
		display: block;
		font-size: 0.8rem;
		opacity: 0.6;
	}

	@media (max-width: 500px) {
		.result {
			flex-direction: column;
			gap: 0.25rem;
			text-align: center;
		}

		.time-group {
			text-align: center;
		}
	}
</style>
