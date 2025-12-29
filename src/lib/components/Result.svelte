<script lang="ts">
	import { formatTime, getRelativeTime } from '$lib/time';

	let {
		label,
		time,
		now,
		icon = ''
	}: {
		label: string;
		time: Date;
		now: Date;
		icon?: string;
	} = $props();

	// Determine if the time is upcoming or past
	let isUpcoming = $derived(time > now);
	let relativeTime = $derived(getRelativeTime(time, now));
</script>

<div class="result" class:upcoming={isUpcoming}>
	<div class="result-left">
		{#if icon}
			<span class="icon">{icon}</span>
		{/if}
		<span class="label">{label}</span>
	</div>
	<div class="time-group">
		<span class="time">{formatTime(time)}</span>
		<span class="relative" class:upcoming={isUpcoming}>
			{relativeTime}
		</span>
	</div>
	<div class="result-bg"></div>
</div>

<style>
	.result {
		position: relative;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.25rem;
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02));
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 0.875rem;
		overflow: hidden;
		transition: all 0.3s ease;
	}

	.result:hover {
		border-color: rgba(255, 255, 255, 0.15);
		transform: translateY(-1px);
	}

	.result.upcoming {
		border-color: rgba(100, 200, 150, 0.2);
		background: linear-gradient(135deg, rgba(100, 200, 150, 0.08), rgba(100, 200, 150, 0.02));
	}

	.result-bg {
		position: absolute;
		top: 0;
		right: 0;
		width: 100px;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.02));
		pointer-events: none;
	}

	.result-left {
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}

	.icon {
		font-size: 1.1rem;
		opacity: 0.9;
	}

	.label {
		font-size: 0.9rem;
		color: rgba(255, 255, 255, 0.7);
		font-weight: 500;
	}

	.time-group {
		text-align: right;
		position: relative;
		z-index: 1;
	}

	.time {
		display: block;
		font-weight: 600;
		font-size: 1.3rem;
		color: #fff;
		letter-spacing: -0.5px;
	}

	.relative {
		display: block;
		font-size: 0.75rem;
		color: rgba(255, 255, 255, 0.45);
		margin-top: 0.15rem;
	}

	.relative.upcoming {
		color: rgba(100, 220, 150, 0.8);
	}

	@media (max-width: 500px) {
		.result {
			flex-direction: column;
			gap: 0.5rem;
			text-align: center;
			padding: 1rem;
		}

		.result-left {
			justify-content: center;
		}

		.time-group {
			text-align: center;
		}

		.result-bg {
			display: none;
		}
	}
</style>
