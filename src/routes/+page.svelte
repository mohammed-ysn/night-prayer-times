<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { calculateTimes } from '$lib/time';
	import { fetchLondonTimes, getCachedLondonTimes } from '$lib/api';
	import {
		loadManualTimes,
		saveManualTime,
		formatSavedDate,
		getManualModePreference,
		setManualModePreference
	} from '$lib/storage';
	import InfoPanel from '$lib/components/InfoPanel.svelte';
	import PrayerInputs from '$lib/components/PrayerInputs.svelte';
	import Result from '$lib/components/Result.svelte';

	let maghrib = '';
	let fajr = '';
	let now = new Date();
	let interval: ReturnType<typeof setInterval>;
	let lastSaved = '';
	let mounted = false;
	let loading = false;
	let fetchError = '';
	let autoFetched = false;
	let manualMode = false;

	async function initPrayerTimes() {
		loading = true;
		fetchError = '';
		try {
			const times = await fetchLondonTimes();
			maghrib = times.maghrib;
			fajr = times.fajr;
			autoFetched = true;
		} catch {
			fetchError = 'Could not fetch prayer times — enter times manually.';
			const saved = loadManualTimes();
			if (saved) {
				maghrib = saved.maghrib;
				fajr = saved.fajr;
				lastSaved = formatSavedDate(saved.savedDate);
			}
		} finally {
			loading = false;
		}
	}

	function switchToManual() {
		manualMode = true;
		setManualModePreference(true);
		const saved = loadManualTimes();
		maghrib = saved?.maghrib ?? '';
		fajr = saved?.fajr ?? '';
		lastSaved = saved ? formatSavedDate(saved.savedDate) : '';
	}

	function switchToLondon() {
		manualMode = false;
		setManualModePreference(false);
		const cached = getCachedLondonTimes();
		if (cached) {
			maghrib = cached.maghrib;
			fajr = cached.fajr;
		}
	}

	onMount(() => {
		initPrayerTimes().then(() => {
			if (getManualModePreference()) switchToManual();
		});
		interval = setInterval(() => {
			now = new Date();
		}, 1000);
		setTimeout(() => {
			mounted = true;
		}, 100);
	});

	onDestroy(() => {
		if (interval) clearInterval(interval);
	});

	// Persist manual edits
	$: if (maghrib && manualMode) {
		lastSaved = formatSavedDate(saveManualTime('maghrib', maghrib));
	}
	$: if (fajr && manualMode) {
		lastSaved = formatSavedDate(saveManualTime('fajr', fajr));
	}

	$: canCalculate = maghrib && fajr;
	$: results = canCalculate ? calculateTimes(maghrib, fajr) : null;
	const londonDate = new Date().toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	});
</script>

<svelte:head>
	<title>Night Prayer Times</title>
</svelte:head>

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

	<InfoPanel />

	<div class="card">
		{#if loading}
			<p class="status-text loading">Fetching today's times...</p>
		{:else if autoFetched && !manualMode}
			<p class="status-text success">📍 London · {londonDate}</p>

			<PrayerInputs bind:maghrib bind:fajr />

			{#if results}
				<div class="results">
					<Result label="End of Isha" time={results.endOfIsha} {now} icon="🌓" />
					<Result label="Last third begins" time={results.lastThird} {now} icon="✨" />
				</div>
			{/if}

			<div class="location-prompt">
				<div class="location-divider"></div>
				<button class="location-link" onclick={switchToManual}>
					Not in London? Enter times manually
					<span class="arrow">→</span>
				</button>
			</div>
		{:else}
			{#if autoFetched}
				<button class="back-btn" onclick={switchToLondon}>
					<span class="back-arrow">←</span> London times
				</button>
			{:else if fetchError}
				<div class="warning-banner">
					<span class="warning-icon">⚠️</span>
					<p>{fetchError}</p>
				</div>
			{/if}

			<p class="description">Enter Maghrib and the following morning's Fajr</p>

			<PrayerInputs bind:maghrib bind:fajr />

			{#if lastSaved}
				<p class="last-saved"><span>💾</span> Last saved: {lastSaved}</p>
			{/if}

			{#if results}
				<div class="results">
					<Result label="End of Isha" time={results.endOfIsha} {now} icon="🌓" />
					<Result label="Last third begins" time={results.lastThird} {now} icon="✨" />
				</div>
			{/if}
		{/if}
	</div>

	<footer>
		<p>Found a bug?</p>
		<div class="footer-links">
			<a
				href="https://github.com/mohammed-ysn/night-prayer-times/issues"
				target="_blank"
				rel="noopener"
			>
				<span>📝</span> Open an issue
			</a>
			<span class="footer-divider">•</span>
			<a href="mailto:mohammedysn15@gmail.com"><span>✉️</span> Email me</a>
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
			radial-gradient(1px 1px at 40px 70px, rgba(255, 255, 255, 0.8), transparent),
			radial-gradient(1px 1px at 50px 160px, rgba(255, 255, 255, 0.6), transparent),
			radial-gradient(1px 1px at 90px 40px, white, transparent),
			radial-gradient(1px 1px at 130px 80px, rgba(255, 255, 255, 0.7), transparent),
			radial-gradient(1.5px 1.5px at 160px 120px, white, transparent);
		background-size: 200px 200px;
		animation: twinkle 4s ease-in-out infinite;
	}

	.stars-2 {
		background-image:
			radial-gradient(1px 1px at 75px 45px, rgba(255, 255, 255, 0.7), transparent),
			radial-gradient(1px 1px at 95px 95px, white, transparent),
			radial-gradient(1.5px 1.5px at 145px 25px, rgba(255, 255, 255, 0.6), transparent),
			radial-gradient(1px 1px at 175px 145px, rgba(255, 255, 255, 0.8), transparent),
			radial-gradient(1px 1px at 15px 125px, white, transparent);
		background-size: 200px 200px;
		animation: twinkle 5s ease-in-out infinite 1s;
	}

	.stars-3 {
		background-image:
			radial-gradient(1.5px 1.5px at 55px 115px, rgba(255, 255, 255, 0.5), transparent),
			radial-gradient(1px 1px at 115px 175px, rgba(255, 255, 255, 0.7), transparent),
			radial-gradient(1px 1px at 185px 75px, white, transparent);
		background-size: 200px 200px;
		animation: twinkle 6s ease-in-out infinite 2s;
	}

	@keyframes twinkle {
		0%,
		100% {
			opacity: 0.5;
		}
		50% {
			opacity: 1;
		}
	}

	.container {
		max-width: 480px;
		width: 100%;
		position: relative;
		z-index: 1;
		opacity: 0;
		transform: translateY(20px);
		transition:
			opacity 0.6s ease-out,
			transform 0.6s ease-out;
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
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-8px);
		}
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

	.status-text {
		text-align: center;
		font-size: 0.85rem;
		line-height: 1.4;
	}

	.status-text.loading {
		color: rgba(255, 255, 255, 0.35);
	}

	.status-text.success {
		color: rgba(120, 200, 140, 0.9);
		letter-spacing: 0.2px;
	}

	.description {
		text-align: center;
		font-size: 0.85rem;
		color: rgba(255, 255, 255, 0.5);
		line-height: 1.4;
	}

	.back-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 2rem;
		color: rgba(255, 255, 255, 0.5);
		font-family: inherit;
		font-size: 0.78rem;
		cursor: pointer;
		padding: 0.35rem 0.9rem;
		margin-bottom: 1.25rem;
		transition: all 0.2s ease;
	}

	.back-btn:hover {
		background: rgba(255, 255, 255, 0.1);
		color: rgba(255, 255, 255, 0.85);
		border-color: rgba(255, 255, 255, 0.2);
	}

	.back-arrow {
		display: inline-block;
		transition: transform 0.2s ease;
	}

	.back-btn:hover .back-arrow {
		transform: translateX(-3px);
	}

	.warning-banner {
		display: flex;
		align-items: flex-start;
		gap: 0.4rem;
		padding: 0.5rem 0.75rem;
		background: rgba(251, 191, 36, 0.1);
		border: 1px solid rgba(251, 191, 36, 0.2);
		border-radius: 0.5rem;
		margin-bottom: 1rem;
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

	.last-saved {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		font-size: 0.75rem;
		color: rgba(255, 255, 255, 0.4);
	}

	.location-prompt {
		margin-top: 1.75rem;
	}

	.location-divider {
		height: 1px;
		background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.08), transparent);
		margin-bottom: 1rem;
	}

	.location-link {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		width: 100%;
		background: none;
		border: none;
		font-family: inherit;
		font-size: 0.8rem;
		color: rgba(255, 255, 255, 0.35);
		cursor: pointer;
		padding: 0.25rem;
		transition: color 0.2s ease;
	}

	.location-link:hover {
		color: rgba(255, 255, 255, 0.7);
	}

	.arrow {
		display: inline-block;
		transition: transform 0.2s ease;
	}

	.location-link:hover .arrow {
		transform: translateX(3px);
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
