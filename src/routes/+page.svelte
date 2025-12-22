<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { calculateTimes } from '$lib/time';
	import TimeInput from '$lib/components/TimeInput.svelte';
	import Result from '$lib/components/Result.svelte';

	let maghrib = '';
	let fajr = '';
	let now = new Date();
	let interval: ReturnType<typeof setInterval>;

	onMount(() => {
		interval = setInterval(() => {
			now = new Date();
		}, 1000);
	});

	onDestroy(() => {
		if (interval) clearInterval(interval);
	});

	// Validation ranges
	const MAGHRIB_RANGE = { min: 13, max: 23 };
	const FAJR_RANGE = { min: 0, max: 8 };

	// Reactive validation
	$: maghribHour = maghrib ? new Date(`2000-01-01T${maghrib}`).getHours() : null;
	$: fajrHour = fajr ? new Date(`2000-01-01T${fajr}`).getHours() : null;

	$: maghribWarning =
		maghribHour !== null &&
		(maghribHour < MAGHRIB_RANGE.min || maghribHour > MAGHRIB_RANGE.max);

	$: fajrWarning =
		fajrHour !== null && (fajrHour < FAJR_RANGE.min || fajrHour > FAJR_RANGE.max);

	// Reactive calculations
	$: canCalculate = maghrib && fajr;
	$: results = canCalculate ? calculateTimes(maghrib, fajr) : null;
</script>

<svelte:head>
	<title>Night Prayer Times</title>
</svelte:head>

<div class="container">
	<h1>Night Prayer Times 🌙</h1>

	<div class="card">
		<p class="description">Enter Maghrib and the following morning's Fajr</p>

		<div class="inputs">
			<TimeInput
				label="Maghrib"
				bind:value={maghrib}
				warning={maghribWarning}
				warningText="That doesn't look like a typical Maghrib time — it's usually in the evening"
			/>

			<TimeInput
				label="Fajr"
				bind:value={fajr}
				warning={fajrWarning}
				warningText="That doesn't look like a typical Fajr time — it's usually early morning"
			/>
		</div>

		{#if results}
			<div class="results">
				<Result label="End of Isha" time={results.endOfIsha} {now} />
				<Result label="Last third begins" time={results.lastThird} {now} />
			</div>
		{/if}
	</div>
</div>

<style>
	:global(*) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	:global(body) {
		font-family: 'Roboto Mono', monospace;
		font-size: 1.1rem;
		background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
		color: #fff;
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem 1rem;
	}

	.container {
		max-width: 500px;
		width: 100%;
	}

	h1 {
		font-family: 'Rubik', sans-serif;
		text-align: center;
		font-size: 2.2rem;
		margin-bottom: 1.5rem;
		text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.4);
	}

	.card {
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(15px);
		-webkit-backdrop-filter: blur(15px);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 1rem;
		padding: 2rem;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
	}

	.description {
		text-align: center;
		font-size: 0.85rem;
		opacity: 0.6;
		line-height: 1.4;
	}

	.inputs {
		display: flex;
		gap: 1rem;
		margin: 1.5rem 0;
		justify-content: center;
	}

	.results {
		margin-top: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	@media (max-width: 500px) {
		h1 {
			font-size: 1.7rem;
		}

		.inputs {
			flex-direction: column;
			align-items: center;
		}
	}
</style>
