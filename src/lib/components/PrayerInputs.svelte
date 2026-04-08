<script lang="ts">
	import TimeInput from './TimeInput.svelte';

	let {
		maghrib = $bindable(''),
		fajr = $bindable('')
	}: {
		maghrib: string;
		fajr: string;
	} = $props();

	const MAGHRIB_RANGE = { min: 13, max: 23 };
	const FAJR_RANGE = { min: 0, max: 8 };

	let maghribHour = $derived(maghrib ? new Date(`2000-01-01T${maghrib}`).getHours() : null);
	let fajrHour = $derived(fajr ? new Date(`2000-01-01T${fajr}`).getHours() : null);

	let maghribWarning = $derived(
		maghribHour !== null &&
			(maghribHour < MAGHRIB_RANGE.min || maghribHour > MAGHRIB_RANGE.max)
	);
	let fajrWarning = $derived(
		fajrHour !== null && (fajrHour < FAJR_RANGE.min || fajrHour > FAJR_RANGE.max)
	);
</script>

<div class="inputs">
	<TimeInput label="Maghrib" bind:value={maghrib} warning={maghribWarning} />

	<div class="input-divider">
		<span class="divider-dot"></span>
		<span class="divider-line"></span>
		<span class="divider-dot"></span>
	</div>

	<TimeInput label="Fajr (tomorrow)" bind:value={fajr} warning={fajrWarning} />
</div>

{#if maghribWarning || fajrWarning}
	<div class="warnings">
		{#if maghribWarning}
			<div class="warning-banner">
				<span class="warning-icon">⚠️</span>
				<p>That doesn't look like a typical Maghrib time — it's usually in the evening</p>
			</div>
		{/if}
		{#if fajrWarning}
			<div class="warning-banner">
				<span class="warning-icon">⚠️</span>
				<p>That doesn't look like a typical Fajr time — it's usually early morning</p>
			</div>
		{/if}
	</div>
{/if}

<style>
	.inputs {
		display: flex;
		gap: 1rem;
		margin: 1.5rem 0;
		justify-content: center;
		align-items: center;
	}

	.input-divider {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		opacity: 0.3;
	}

	.divider-dot {
		width: 4px;
		height: 4px;
		background: white;
		border-radius: 50%;
	}

	.divider-line {
		width: 1px;
		height: 24px;
		background: linear-gradient(to bottom, transparent, white, transparent);
	}

	.warnings {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.warning-banner {
		display: flex;
		align-items: flex-start;
		gap: 0.4rem;
		padding: 0.5rem 0.75rem;
		background: rgba(251, 191, 36, 0.1);
		border: 1px solid rgba(251, 191, 36, 0.2);
		border-radius: 0.5rem;
	}

	.warning-icon {
		font-size: 0.8rem;
		flex-shrink: 0;
	}

	.warning-banner p {
		color: #fbbf24;
		font-size: 0.75rem;
		line-height: 1.4;
		margin: 0;
	}

	@media (max-width: 500px) {
		.inputs {
			flex-direction: column;
			align-items: center;
		}

		.input-divider {
			flex-direction: row;
			gap: 0.5rem;
		}

		.divider-line {
			width: 24px;
			height: 1px;
			background: linear-gradient(to right, transparent, white, transparent);
		}
	}
</style>
