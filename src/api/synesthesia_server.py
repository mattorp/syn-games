# Used to communicate to and from Synesthesia
# https://synesthesia.live

# Information is send to Synesthesia through midi messages.
# Information is received from Synesthesia through pixels, using NDI:
# https://github.com/buresu/ndi-python

# Getting information from Synesthesia:

# A pixel is a vec4 (r, g, b, a). Since Synesthesia variables
# are single floats we can pack 4 values into one color. We need to
# show the pixels as rgba anyway.

# To get the pixels, run a separate instance of Synesthesia, and set
# the resolution to ceil(variable_count/4)x1 (e.g. 9x1 for 35 variables).

# The scene in this should output all of the values as pixels
# constructed from the values:
# [(r, g, b, a), (r, g, b, a), ...] =
# [
# (value0, value1, value2, value3),
# (value4, value5, value6, value7),
# ...],
# Any remainders in the last row is set to 0.0
# Example: https://gist.github.com/3612040647555cc8618805303368f25d

import NDIlib as ndi
import numpy as np
import signal
from simplecoremidi import send_midi
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from os import getenv
from flask_cors import CORS
load_dotenv()

run = True


def kill():
    global run
    run = False


signal.signal(signal.SIGINT, kill)
signal.signal(signal.SIGTERM, kill)


pixels = []


def get_pixels():
    global pixels

    if not ndi.initialize():
        return 0

    ndi_find = ndi.find_create_v2()

    if ndi_find is None:
        return 0

    sources = []
    while not len(sources) > 0:
        print('Looking for sources ...')
        ndi.find_wait_for_sources(ndi_find, 1000)
        sources = ndi.find_get_current_sources(ndi_find)

    ndi_recv_create = ndi.RecvCreateV3()
    ndi_recv_create.color_format = ndi.RECV_COLOR_FORMAT_BGRX_BGRA

    ndi_recv = ndi.recv_create_v3(ndi_recv_create)

    if ndi_recv is None:
        return 0

    ndi.recv_connect(ndi_recv, sources[0])

    ndi.find_destroy(ndi_find)

    while run:
        t, v, _, _ = ndi.recv_capture_v2(ndi_recv, 5000)

        if t == ndi.FRAME_TYPE_VIDEO:
            pixels = np.copy(v.data)
            ndi.recv_free_video_v2(ndi_recv, v)

        if cv.waitKey(1) & 0xff == 27:
            break

    ndi.recv_destroy(ndi_recv)
    ndi.destroy()

    return 0


app = Flask(__name__)
CORS(app)


@app.route('/', methods=['POST'])
def post():
    note = int(request.form['note'])
    velocity = int(request.form['velocity'])
    send_midi((0xb0, note, velocity))
    return '{},{}'.format(note, velocity)


@app.route('/', methods=['GET'])
def get():
    (
        [
            syn_Level,
            syn_BassLevel,
            syn_MidLevel,
            syn_MidHighLevel,
        ],
        [
            syn_HighLevel,
            syn_Hits,
            syn_BassHits,
            syn_MidHits,
        ],
        [
            syn_MidHighHits,
            syn_HighHits,
            syn_Time,
            syn_BassTime,
        ],
        [
            syn_MidTime,
            syn_MidHighTime,
            syn_HighTime,
            syn_Presence,
        ],
        [
            syn_BassPresence,
            syn_MidPresence,
            syn_MidHighPresence,
            syn_HighPresence,
        ],
        [
            syn_OnBeat,
            syn_ToggleOnBeat,
            syn_RandomOnBeat,
            syn_BeatTime,
        ],
        [
            syn_BPMConfidence,
            syn_BPMTwitcher,
            syn_BeatTime,
            syn_BPMSin,
        ],
        [
            syn_BPMSin2,
            syn_BPMSin4,
            syn_BPMTri,
            syn_BPMTri2,
        ], [
            syn_BPMTri4,
            syn_FadeInOut,
            syn_Intensity,
        ]
    ) = pixels

    return jsonify({
        "syn_level": syn_Level,
        "syn_bass_level": syn_BassLevel,
        "syn_mid_level": syn_MidLevel,
        "syn_mid_high_level": syn_MidHighLevel,
        "syn_high_level": syn_HighLevel,
        "syn_hits": syn_Hits,
        "syn_bass_hits": syn_BassHits,
        "syn_mid_hits": syn_MidHits,
        "syn_mid_high_hits": syn_MidHighHits,
        "syn_high_hits": syn_HighHits,
        "syn_time": syn_Time,
        "syn_bass_time": syn_BassTime,
        "syn_mid_time": syn_MidTime,
        "syn_mid_high_time": syn_MidHighTime,
        "syn_high_time": syn_HighTime,
        "syn_presence": syn_Presence,
        "syn_bass_presence": syn_BassPresence,
        "syn_mid_presence": syn_MidPresence,
        "syn_mid_high_presence": syn_MidHighPresence,
        "syn_high_presence": syn_HighPresence,
        "syn_on_beat": syn_OnBeat,
        "syn_toggle_on_beat": syn_ToggleOnBeat,
        "syn_random_on_beat": syn_RandomOnBeat,
        "syn_beat_time": syn_BeatTime,
        "syn_bpm_confidence": syn_BPMConfidence,
        "syn_bpm_twitcher": syn_BPMTwitcher,
        "syn_beat_time": syn_BeatTime,
        "syn_bpm_sin": syn_BPMSin,
        "syn_bpm_sin2": syn_BPMSin2,
        "syn_bpm_sin4": syn_BPMSin4,
        "syn_bpm_tri": syn_BPMTri,
        "syn_bpm_tri2": syn_BPMTri2,
        "syn_bpm_tri4": syn_BPMTri4,
        "syn_FadeInOut": syn_FadeInOut,
        "syn_Intensity": syn_Intensity
    })


app.run(
    host=getenv('MIDI_SERVER_HOST'),
    port=getenv('MIDI_SERVER_PORT'))

if __name__ == "__main__":
    get_pixels()
