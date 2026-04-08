<script lang="ts">
	let showInfo = $state(false);
</script>

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

<style>
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
</style>
