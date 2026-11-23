import type { Phase } from '@/lib/night';
import { FS, VS } from './sky-shader';

type Vec3 = [number, number, number];

interface Palette {
	top: Vec3;
	mid: Vec3;
	horiz: Vec3;
	/** Colour of the glow hugging the horizon. */
	scatter: Vec3;
	stars: number;
	lights: number;
}

/** What the sky eases towards. Colours are display-space RGB. */
export interface SkyTarget {
	phase: Phase;
	/** Moon phase: 0 new, 0.5 full. */
	moonPhase: number;
	/** Progress through the night, 0 (Maghrib) to 1 (Fajr). */
	f: number;
	moonOn: boolean;
}

const PALETTES: Record<Phase, Palette> = {
	before: {
		top: [0.05, 0.05, 0.17],
		mid: [0.22, 0.12, 0.3],
		horiz: [0.75, 0.38, 0.28],
		scatter: [1, 0.7, 0.42],
		stars: 0.15,
		lights: 0.15
	},
	'isha-third': {
		top: [0.03, 0.03, 0.12],
		mid: [0.12, 0.1, 0.33],
		horiz: [0.45, 0.24, 0.42],
		scatter: [0.85, 0.45, 0.6],
		stars: 0.65,
		lights: 0.9
	},
	'isha-half': {
		top: [0.015, 0.02, 0.09],
		mid: [0.06, 0.07, 0.28],
		horiz: [0.2, 0.2, 0.5],
		scatter: [0.3, 0.3, 0.75],
		stars: 1,
		lights: 1
	},
	between: {
		top: [0.006, 0.009, 0.05],
		mid: [0.045, 0.065, 0.25],
		horiz: [0.17, 0.23, 0.52],
		scatter: [0.3, 0.16, 0.38],
		stars: 1,
		lights: 0.7
	},
	last: {
		top: [0.008, 0.01, 0.04],
		mid: [0.03, 0.07, 0.24],
		horiz: [0.1, 0.28, 0.47],
		scatter: [0.8, 0.62, 0.3],
		stars: 0.9,
		lights: 0.5
	},
	after: {
		top: [0.05, 0.09, 0.22],
		mid: [0.2, 0.33, 0.55],
		horiz: [0.8, 0.55, 0.55],
		scatter: [1, 0.75, 0.62],
		stars: 0.1,
		lights: 0.15
	}
};

// The skyline is drawn in a 400×360 box with the waterline at y=200, then baked once into a texture.
const VB_W = 400;
const VB_H = 360;
const BASE = 200;
// Drawn 1.5× wider than the column and cropped, so the mosque stays large on a phone.
const SCENE = 1.5;
// The land runs on far beyond the drawing so a wide window never sees an edge.
const EXT = 2400;
const COL_MAX = 480;
const DPR_CAP = 2;
const AMBIENT_FPS = 30;

const WINDOWS: [number, number][] = [
	[31, 191],
	[52, 187],
	[52, 193],
	[70, 194],
	[350, 181],
	[350, 189],
	[370, 192],
	[180, 186],
	[200, 186],
	[220, 186],
	[100, 195],
	[300, 195],
	[392, 194]
];

interface Layout {
	hy: number;
	colW: number;
	yHor: number;
	winR: number;
	wins: Float32Array;
}

/**
 * Rasterises the silhouettes once into an RGB mask: R = far hills, G = mid hills, B = foreground.
 * The shader colours each layer, so the phase palette can change without redrawing anything.
 */
function bakeSkyline(cssW: number, cssH: number, dpr: number) {
	const canvas = document.createElement('canvas');
	canvas.width = Math.round(cssW * dpr);
	canvas.height = Math.round(cssH * dpr);
	const x = canvas.getContext('2d');
	if (!x) return null;

	const colW = Math.min(cssW, COL_MAX);
	const scale = (colW * SCENE) / VB_W;
	const yHor = cssH - VB_H * scale + BASE * scale;
	const x0 = (cssW - VB_W * scale) / 2;

	x.scale(canvas.width / cssW, canvas.height / cssH);
	x.translate(x0, yHor - BASE * scale);
	x.scale(scale, scale);
	x.globalCompositeOperation = 'lighter';

	const rect = (col: string, rx: number, ry: number, w: number, h: number) => {
		x.fillStyle = col;
		x.fillRect(rx, ry, w, h);
	};
	const path = (col: string, d: string) => {
		x.fillStyle = col;
		x.fill(new Path2D(d));
	};
	const dot = (col: string, cx: number, cy: number, r: number) => {
		x.fillStyle = col;
		x.beginPath();
		x.arc(cx, cy, r, 0, Math.PI * 2);
		x.fill();
	};
	const R = '#f00';
	const G = '#0f0';
	const B = '#00f';

	// far
	rect(R, -EXT, 150, EXT, 60);
	rect(R, VB_W, 124, EXT, 86);
	path(
		R,
		'M0 150 C30 132 60 142 100 128 S170 118 215 132 S300 124 340 120 S390 126 400 124 V210 H0Z'
	);
	// mid
	rect(G, -EXT, 172, EXT, 38);
	rect(G, VB_W, 160, EXT, 50);
	path(G, 'M0 172 C50 158 90 170 140 160 S230 150 280 162 S360 156 400 160 V210 H0Z');
	// near: ground, main hall + dome, minarets, side domes, houses
	rect(B, -EXT, 190, EXT, 10);
	rect(B, VB_W, 190, EXT, 10);
	rect(B, 160, 172, 80, 28);
	path(B, 'M170 172 V166 A30 30 0 0 1 230 166 V172Z');
	rect(B, 196, 130, 8, 8);
	rect(B, 199.3, 116, 1.4, 14);
	dot(B, 200, 113, 2.6);
	for (const mx of [132, 268]) {
		rect(B, mx - 4, 112, 8, 88);
		rect(B, mx - 7, 130, 14, 3.5);
		path(B, `M${mx - 5} 112 L${mx + 5} 112 L${mx} 94Z`);
		rect(B, mx - 0.6, 86, 1.2, 8);
		dot(B, mx, 84, 2);
	}
	path(B, 'M84 200 V190 A16 16 0 0 1 116 190 V200Z');
	path(B, 'M284 200 V190 A16 16 0 0 1 316 190 V200Z');
	for (const [hx, hyy, w, h] of [
		[0, 190, 18, 10],
		[20, 184, 22, 16],
		[44, 178, 16, 22],
		[62, 188, 18, 12],
		[320, 186, 20, 14],
		[342, 176, 16, 24],
		[360, 184, 22, 16],
		[384, 190, 16, 10]
	] as const) {
		rect(B, hx, hyy, w, h);
	}

	const wins = new Float32Array(WINDOWS.length * 3);
	WINDOWS.forEach(([wx, wy], i) => {
		wins[i * 3] = (x0 + wx * scale) / cssW;
		wins[i * 3 + 1] = 1 - (yHor - BASE * scale + wy * scale) / cssH;
	});
	const layout: Layout = { hy: 1 - yHor / cssH, colW, yHor, winR: (1.15 * scale) / cssH, wins };
	return { canvas, layout };
}

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const lerp3 = (a: Vec3, b: Vec3, k: number): Vec3 => [
	lerp(a[0], b[0], k),
	lerp(a[1], b[1], k),
	lerp(a[2], b[2], k)
];
const near = (a: number, b: number) => Math.abs(a - b) < 1e-3;

/**
 * Owns the WebGL context for the sky. One fullscreen triangle, one shader; every frame is a
 * handful of uniforms. It eases towards the latest target itself, so React never re-renders per
 * frame, runs flat out only while something is moving, and drops to 30fps for ambient motion.
 */
export function createSkyRenderer(canvas: HTMLCanvasElement, getTarget: () => SkyTarget) {
	const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const t0 = performance.now();

	let gl: WebGLRenderingContext | null = null;
	let program: WebGLProgram | null = null;
	let texture: WebGLTexture | null = null;
	let buffer: WebGLBuffer | null = null;
	let uniforms: Record<string, WebGLUniformLocation | null> = {};
	let layout: Layout | null = null;
	let cssW = 0;
	let cssH = 0;
	let raf = 0;
	let last = 0;
	let settled = false;
	let dead = false;

	// Where the sky is now. The intro is just this easing up from the horizon.
	const first = getTarget();
	const cur = {
		f: 0,
		moon: 0,
		pal: { ...PALETTES[first.phase] } as Palette
	};

	function compile(type: number, src: string) {
		const s = gl!.createShader(type);
		if (!s) return null;
		gl!.shaderSource(s, src);
		gl!.compileShader(s);
		if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
			console.error(gl!.getShaderInfoLog(s));
			return null;
		}
		return s;
	}

	function init() {
		gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'default' });
		if (!gl) return false;
		const vs = compile(gl.VERTEX_SHADER, VS);
		const fs = compile(gl.FRAGMENT_SHADER, FS);
		program = gl.createProgram();
		if (!vs || !fs || !program) return false;
		gl.attachShader(program, vs);
		gl.attachShader(program, fs);
		gl.linkProgram(program);
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false;
		gl.useProgram(program);

		buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
		const a = gl.getAttribLocation(program, 'a');
		gl.enableVertexAttribArray(a);
		gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);

		uniforms = {};
		for (const n of [
			'res',
			't',
			'tex',
			'hy',
			'moon',
			'moonR',
			'phase',
			'win[0]',
			'winR',
			'stat',
			'uHoriz',
			'uMid',
			'uTop',
			'uScatter',
			'uStars',
			'uLights',
			'uMoon'
		]) {
			uniforms[n] = gl.getUniformLocation(program, n);
		}
		texture = gl.createTexture();
		return true;
	}

	function resize() {
		if (!gl || !texture) return;
		const rect = canvas.getBoundingClientRect();
		cssW = rect.width;
		cssH = rect.height;
		if (!cssW || !cssH) return;
		const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
		canvas.width = Math.round(cssW * dpr);
		canvas.height = Math.round(cssH * dpr);
		gl.viewport(0, 0, canvas.width, canvas.height);
		const baked = bakeSkyline(cssW, cssH, dpr);
		if (!baked) return;
		layout = baked.layout;
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, baked.canvas);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		settled = false;
	}

	/** Moves `cur` towards the target; returns true once everything has arrived. */
	function ease(dt: number, target: SkyTarget) {
		const kf = 1 - Math.exp(-dt / 280);
		const kp = 1 - Math.exp(-dt / 420);
		const goal = PALETTES[target.phase];
		cur.f = lerp(cur.f, target.f, kf);
		cur.moon = lerp(cur.moon, target.moonOn ? 1 : 0, kp);
		cur.pal = {
			top: lerp3(cur.pal.top, goal.top, kp),
			mid: lerp3(cur.pal.mid, goal.mid, kp),
			horiz: lerp3(cur.pal.horiz, goal.horiz, kp),
			scatter: lerp3(cur.pal.scatter, goal.scatter, kp),
			stars: lerp(cur.pal.stars, goal.stars, kp),
			lights: lerp(cur.pal.lights, goal.lights, kp)
		};
		const done =
			near(cur.f, target.f) &&
			near(cur.moon, target.moonOn ? 1 : 0) &&
			near(cur.pal.stars, goal.stars) &&
			near(cur.pal.lights, goal.lights) &&
			cur.pal.top.every((v, i) => near(v, goal.top[i]!)) &&
			cur.pal.mid.every((v, i) => near(v, goal.mid[i]!)) &&
			cur.pal.horiz.every((v, i) => near(v, goal.horiz[i]!)) &&
			cur.pal.scatter.every((v, i) => near(v, goal.scatter[i]!));
		if (done) {
			cur.f = target.f;
			cur.moon = target.moonOn ? 1 : 0;
			cur.pal = { ...goal };
		}
		return done;
	}

	function draw(target: SkyTarget) {
		if (!gl || !layout || !cssW) return;
		const { colW, yHor, hy, winR, wins } = layout;
		const lift = Math.sin(Math.PI * cur.f);
		const mx = colW * 0.12 + colW * 0.76 * cur.f + (cssW - colW) / 2;
		const my = yHor + 26 - (yHor + 26 - cssH * 0.33) * lift;
		const winsLit = wins.slice();
		for (let i = 0; i < WINDOWS.length; i++) winsLit[i * 3 + 2] = 1;

		const u = uniforms;
		gl.uniform2f(u.res!, canvas.width, canvas.height);
		gl.uniform1f(u.t!, reduced ? 7.3 : (performance.now() - t0) / 1000);
		gl.uniform1i(u.tex!, 0);
		gl.uniform1f(u.hy!, hy);
		gl.uniform2f(u.moon!, mx / cssW, 1 - my / cssH);
		gl.uniform1f(u.moonR!, 34 / cssH);
		gl.uniform1f(u.phase!, target.moonPhase);
		gl.uniform3fv(u['win[0]']!, winsLit);
		gl.uniform1f(u.winR!, winR);
		gl.uniform1f(u.stat!, reduced ? 2 : 0);
		gl.uniform3fv(u.uHoriz!, cur.pal.horiz);
		gl.uniform3fv(u.uMid!, cur.pal.mid);
		gl.uniform3fv(u.uTop!, cur.pal.top);
		gl.uniform3fv(u.uScatter!, cur.pal.scatter);
		gl.uniform1f(u.uStars!, cur.pal.stars);
		gl.uniform1f(u.uLights!, cur.pal.lights);
		gl.uniform1f(u.uMoon!, cur.moon);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
	}

	function frame(now: number) {
		raf = 0;
		if (dead || document.hidden) return;
		const dt = Math.min(now - last, 250);
		// Full rate while something is moving, 30fps for the ambient shimmer.
		if (settled && dt < 1000 / AMBIENT_FPS - 2) {
			raf = requestAnimationFrame(frame);
			return;
		}
		last = now;
		const target = getTarget();
		settled = ease(dt, target);
		draw(target);
		// With reduced motion there is nothing ambient: stop once the sky has arrived.
		if (!(reduced && settled)) raf = requestAnimationFrame(frame);
	}

	function start() {
		if (raf || dead) return;
		settled = false;
		last = performance.now();
		raf = requestAnimationFrame(frame);
	}

	function stop() {
		cancelAnimationFrame(raf);
		raf = 0;
	}

	const ro = new ResizeObserver(() => {
		resize();
		start();
	});
	const onVisibility = () => (document.hidden ? stop() : start());
	const onLost = (e: Event) => {
		e.preventDefault();
		stop();
	};
	const onRestored = () => {
		if (init()) {
			resize();
			start();
		}
	};

	if (init()) {
		canvas.addEventListener('webglcontextlost', onLost);
		canvas.addEventListener('webglcontextrestored', onRestored);
		document.addEventListener('visibilitychange', onVisibility);
		ro.observe(canvas);
		resize();
		start();
	}

	return {
		/** The target changed: wake the loop if it had gone idle. */
		poke: start,
		dispose() {
			dead = true;
			stop();
			ro.disconnect();
			canvas.removeEventListener('webglcontextlost', onLost);
			canvas.removeEventListener('webglcontextrestored', onRestored);
			document.removeEventListener('visibilitychange', onVisibility);
			gl?.getExtension('WEBGL_lose_context')?.loseContext();
		}
	};
}
