# Converts sound levels to midi notes

from simplecoremidi import send_midi
from flask import Flask, request

app = Flask(__name__)

@app.route('/', methods=['POST'])
def result():
    note = int(request.form['note'])
    velocity = int(request.form['velocity'])
    send_midi((0xb0, note, velocity))

    return ''

app.run()
