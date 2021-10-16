# Synesthesia scene to output the variables as pixels
# for consumption by other services
# Example: https://gist.github.com/mattorp/1f35d47b7e8a8678849e0dd38c08cc66

uniform float[9][4] variables = {
  vec4(
    syn_Level
    syn_BassLevel
    syn_MidLevel
    syn_MidHighLevel
  ),
  vec4(
    syn_HighLevel
    syn_Hits
    syn_BassHits
    syn_MidHits
  ),
  vec4(
    syn_MidHighHits
    syn_HighHits
    syn_Time
    syn_BassTime
  ),
  vec4(
    syn_MidTime
    syn_MidHighTime
    syn_HighTime
    syn_Presence
  ),
  vec4(
    syn_BassPresence
    syn_MidPresence
    syn_MidHighPresence
    syn_HighPresence
  ),
  vec4(
    syn_OnBeat
    syn_ToggleOnBeat
    syn_RandomOnBeat
    syn_BeatTime
  ),
  vec4(
    syn_BPMConfidence
    syn_BPMTwitcher
    syn_BeatTime
    syn_BPMSin
  ),
  vec4(
    syn_BPMSin2
    syn_BPMSin4
    syn_BPMTri
    syn_BPMTri2
  ),
  vec4(
    syn_BPMTri4
    syn_FadeInOut
    syn_Intensity,
    0.0
  )
};

vec4 renderMain() {
    int row = _xy.x;
    return variables[row];
}
