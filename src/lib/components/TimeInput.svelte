<script lang="ts">
	let {
		label,
		value = $bindable(),
		warning = false,
		warningText = ''
	}: {
		label: string;
		value: string;
		warning?: boolean;
		warningText?: string;
	} = $props();
</script>

<div class="time-input">
	<label>
		{label}
		<input type="time" bind:value class:warning />
	</label>

	{#if warning && warningText}
		<p class="warning-text">{warningText}</p>
	{/if}
</div>

<style>
	.time-input {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
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
	}

	@media (max-width: 500px) {
		input[type='time'] {
			width: 100%;
			max-width: 200px;
		}
	}
</style>
