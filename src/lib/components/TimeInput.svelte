<script lang="ts">
	let {
		label,
		value = $bindable(),
		warning = false
	}: {
		label: string;
		value: string;
		warning?: boolean;
	} = $props();

	let focused = $state(false);
</script>

<div class="time-input" class:focused class:warning class:has-value={!!value}>
	<label>
		<span class="label-text">{label}</span>
		<div class="input-wrapper">
			<input
				type="time"
				bind:value
				onfocus={() => (focused = true)}
				onblur={() => (focused = false)}
			/>
			<div class="glow"></div>
		</div>
	</label>
</div>

<style>
	.time-input {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	label {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.label-text {
		font-size: 0.85rem;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.7);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		transition: color 0.3s ease;
	}

	.time-input.focused .label-text,
	.time-input.has-value .label-text {
		color: rgba(180, 200, 255, 0.9);
	}

	.time-input.warning .label-text {
		color: #fbbf24;
	}

	.input-wrapper {
		position: relative;
	}

	.glow {
		position: absolute;
		inset: -2px;
		border-radius: 0.75rem;
		background: linear-gradient(135deg, rgba(100, 150, 255, 0.3), rgba(150, 100, 255, 0.3));
		opacity: 0;
		filter: blur(8px);
		transition: opacity 0.3s ease;
		z-index: -1;
	}

	.time-input.focused .glow {
		opacity: 1;
	}

	.time-input.warning .glow {
		background: linear-gradient(135deg, rgba(251, 191, 36, 0.4), rgba(245, 158, 11, 0.4));
	}

	input[type='time'] {
		font-family: inherit;
		font-size: 1.1rem;
		font-weight: 500;
		padding: 0.875rem 1rem;
		border-radius: 0.75rem;
		border: 2px solid rgba(255, 255, 255, 0.1);
		background: rgba(255, 255, 255, 0.08);
		color: #fff;
		width: 170px;
		transition: all 0.3s ease;
		text-align: center;
	}

	input[type='time']:focus {
		outline: none;
		border-color: rgba(100, 150, 255, 0.5);
		background: rgba(255, 255, 255, 0.12);
	}

	.time-input.warning input[type='time'] {
		border-color: #f59e0b;
		background: rgba(245, 158, 11, 0.1);
	}

	input[type='time']::-webkit-calendar-picker-indicator {
		filter: invert(1) opacity(0.5);
		cursor: pointer;
		transition: opacity 0.2s ease;
	}

	input[type='time']::-webkit-calendar-picker-indicator:hover {
		opacity: 0.8;
	}
</style>
