# Converts sound levels to midi notes for consumption in synesthesia

from simplecoremidi import send_midi
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from os import getenv
from flask_cors import CORS
load_dotenv()

app = Flask(__name__)
CORS(app)

notes = [0, 0, 0, 0, 0, 0]


@app.route('/', methods=['GET'])
def get():
    global highestValue
    # highestValue += 1
    return jsonify(notes=notes)


@app.route('/', methods=['POST'])
def result():
    global highestValue
    # highestValue[0] = highestValue[0] + 1
    note = int(request.form['note'])
    velocity = int(request.form['velocity'])
    notes[note] = velocity
    send_midi((0xb0, note, velocity))
    print(note, velocity, notes)
    return '{},{}'.format(note, velocity)


app.run(
    host=getenv('MIDI_SERVER_HOST'),
    port=getenv('MIDI_SERVER_PORT'))
