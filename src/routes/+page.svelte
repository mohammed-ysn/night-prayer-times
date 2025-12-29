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
	let mounted = false;

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

		// Trigger entrance animations
		setTimeout(() => {
			mounted = true;
		}, 100);
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

<!-- Animated stars background -->
<div class="stars-container">
	<div class="stars stars-1"></div>
	<div class="stars stars-2"></div>
	<div class="stars stars-3"></div>
</div>

<div class="container" class:mounted>
	<header>
		<div class="moon-icon">🌙</div>
		<h1>Night Prayer Times</h1>
		<p class="subtitle">Calculate your night prayer schedule</p>
	</header>

	<button class="info-toggle" onclick={() => (showInfo = !showInfo)}>
		<span class="info-icon">ℹ️</span>
		{showInfo ? 'Hide info' : "What's this?"}
		<span class="chevron" class:open={showInfo}>›</span>
	</button>

	<div class="info-panel" class:open={showInfo}>
		<div class="info-item">
			<span class="info-label">End of Isha</span>
			<p>The midpoint between Maghrib and Fajr. One opinion for when Isha prayer time ends.</p>
		</div>
		<div class="info-item">
			<span class="info-label">Last third</span>
			<p>The final third of the night. A recommended time for night prayers (Tahajjud).</p>
		</div>
	</div>

	<div class="card">
		<p class="description">Enter Maghrib and the following morning's Fajr</p>

		<div class="inputs">
			<TimeInput
				label="Maghrib"
				bind:value={maghrib}
				warning={maghribWarning}
			/>

			<div class="input-divider">
				<span class="divider-dot"></span>
				<span class="divider-line"></span>
				<span class="divider-dot"></span>
			</div>

			<TimeInput
				label="Fajr"
				bind:value={fajr}
				warning={fajrWarning}
			/>
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

		{#if lastSaved}
			<p class="last-saved">
				<span class="save-icon">💾</span>
				Last saved: {lastSaved}
			</p>
		{/if}

		{#if results}
			<div class="results">
				<Result label="End of Isha" time={results.endOfIsha} {now} icon="🌓" />
				<Result label="Last third begins" time={results.lastThird} {now} icon="✨" />
			</div>
		{/if}
	</div>

	<footer>
		<p>Found a bug?</p>
		<div class="footer-links">
			<a href="https://github.com/mohammed-ysn/night-prayer-times/issues" target="_blank" rel="noopener">
				<span>📝</span> Open an issue
			</a>
			<span class="footer-divider">•</span>
			<a href="mailto:mohammedysn15@gmail.com">
				<span>✉️</span> Email me
			</a>
		</div>
	</footer>
</div>

<style>
	:global(*) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	:global(html) {
		background: #0a0a1a;
	}

	:global(body) {
		font-family: 'Roboto Mono', monospace;
		font-size: 1rem;
		background: radial-gradient(ellipse at bottom, #1b2838 0%, #0a0a1a 100%);
		color: #e8e8f0;
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem 1rem;
		overscroll-behavior: none;
		overflow-x: hidden;
	}

	/* Animated starry background */
	.stars-container {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 0;
		overflow: hidden;
	}

	.stars {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-repeat: repeat;
	}

	.stars-1 {
		background-image:
			radial-gradient(1px 1px at 20px 30px, white, transparent),
			radial-gradient(1px 1px at 40px 70px, rgba(255,255,255,0.8), transparent),
			radial-gradient(1px 1px at 50px 160px, rgba(255,255,255,0.6), transparent),
			radial-gradient(1px 1px at 90px 40px, white, transparent),
			radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.7), transparent),
			radial-gradient(1.5px 1.5px at 160px 120px, white, transparent);
		background-size: 200px 200px;
		animation: twinkle 4s ease-in-out infinite;
	}

	.stars-2 {
		background-image:
			radial-gradient(1px 1px at 75px 45px, rgba(255,255,255,0.7), transparent),
			radial-gradient(1px 1px at 95px 95px, white, transparent),
			radial-gradient(1.5px 1.5px at 145px 25px, rgba(255,255,255,0.6), transparent),
			radial-gradient(1px 1px at 175px 145px, rgba(255,255,255,0.8), transparent),
			radial-gradient(1px 1px at 15px 125px, white, transparent);
		background-size: 200px 200px;
		animation: twinkle 5s ease-in-out infinite 1s;
	}

	.stars-3 {
		background-image:
			radial-gradient(1.5px 1.5px at 55px 115px, rgba(255,255,255,0.5), transparent),
			radial-gradient(1px 1px at 115px 175px, rgba(255,255,255,0.7), transparent),
			radial-gradient(1px 1px at 185px 75px, white, transparent);
		background-size: 200px 200px;
		animation: twinkle 6s ease-in-out infinite 2s;
	}

	@keyframes twinkle {
		0%, 100% { opacity: 0.5; }
		50% { opacity: 1; }
	}

	.container {
		max-width: 480px;
		width: 100%;
		position: relative;
		z-index: 1;
		opacity: 0;
		transform: translateY(20px);
		transition: opacity 0.6s ease-out, transform 0.6s ease-out;
	}

	.container.mounted {
		opacity: 1;
		transform: translateY(0);
	}

	header {
		text-align: center;
		margin-bottom: 1.5rem;
	}

	.moon-icon {
		font-size: 3rem;
		margin-bottom: 0.5rem;
		filter: drop-shadow(0 0 20px rgba(255, 220, 100, 0.4));
		animation: float 3s ease-in-out infinite;
	}

	@keyframes float {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-8px); }
	}

	h1 {
		font-family: 'Rubik', sans-serif;
		font-size: 2rem;
		font-weight: 600;
		background: linear-gradient(135deg, #fff 0%, #b8c5d6 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		letter-spacing: -0.5px;
	}

	.subtitle {
		font-size: 0.85rem;
		color: rgba(255, 255, 255, 0.5);
		margin-top: 0.25rem;
	}

	.card {
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 1.25rem;
		padding: 2rem;
		box-shadow:
			0 8px 32px rgba(0, 0, 0, 0.4),
			0 0 80px rgba(100, 150, 255, 0.05),
			inset 0 1px 0 rgba(255, 255, 255, 0.1);
	}

	.description {
		text-align: center;
		font-size: 0.85rem;
		color: rgba(255, 255, 255, 0.6);
		line-height: 1.4;
	}

	.info-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		margin: 0 auto 1rem;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 2rem;
		color: rgba(255, 255, 255, 0.6);
		font-family: inherit;
		font-size: 0.8rem;
		cursor: pointer;
		padding: 0.5rem 1rem;
		transition: all 0.3s ease;
	}

	.info-toggle:hover {
		background: rgba(255, 255, 255, 0.1);
		color: rgba(255, 255, 255, 0.9);
		border-color: rgba(255, 255, 255, 0.2);
	}

	.info-icon {
		font-size: 0.9rem;
	}

	.chevron {
		font-size: 1rem;
		transition: transform 0.3s ease;
		transform: rotate(90deg);
	}

	.chevron.open {
		transform: rotate(-90deg);
	}

	.info-panel {
		max-height: 0;
		overflow: hidden;
		opacity: 0;
		transition: all 0.4s ease;
		margin-bottom: 0;
	}

	.info-panel.open {
		max-height: 300px;
		opacity: 1;
		margin-bottom: 1rem;
	}

	.info-item {
		background: rgba(100, 150, 255, 0.08);
		border: 1px solid rgba(100, 150, 255, 0.15);
		border-radius: 0.75rem;
		padding: 1rem;
		margin-bottom: 0.5rem;
	}

	.info-item:last-child {
		margin-bottom: 0;
	}

	.info-label {
		display: block;
		font-size: 0.9rem;
		font-weight: 600;
		color: rgba(180, 200, 255, 0.9);
		margin-bottom: 0.25rem;
	}

	.info-item p {
		font-size: 0.8rem;
		color: rgba(255, 255, 255, 0.6);
		line-height: 1.4;
	}

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

	.last-saved {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		text-align: center;
		font-size: 0.75rem;
		color: rgba(255, 255, 255, 0.4);
	}

	.save-icon {
		font-size: 0.8rem;
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

	.results {
		margin-top: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	footer {
		margin-top: 2rem;
		text-align: center;
	}

	footer p {
		font-size: 0.75rem;
		color: rgba(255, 255, 255, 0.4);
		margin-bottom: 0.5rem;
	}

	.footer-links {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
	}

	footer a {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		color: rgba(255, 255, 255, 0.5);
		text-decoration: none;
		font-size: 0.8rem;
		transition: all 0.2s ease;
		padding: 0.35rem 0.5rem;
		border-radius: 0.5rem;
	}

	footer a:hover {
		color: rgba(255, 255, 255, 0.9);
		background: rgba(255, 255, 255, 0.05);
	}

	footer a span {
		font-size: 0.9rem;
	}

	.footer-divider {
		color: rgba(255, 255, 255, 0.2);
	}

	@media (max-width: 500px) {
		h1 {
			font-size: 1.6rem;
		}

		.moon-icon {
			font-size: 2.5rem;
		}

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

		.card {
			padding: 1.5rem;
		}

		.footer-links {
			flex-direction: column;
			gap: 0.5rem;
		}

		.footer-divider {
			display: none;
		}
	}
</style>
