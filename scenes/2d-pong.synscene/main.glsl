precision mediump float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// :::

#define rx 1./min(u_resolution.x,u_resolution.y)
#define uv gl_FragCoord.xy/u_resolution.xy
#define st coord(gl_FragCoord.xy)
#define mx coord(u_mouse)

/* Pixel unit conversion function */
float size(in float x) {
  return x * rx;
}

#define TAU 6.283185307179586;

vec4 getMain(void) {
  vec2 dist = u_mouse / u_resolution - uv.xy;
  dist.x *= u_resolution.x / u_resolution.y;

  float mouse_pct = length(dist);
  float inside_circle = step(mouse_pct, size(20.));
  vec3 color = vec3(inside_circle);

  return vec4(color, .5);
}

void main() {
  gl_FragColor = getMain();
}

// :::
vec4 renderMain() {
  return getMain();
}
