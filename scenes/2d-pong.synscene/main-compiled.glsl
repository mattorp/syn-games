precision mediump float;
#define GLSLIFY 1

uniform vec2 u_resolution;

vec3 u_circle_0 = vec3(-2761.681069958838, -2761.681069958838, 0.011111111111111112);
vec3 u_circle_1 = vec3(-809.9795953360626, -809.9795953360626, 0.011111111111111112);
vec3 u_circle_2 = vec3(460.0271871665693, 460.0271871665693, 0.011111111111111112);
vec3 u_circle_3 = vec3(1275.2631077579672, 1275.2631077579672, 0.011111111111111112);
vec3 u_circle_4 = vec3(1762.7703703703678, 1762.7703703703678, 0.011111111111111112);
vec3 u_circle_5 = vec3(2759.7999999998974, 2759.7999999998974, 0.011111111111111112);
vec3 u_circle_6 = vec3(3424.0000000000764, 3424.0000000000764, 0.011111111111111112);

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

  return vec4(color, 1);
}

void main() {
  gl_FragColor = getMain();
}

// :::
vec4 renderMain() {
  return getMain();
}
