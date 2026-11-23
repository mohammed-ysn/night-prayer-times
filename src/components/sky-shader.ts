// Fragment shader for the night sky: sky, stars, moon, skyline (sampled from a baked texture),
// lit windows and a rippling water reflection, all in one pass.

export const VS = `attribute vec2 a; void main(){ gl_Position = vec4(a,0.,1.); }`;

export const FS = `
precision highp float;
uniform vec2 res; uniform float t; uniform sampler2D tex;
uniform float hy; uniform vec2 moon; uniform float moonR; uniform float phase;
uniform vec3 win[13]; uniform float winR; uniform float stat;
uniform vec3 uHoriz, uMid, uTop, uScatter; uniform float uStars, uLights, uMoon;

float A;
const vec3 MOONC = vec3(1.0, 0.96, 0.86);

float h21(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }
float vnoise(vec2 p){
  vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(h21(i),h21(i+vec2(1,0)),f.x), mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x), f.y);
}
float fbm(vec2 p){ float v=0., a=.5; for(int i=0;i<5;i++){ v+=a*vnoise(p); p=p*2.03+vec2(17.1,9.7); a*=.5; } return v; }
float fbm3(vec2 p){ float v=0., a=.5; for(int i=0;i<3;i++){ v+=a*vnoise(p); p=p*2.03+vec2(17.1,9.7); a*=.5; } return v; }

vec3 skyCol(vec2 p){
  float k = clamp((p.y-hy)/(1.-hy),0.,1.);
  vec3 horiz = uHoriz, mid = uMid, top = uTop;
  vec3 c = mix(horiz, mid, smoothstep(0.,.38,k));
  c = mix(c, top, smoothstep(.25,1.,k));
  c += uScatter*exp(-k*9.)*.55;           // violet scatter hugging the horizon
  c += vec3(.05,.2,.28)*exp(-k*22.)*.35;           // teal band just above it
  return c;
}

vec3 starField(vec2 q, float k){
  vec3 acc = vec3(0.);
  for(int i=0;i<2;i++){
    float sc = i==0 ? 55. : 120.;
    vec2 g = q*sc, id=floor(g), f=fract(g)-.5;
    float h = h21(id + float(i)*17.);
    float on = step(i==0 ? .90 : .945, h);
    vec2 off = (vec2(h21(id+3.1),h21(id+7.7))-.5)*.6;
    float d = length(f-off);
    float mag = h21(id+9.3);
    float tw = .78+.22*sin(t*(1.2+mag*3.)+h*40.);
    float s = on*exp(-d*d*(i==0?420.:260.))*(.35+mag*.9)*tw;
    vec3 tint = mix(vec3(.75,.85,1.), vec3(1.,.9,.75), h21(id+1.7));
    acc += s*tint*(i==0?1.:.7);
  }
  // milky way: a diagonal band of fine haze
  vec2 c = q - vec2(.55*A,.62);
  float band = dot(c, normalize(vec2(1.,-.55)));
  float mw = exp(-band*band*22.) * smoothstep(.35,.8,fbm(q*vec2(4.,4.)+3.));
  vec2 dg = q*240.; vec2 did = floor(dg); vec2 df = fract(dg)-.5;
  float dust = step(.80, h21(did+41.)) * exp(-dot(df,df)*55.);
  acc += vec3(.30,.36,.70)*mw*.13 + vec3(.9,.85,1.)*mw*dust*.55;
  return acc * smoothstep(hy+.03, hy+.4, q.y) * uStars;
}

vec3 moonDisc(vec2 q, vec2 mq, out float alpha){
  vec2 d = (q-mq)/moonR; float r = length(d);
  alpha = 0.;
  if(r>1.) return vec3(0.);
  float z = sqrt(1.-r*r);
  vec3 n = vec3(d, z);
  float a = 6.2831853*phase;
  vec3 L = vec3(sin(a), 0., -cos(a));
  float lit = smoothstep(-.03,.06,dot(n,L));
  float maria = fbm3(d*1.7+4.);
  float crat = fbm(d*6.+9.);
  vec3 surf = mix(vec3(.80,.82,.92), vec3(1.,.97,.90), smoothstep(.25,.75,maria));
  surf *= .93+.14*crat;
  surf *= mix(.62,1.,z);                              // limb darkening
  vec3 earthshine = vec3(.04,.055,.11)*(.6+.4*crat);
  alpha = smoothstep(1.,.985,r);
  return mix(earthshine, surf*.96, lit);
}

vec3 shootingStar(vec2 q){
  // One 60s slot at a time; each slot rolls its own timing, start point, angle and length.
  // Fires 0-20s into the slot (and skips ~30% of slots), so gaps run from ~40s to ~2min.
  if(stat>1.5) return vec3(0.);
  float n = stat>.5 ? 4. : floor(t/60.);
  float lt = t - n*60.;
  float h0=h21(vec2(n,1.3)), h1=h21(vec2(n,5.7)), h2=h21(vec2(n,9.1)), h3=h21(vec2(n,13.3)), h4=h21(vec2(n,21.9)), h5=h21(vec2(n,33.7));
  float dur = 1.2 + h3*.6;
  float tau = stat>.5 ? .55 : (lt - h0*20.)/dur;
  if(stat<.5 && (h4<.3 || tau<0. || tau>1.)) return vec3(0.);
  // right half of the sky only, so it stays clear of the countdown text
  vec2 s0 = vec2(mix(.27,.40,h1), mix(.52,.80,h2));
  vec2 dir = normalize(vec2(mix(-.35,.20,h5), -1.));
  float len = mix(.24,.36,h3), L = .13;
  float head = tau*len;
  vec2 v = q - s0;
  float al = dot(v,dir), pr = dot(v, vec2(-dir.y,dir.x));
  float tail = smoothstep(head-L, head, al) * step(al, head);
  float w = exp(-pr*pr*60000.);
  float hd = exp(-(pow(al-head,2.)+pr*pr)*30000.);
  float fade = sin(3.14159*clamp(tau,0.,1.));
  return (vec3(.8,.9,1.)*tail*w*.9 + vec3(1.)*hd*1.4)*fade;
}

vec3 sceneCol(vec2 p){
  vec2 q = vec2(p.x*A, p.y);
  vec2 mq = vec2(moon.x*A, moon.y);
  float k = clamp((p.y-hy)/(1.-hy),0.,1.);
  vec3 sky = skyCol(p);
  vec3 c = sky;
  c += starField(q,k);
  // moon + halo
  float md = length(q-mq);
  c += (vec3(.55,.65,1.)*exp(-md*md*7.)*.20 + vec3(.5,.6,1.)*exp(-md*2.6)*.10)*uMoon;
  float ma; vec3 md3 = moonDisc(q,mq,ma); ma *= uMoon;
  float rimGlow = exp(-max(md-moonR,0.)*34.);
  c += MOONC*rimGlow*.32*uMoon;
  c = mix(c, md3, ma);
  c += shootingStar(q)*uStars;
  // skyline
  vec3 m = texture2D(tex,p).rgb;
  vec3 horizC = skyCol(vec2(p.x,hy));
  vec3 farC = mix(horizC, vec3(.02,.025,.09), .62);
  vec3 midC = vec3(.024,.032,.098);
  vec3 nearC = vec3(.007,.009,.028);
  c = mix(c, farC, m.r);
  c = mix(c, midC, m.g);
  c = mix(c, nearC, m.b);
  // moonlit rim on edges facing the moon
  vec2 tm2 = normalize(vec2((mq.x-q.x)/A, mq.y-q.y)+1e-4);
  float rim = clamp(m.b - texture2D(tex, p + tm2*vec2(2.6,2.6)/res).b, 0., 1.);
  float rim2 = clamp(m.g - texture2D(tex, p + tm2*vec2(2.2,2.2)/res).g, 0., 1.);
  c += MOONC*(rim*.20 + rim2*.10*(1.-m.b))*smoothstep(0.,.5,1.-md*.9)*uMoon;
  // low mist at the base of the skyline
  c += vec3(.20,.22,.45)*exp(-(p.y-hy)*34.)*.22;
  // lit windows
  for(int i=0;i<13;i++){
    vec2 wq = vec2(win[i].x*A, win[i].y);
    float d = length(q-wq);
    float core = exp(-d*d/(winR*winR)*1.6);
    float glow = exp(-d*d/(winR*winR*40.));
    c += vec3(1.,.80,.50)*(core*1.1 + glow*.12)*uLights;
  }
  return c;
}

void main(){
  vec2 p = gl_FragCoord.xy/res;
  A = res.x/res.y;
  vec3 c;
  if(p.y >= hy){
    c = sceneCol(p);
  } else {
    float d = hy - p.y;
    float persp = 1./(d*7.+.10);
    vec2 w = vec2(p.x*A*13., persp*1.9 - t*.35);
    float n1 = vnoise(w + vnoise(w*1.7+3.)*1.6);
    float n2 = vnoise(vec2(p.x*A*40., persp*4.5 + t*.5));
    float disp = (n1-.5)*(.006+d*.12);
    vec2 rp = vec2(p.x+disp, hy + d*1.0 + (n1-.5)*.004);
    vec3 refl = sceneCol(rp);
    vec3 base = mix(vec3(.025,.06,.16), vec3(.004,.007,.022), smoothstep(0.,hy,d));
    float fres = mix(.80,.30, smoothstep(0.,hy*.95,d));
    c = mix(base, refl*.62, fres*.95);
    // moon path: a glittering column that widens with depth
    float dx = (p.x-moon.x)*A;
    float wd = .010+d*.20;
    float path = exp(-dx*dx/(wd*wd)) * exp(-d*4.2);
    float glit = smoothstep(.40,.85,n1*.6+n2*.6) ;
    c += MOONC*path*(.12+.9*glit)*.62*uMoon;
    // sparkle glints
    vec2 gg = vec2(p.x*A*70., persp*10.); vec2 gid = floor(gg), gf = fract(gg);
    float sp = step(.93, h21(gid+7.)) * smoothstep(0.,.25,gf.x)*smoothstep(1.,.75,gf.x) * smoothstep(.40,.5,gf.y)*smoothstep(.6,.5,gf.y) * exp(-d*2.4);
    c += vec3(.7,.8,1.)*sp*.55*(.5+.5*sin(t*3.+gid.x*1.7));
  }
  // horizon line
  c += vec3(.35,.45,.9)*exp(-abs(p.y-hy)*420.)*.16;
  // vignette + dither
  vec2 vv = p-.5;
  c *= 1.-.32*dot(vv,vv)*1.6;
  c += (h21(gl_FragCoord.xy+fract(t))-.5)/255.*1.5;
  gl_FragColor = vec4(c,1.);
}`;
