precision mediump float;

uniform vec2 u_resolution;

vec3 u_circle_0 = vec3( 400, 400, 0.035);
vec3 u_circle_1 = vec3( 146666.2112327189, 404865.4831307879, 0.035);
vec3 u_circle_2 = vec3( 59649.45507194759, 418618.320883604, 0.035);
vec3 u_circle_3 = vec3( 213668.0291345977, 444079.4241601012, 0.035);
vec3 u_circle_4 = vec3( 370447.25122005126, 274840.99070703285, 0.035);
vec3 u_circle_5 = vec3( 426405.1052609363, 208699.92852356654, 0.035);
vec3 u_circle_6 = vec3( 235986.3762209581, 308553.14897415426, 0.035);
vec3 u_circle_7 = vec3( 171751.0952764783, 134902.65961283664, 0.035);
vec3 u_circle_8 = vec3( 2008, 2000, 0.035);

#define uv gl_FragCoord.xy/u_resolution.xy

float inside_circle(in vec3 circle) {
  vec2 dist = circle.xy / u_resolution - uv.xy;
  dist.x *= u_resolution.x / u_resolution.y;

  float len = length(dist);
  return step(len, circle.z);
}

vec4 getMain(void) {
  vec3 color;

  color += inside_circle(u_circle_0) * vec3(1, 0, 0);
  color += inside_circle(u_circle_1) * vec3(1, 1, 0);
  color += inside_circle(u_circle_2) * vec3(1, 1, 1);
  color += inside_circle(u_circle_3) * vec3(0, 0, 1);
  color += inside_circle(u_circle_4) * vec3(0, 1, 0);
  color += inside_circle(u_circle_5) * vec3(0, 1, 1);
  color += inside_circle(u_circle_6) * vec3(1, 0, 1);
  color += inside_circle(u_circle_7) * vec3(1, 1, 1);
  color += inside_circle(u_circle_8) * vec3(1, 0, 0);

  return vec4(color, 1);
}

void main() {
  gl_FragColor = getMain();
}

// :::
vec4 renderMain() {
  return getMain();
}
vec4 Main() {
  return getMain();
}
