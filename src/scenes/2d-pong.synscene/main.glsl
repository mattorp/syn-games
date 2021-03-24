precision mediump float;

uniform vec2 u_resolution;

vec3 u_circle_0 = vec3( 400, 400, 0.035);
vec3 u_circle_1 = vec3( 3465.285173471781, -869.0126894522359, 0.035);
vec3 u_circle_2 = vec3( 2688.999250266217, 103.75771228568199, 0.035);
vec3 u_circle_3 = vec3( 2799.767571205945, 937.4349094234724, 0.035);
vec3 u_circle_4 = vec3( -4438.766746351609, 4608.302026646446, 0.035);
vec3 u_circle_5 = vec3( 3756.5066094507315, 1518.920539026433, 0.035);
vec3 u_circle_6 = vec3( -2137.595481777841, 1079.9378357372955, 0.035);
vec3 u_circle_7 = vec3( 6006.066544148513, 2871.6700144903793, 0.035);
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
