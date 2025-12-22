<script lang="ts">
	let maghrib = '';
	let fajr = '';

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

	// Reactive calculations - auto-update when inputs change
	$: canCalculate = maghrib && fajr;

	$: results = canCalculate ? calculateTimes(maghrib, fajr) : null;

	function calculateTimes(maghribStr: string, fajrStr: string) {
		const maghribTime = new Date(`2000-01-01T${maghribStr}`);
		let fajrTime = new Date(`2000-01-01T${fajrStr}`);

		// Fajr is next day if it's before Maghrib
		if (fajrTime <= maghribTime) {
			fajrTime.setDate(fajrTime.getDate() + 1);
		}

		const diff = fajrTime.getTime() - maghribTime.getTime();

		const endOfIsha = new Date(maghribTime.getTime() + diff * 0.5);
		const lastThird = new Date(maghribTime.getTime() + diff * (2 / 3));

		return {
			endOfIsha: formatTime(endOfIsha),
			lastThird: formatTime(lastThird)
		};
	}

	function formatTime(date: Date): string {
		const hours = date.getHours();
		const minutes = date.getMinutes().toString().padStart(2, '0');
		const period = hours >= 12 ? 'PM' : 'AM';
		const displayHour = hours % 12 || 12;
		return `${displayHour}:${minutes} ${period}`;
	}
</script>

<svelte:head>
	<title>Night Prayer Times</title>
</svelte:head>

<div class="container">
	<h1>Night Prayer Times 🌙</h1>

	<div class="card">
		<p class="description">Enter Maghrib and the following morning's Fajr</p>

		<div class="inputs">
			<label>
				Maghrib
				<input type="time" bind:value={maghrib} class:warning={maghribWarning} />
			</label>

			<label>
				Fajr
				<input type="time" bind:value={fajr} class:warning={fajrWarning} />
			</label>
		</div>

		{#if maghribWarning}
			<p class="warning-text">That doesn't look like a typical Maghrib time — it's usually in the evening</p>
		{/if}

		{#if fajrWarning}
			<p class="warning-text">That doesn't look like a typical Fajr time — it's usually early morning</p>
		{/if}

		{#if results}
			<div class="results">
				<div class="result">
					<span class="label">End of Isha</span>
					<span class="time">{results.endOfIsha}</span>
				</div>
				<div class="result">
					<span class="label">Last third begins</span>
					<span class="time">{results.lastThird}</span>
				</div>
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

	label {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		font-size: 0.95rem;
	}

	input[type='time'] {
		font-family: inherit;
		font-size: 1rem;
		padding: 0.75rem;
		border-radius: 0.5rem;
		border: 2px solid transparent;
		background: rgba(255, 255, 255, 0.15);
		color: #fff;
		width: 140px;
		transition: border-color 0.2s;
	}

	input[type='time']:focus {
		outline: none;
		border-color: rgba(255, 255, 255, 0.5);
	}

	input[type='time'].warning {
		border-color: #f59e0b;
	}

	.warning-text {
		color: #fbbf24;
		font-size: 0.85rem;
		text-align: center;
		margin-bottom: 0.5rem;
	}

	.results {
		margin-top: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.result {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		background: rgba(255, 255, 255, 0.08);
		border-radius: 0.5rem;
	}

	.result .label {
		opacity: 0.8;
	}

	.result .time {
		font-weight: bold;
		font-size: 1.2rem;
	}

	@media (max-width: 500px) {
		h1 {
			font-size: 1.7rem;
		}

		.inputs {
			flex-direction: column;
			align-items: center;
		}

		input[type='time'] {
			width: 100%;
			max-width: 200px;
		}

		.result {
			flex-direction: column;
			gap: 0.25rem;
			text-align: center;
		}
	}
</style>
