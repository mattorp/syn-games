//:::

precision mediump float;
#define GLSLIFY 1

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float circle(vec2 p, float r) {
  p += 0.;
  return 1. - smoothstep(r - (r * .01), r + (r * .01), dot(p, p) * 4.);
}

/* Coordinate and unit utils */
vec2 coord(in vec2 p) {
  p = p / u_resolution.xy;
  // correct aspect ratio
  if(u_resolution.x > u_resolution.y) {
    p.x *= u_resolution.x / u_resolution.y;
    p.x += (u_resolution.y - u_resolution.x) / u_resolution.y / 2.;
  } else {
    p.y *= u_resolution.y / u_resolution.x;
    p.y += (u_resolution.x - u_resolution.y) / u_resolution.x / 2.;
  }
  // centering
  p -= .5;
  p *= vec2(-1., 1.);
  return p;
}
#define rx 1./min(u_resolution.x,u_resolution.y)
#define uv gl_FragCoord.xy/u_resolution.xy
#define st coord(gl_FragCoord.xy)
#define mx coord(u_mouse)

/* Pixel unit conversion function */
vec2 pos(in float x, in float y) {
  return st + vec2(x * rx, y * rx);
}
float size(in float x) {
  return x * rx;
}

#define TAU 6.283185307179586;

vec2 rPos(float r, float angle) {
  return pos(r * u_mouse.x * cos(angle + u_time / 2.), r * u_mouse.y * sin(angle + u_time * 2.));
}

vec4 getMain(void) {
  vec3 color = vec3(u_mouse / u_resolution.xy, 1.);

  float angle = TAU;

  color = vec3(0.);

  for(float i = 0.; i < 10.; i++) {
    color += vec3(0) + circle(st + rPos(1., angle * i / 10.), size(1.));
  }

  return vec4(color, 1.);
}

vec4 renderMain() {
  return getMain();
}

// :::
void main() {
  gl_FragColor = getMain();
}
