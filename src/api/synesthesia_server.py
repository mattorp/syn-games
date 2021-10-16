# Used to communicate to and from Synesthesia
# https://synesthesia.live

# Information is send to Synesthesia through midi messages.
# Information is received from Synesthesia through pixels, using NDI:
# https://github.com/buresu/ndi-python

# Getting information from Synesthesia:

# A pixel is a vec4 (r, g, b, a). Since Synesthesia variables
# are single floats we can pack 3 values into one color. We need to
# show the pixels as rgba anyway. We can't use the alpha channel since it
# affects all the other colors in the output.

# To get the pixels, run a separate instance of Synesthesia, and set
# the resolution to ceil(variable_count/3)x1 (e.g. 12x1 for 35 variables).

# The scene in this should output all of the values as pixels
# constructed from the values:
# [(r, g, b, a), (r, g, b, a), ...] =
# [
# (value0, value1, value2, 1.0),
# (value4, value5, value6, 1.0),
# ...],
# Any remainders in the last row is set to 1.0
# If it's 0.0 for the alpha channel, we can't read any other values
# Example: https://gist.github.com/3612040647555cc8618805303368f25d

# import ndilib as ndin

from multiprocessing import Process, Value
from flask_cors import CORS
from os import getenv
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from simplecoremidi import send_midi
import cv2 as cv
import ndicapy as ndi
import numpy as np
import time


load_dotenv()

run = True


def kill(_, __):
    global run
    run = False


variables = [
    'syn_Level',
    'syn_BassLevel',
    'syn_MidLevel',
    'syn_MidHighLevel',
    'syn_HighLevel',
    'syn_Hits',
    'syn_BassHits',
    'syn_MidHits',
    'syn_MidHighHits',
    'syn_HighHits',
    'syn_Time',
    'syn_BassTime',
    'syn_MidTime',
    'syn_MidHighTime',
    'syn_HighTime',
    'syn_Presence',
    'syn_BassPresence',
    'syn_MidPresence',
    'syn_MidHighPresence',
    'syn_HighPresence',
    'syn_OnBeat',
    'syn_ToggleOnBeat',
    'syn_RandomOnBeat',
    'syn_BeatTime',
    'syn_BPMConfidence',
    'syn_BPMTwitcher',
    'syn_BeatTime',
    'syn_BPMSin',
    'syn_BPMSin2',
    'syn_BPMSin4',
    'syn_BPMTri',
    'syn_BPMTri2',
    'syn_BPMTri4',
    'syn_FadeInOut',
    'syn_Intensity',
]

# 4x12
pixels = [
    [0.0, 0.0, 0.0, 0.0],
    [0.0, 0.0, 0.0, 0.0],
    [0.0, 0.0, 0.0, 0.0],
    [0.0, 0.0, 0.0, 0.0],
    [0.0, 0.0, 0.0, 0.0],
    [0.0, 0.0, 0.0, 0.0],
    [0.0, 0.0, 0.0, 0.0],
    [0.0, 0.0, 0.0, 0.0],
    [0.0, 0.0, 0.0, 0.0],
    [0.0, 0.0, 0.0, 0.0],
    [0.0, 0.0, 0.0, 0.0],
    [0.0, 0.0, 0.0, 0.0],
]


def list_ports():
    is_working = True
    dev_port = 0
    working_ports = []
    available_ports = []
    while is_working:
        camera = cv.VideoCapture(dev_port)
        if not camera.isOpened():
            is_working = False
            print("Port %s is not working." % dev_port)
        else:
            is_reading, img = camera.read()
            print('img', img)
            w = camera.get(3)
            h = camera.get(4)
            if is_reading:
                print("Port %s is working and reads images (%s x %s)" %
                      (dev_port, h, w))
                working_ports.append(dev_port)
            else:
                print("Port %s for camera ( %s x %s) is present but does not reads." % (
                    dev_port, h, w))
                available_ports.append(dev_port)
    dev_port += 1
    print(available_ports, working_ports)


list_ports()


def get_syn_scene(variables):
    def get_vec3(arr):
        return """vec3(
                {values},
            ),\n""".format(values=',\n'.join(map(str, arr)))

    def create_matrix(variables):
        return [
            [x[0], x[1] or 0, x[2] or 0]
            for x in variables
        ]

    matrix = create_matrix(variables)
    vec3s = map(lambda x: get_vec3(x), matrix)
    text = '''
 uniform float[{length}][3] variables ={{
     {variables},
 }};
 
 vec4 renderMain() {
    int row = _xy.x;
    return variables[row];
}
        '''.format(length=vec3s.length, vec3s=vec3s)
    return text


def write_syn_scene_to_file(filename):
    text = get_syn_scene(variables)
    with open(filename, 'w') as f:
        f.write(text)


write_syn_scene_to_file('syn_scens/get_variables.glsl')


def get_pixels(_):

    global pixels

    # Could be any number, it's system specific, but it's u=usually 0, 1 etc.
    cap = cv.VideoCapture(2)
    time.sleep(3)
    while cap.isOpened():
        a, frame = cap.read()
        print(frame)


app = Flask(__name__)
CORS(app)


@app.route('/', methods=['POST'])
def post():
    note = int(request.form['note'])
    velocity = int(request.form['velocity'])
    send_midi((0xb0, note, velocity))
    return '{},{}'.format(note, velocity)


@app.route('/', methods=['GET'])
def get_tasks():
    return jsonify({'tasks': tasks})


def record_loop(loop_on):
    while True:
        if loop_on.value == True:
            print("loop running")
        time.sleep(1)


@app.route('/syn', methods=['GET'])
def get():
    [
        [
            syn_Level,
            syn_BassLevel,
            syn_MidLevel
        ],
        [
            syn_MidHighLevel,
            syn_HighLevel,
            syn_Hits
        ],
        [
            syn_BassHits,
            syn_MidHits,
            syn_MidHighHits
        ],
        [
            syn_HighHits,
            syn_Time,
            syn_BassTime
        ],
        [
            syn_MidTime,
            syn_MidHighTime,
            syn_HighTime
        ],
        [
            syn_Presence,
            syn_BassPresence,
            syn_MidPresence
        ],
        [
            syn_MidHighPresence,
            syn_HighPresence,
            syn_OnBeat
        ],
        [
            syn_ToggleOnBeat,
            syn_RandomOnBeat,
            syn_BeatTime
        ],
        [
            syn_BPMConfidence,
            syn_BPMTwitcher,
            syn_BeatTime
        ],
        [
            syn_BPMSin,
            syn_BPMSin2,
            syn_BPMSin4
        ],
        [
            syn_BPMTri,
            syn_BPMTri2,
            syn_BPMTri4
        ],
        [
            syn_FadeInOut,
            syn_Intensity,
            _
        ]
    ] = map(lambda x: map(str, x),  np.array(pixels)[:, np.r_[:, :3]])

    return {
        "syn_Level": syn_Level,
        "syn_BassLevel": syn_BassLevel,
        "syn_MidLevel": syn_MidLevel,
        "syn_MidHighLevel": syn_MidHighLevel,
        "syn_HighLevel": syn_HighLevel,
        "syn_Hits": syn_Hits,
        "syn_BassHits": syn_BassHits,
        "syn_MidHits": syn_MidHits,
        "syn_MidHighHits": syn_MidHighHits,
        "syn_HighHits": syn_HighHits,
        "syn_Time": syn_Time,
        "syn_BassTime": syn_BassTime,
        "syn_MidTime": syn_MidTime,
        "syn_MidHighTime": syn_MidHighTime,
        "syn_HighTime": syn_HighTime,
        "syn_Presence": syn_Presence,
        "syn_BassPresence": syn_BassPresence,
        "syn_MidPresence": syn_MidPresence,
        "syn_MidHighPresence": syn_MidHighPresence,
        "syn_HighPresence": syn_HighPresence,
        "syn_OnBeat": syn_OnBeat,
        "syn_ToggleOnBeat": syn_ToggleOnBeat,
        "syn_RandomOnBeat": syn_RandomOnBeat,
        "syn_BeatTime": syn_BeatTime,
        "syn_BPMConfidence": syn_BPMConfidence,
        "syn_BPMTwitcher": syn_BPMTwitcher,
        "syn_BeatTime": syn_BeatTime,
        "syn_BPMSin": syn_BPMSin,
        "syn_BPMSin2": syn_BPMSin2,
        "syn_BPMSin4": syn_BPMSin4,
        "syn_BPMTri": syn_BPMTri,
        "syn_BPMTri2": syn_BPMTri2,
        "syn_BPMTri4": syn_BPMTri4,
        "syn_FadeInOut": syn_FadeInOut,
        "syn_Intensit": syn_Intensity
    }


if __name__ == "__main__":
    recording_on = Value('b', True)

    p = Process(target=get_pixels, args=(recording_on,))
    p.start()
    app.run(
        host=getenv('MIDI_SERVER_HOST'),
        port=getenv('MIDI_SERVER_PORT'))
    p.join()
