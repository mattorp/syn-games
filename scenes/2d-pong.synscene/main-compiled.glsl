precision mediump float;
#define GLSLIFY 1

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// uniform vec3 u_circle_0;
// uniform vec3 u_circle_1;
// uniform vec3 u_circle_2;
// uniform vec3 u_circle_3;

// int u_circle_0 = 2;
// float u_circle_0 = 2.0000000001;
// vec2 u_circle_0 = vec2( 1, 2);
vec3 u_circle_0 = vec3(300, 600, 10);
// vec4 u_circle_0 = vec4( 1, 2, 3, 1);

#define rx 1./min(u_resolution.x,u_resolution.y)
#define uv gl_FragCoord.xy/u_resolution.xy
#define st coord(gl_FragCoord.xy)
#define mx coord(u_mouse)

/* Pixel unit conversion function */
float size(in float x) {
  return x * rx;
}

float inside_circle(in vec3 circle) {
  vec2 dist = circle.xy / u_resolution - uv.xy;
  dist.x *= u_resolution.x / u_resolution.y;

  float mouse_pct = length(dist);
  return step(mouse_pct, size(circle.z));
}

vec4 getMain(void) {
  vec3 color;

  color += inside_circle(u_circle_0);
  // color += inside_circle(u_circle_1);
  // color += inside_circle(u_circle_2);
  // color += inside_circle(u_circle_3);

  return vec4(color, 1);
}

void main() {
  for(int i = 0; i < 9; i++) {
    p[i] = vec2(0.0);
  }
  gl_FragColor = getMain();
}

// :::
vec4 renderMain() {
  return getMain();
}
