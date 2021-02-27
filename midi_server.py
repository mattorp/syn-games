# Converts sound levels to midi notes for consumption in synesthesia

from simplecoremidi import send_midi
from flask import Flask, request

HOST = '0.0.0.0'
PORT = '5002'

app = Flask(__name__)

@app.route('/', methods=['POST'])
def result():
    note = int(request.form['note'])
    velocity = int(request.form['velocity'])
    send_midi((0xb0, note, velocity))
    print(note, velocity)
    return '{},{}'.format(note, velocity)

app.run(host='0.0.0.0', port='5002')
