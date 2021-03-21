precision mediump float;

uniform vec2 u_resolution;

vec3 u_circle_0 = vec3( 400, 400, 0.035);
vec3 u_circle_1 = vec3( 670.4744409061373, 405.62139787706496, 0.035);
vec3 u_circle_2 = vec3( 709.9851648520955, 585.9752336407856, 0.035);
vec3 u_circle_3 = vec3( 857.1917269492913, 692.495759386765, 0.035);
vec3 u_circle_4 = vec3( 297.9849569045699, 1007.687635659031, 0.035);
vec3 u_circle_5 = vec3( 1559.109598193742, 1240.2223255952892, 0.035);
vec3 u_circle_6 = vec3( 1236.6686258185453, 1627.2609449151553, 0.035);
vec3 u_circle_7 = vec3( 2282.0720318397744, 1896.122197584244, 0.035);
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
