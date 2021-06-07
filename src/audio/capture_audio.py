# Captures audio and sends audio levels to a midi server

import time
import pyaudio
import audioop
import sys
import requests
import numpy
from dotenv import load_dotenv
from os import getenv
import sounddevice as sd
sd.stop()


load_dotenv()

FORMAT = pyaudio.paInt16
RATE = 44100
CHUNK = 1024
MAX = 127
FACTOR = 4000
KEEP_AVG_FOR_ITTERATIONS = 10

sd.default.device = 5
sd.default.samplerate = RATE


def get_sound_level(channel):
    return audioop.rms(channel.tostring(),
                       2)


def prevent_overflow(soundLevel):
    return min(127, soundLevel)


audio = pyaudio.PyAudio()


def capture_audio(
    seconds=3600,
    index=0,
    channelCount=2,
    selectedChannelIndex=None
):

    stream = audio.open(
        format=FORMAT,
        channels=channelCount,
        rate=RATE,
        input=True,
        frames_per_buffer=CHUNK,
        input_device_index=index
    )

    latestSoundLevels = []
    for i in range(0, channelCount):
        latestSoundLevels.append(list(range(0, KEEP_AVG_FOR_ITTERATIONS)))

    def get_channel(i, data_array):
        return data_array[i::channelCount]

    def update_latest(i, soundLevel):
        latest = latestSoundLevels[i]
        latest.pop(0)
        latest.append(soundLevel)
        return latest

    def normalize_sound_level(soundLevel):
        return round(soundLevel/FACTOR*MAX)

    def send_midi_note(i, data_array):
        channel = get_channel(i, data_array)
        soundLevel = normalize_sound_level(get_sound_level(channel))
        latest = update_latest(i, soundLevel)
        maxLevel = round(sum(latest)/len(latest)*2)
        print(maxLevel)
        velocity = prevent_overflow(maxLevel)
        note = i
        # 60 + i
        print(velocity)
        requests.post('http://{HOST}:{PORT}/'.format(
            HOST=getenv('MIDI_SERVER_HOST'),
            PORT=getenv('MIDI_SERVER_PORT'),
        ),
            data={'note': note, 'velocity': velocity})

    # data_array = numpy.fromstring(data, dtype='int16')

    # sd.play(data_array)
    # sd.wait()
    for _ in range(0, int(RATE/CHUNK*seconds)):

        data = stream.read(CHUNK, exception_on_overflow=False)
        data_array = numpy.fromstring(data, dtype='int16')

    #     play = data_array
        if selectedChannelIndex is not None:
            send_midi_note(selectedChannelIndex, data_array)
        else:
            for i in range(0, channelCount):
                send_midi_note(i, data_array)

        time.sleep(.1)

    sd.stop()
    stream.stop_stream()
    stream.close()
    audio.terminate()


if __name__ == "__main__":
    if len(sys.argv) == 1:
        capture_audio()
    else:
        capture_audio(
            int(sys.argv[1]),
            int(sys.argv[2]),
            int(sys.argv[3]),
            int(sys.argv[4]) if len(sys.argv) == 5 else None)
