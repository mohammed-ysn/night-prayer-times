<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { calculateTimes } from '$lib/time';
	import TimeInput from '$lib/components/TimeInput.svelte';
	import Result from '$lib/components/Result.svelte';

	let maghrib = '';
	let fajr = '';
	let now = new Date();
	let interval: ReturnType<typeof setInterval>;
	let showInfo = false;
	let lastSaved = '';

	const MAX_AGE_DAYS = 3;

	function formatSavedDate(dateStr: string): string {
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'short',
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
		});
	}

	onMount(() => {
		// Load saved times if not too old
		const savedDate = localStorage.getItem('savedDate');
		if (savedDate) {
			const daysSinceSave = Math.floor(
				(Date.now() - new Date(savedDate).getTime()) / (1000 * 60 * 60 * 24)
			);

			if (daysSinceSave <= MAX_AGE_DAYS) {
				maghrib = localStorage.getItem('maghrib') || '';
				fajr = localStorage.getItem('fajr') || '';

				if (maghrib || fajr) {
					lastSaved = formatSavedDate(savedDate);
				}
			} else {
				// Clear old data
				localStorage.removeItem('maghrib');
				localStorage.removeItem('fajr');
				localStorage.removeItem('savedDate');
			}
		}

		interval = setInterval(() => {
			now = new Date();
		}, 1000);
	});

	// Save times when they change
	$: if (maghrib) {
		const now = new Date().toISOString();
		localStorage.setItem('maghrib', maghrib);
		localStorage.setItem('savedDate', now);
		lastSaved = formatSavedDate(now);
	}
	$: if (fajr) {
		const now = new Date().toISOString();
		localStorage.setItem('fajr', fajr);
		localStorage.setItem('savedDate', now);
		lastSaved = formatSavedDate(now);
	}

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

	<button class="info-toggle" onclick={() => (showInfo = !showInfo)}>
		{showInfo ? 'Hide info ▲' : "What's this? ▼"}
	</button>

	{#if showInfo}
		<div class="info-panel">
			<p><strong>End of Isha</strong> - The midpoint between Maghrib and Fajr. One opinion for when Isha prayer time ends.</p>
			<p><strong>Last third</strong> - The final third of the night. A recommended time for night prayers (Tahajjud).</p>
		</div>
	{/if}

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

		{#if lastSaved}
			<p class="last-saved">Last saved: {lastSaved}</p>
		{/if}

		{#if results}
			<div class="results">
				<Result label="End of Isha" time={results.endOfIsha} {now} />
				<Result label="Last third begins" time={results.lastThird} {now} />
			</div>
		{/if}
	</div>

	<footer>
		Found a bug? <a href="https://github.com/mohammed-ysn/night-prayer-times/issues" target="_blank" rel="noopener">Open an issue</a>
		or <a href="mailto:mohammedysn15@gmail.com">email me</a>
	</footer>
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

	.info-toggle {
		display: block;
		margin: 0 auto 1rem;
		background: none;
		border: none;
		color: rgba(255, 255, 255, 0.5);
		font-family: inherit;
		font-size: 0.8rem;
		cursor: pointer;
		padding: 0.25rem 0.5rem;
	}

	.info-toggle:hover {
		color: rgba(255, 255, 255, 0.8);
	}

	.info-panel {
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 0.5rem;
		padding: 1rem;
		margin-bottom: 1rem;
		font-size: 0.85rem;
		line-height: 1.5;
	}

	.info-panel p {
		margin-bottom: 0.5rem;
		opacity: 0.8;
	}

	.info-panel p:last-child {
		margin-bottom: 0;
	}

	.inputs {
		display: flex;
		gap: 1rem;
		margin: 1.5rem 0;
		justify-content: center;
	}

	.last-saved {
		text-align: center;
		font-size: 0.75rem;
		opacity: 0.5;
	}

	.results {
		margin-top: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	footer {
		margin-top: 1.5rem;
		text-align: center;
		font-size: 0.8rem;
		opacity: 0.5;
	}

	footer a {
		color: inherit;
	}

	footer a:hover {
		opacity: 1;
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
