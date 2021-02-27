# Captures audio and sends audio levels to a midi server

import time
import pyaudio
import audioop
import sys
import requests
import numpy

HOST = '0.0.0.0'
PORT = '5002'

FORMAT                   = pyaudio.paInt16
RATE                     = 44100
CHUNK                    = 1024
MAX                      = 127
FACTOR                   = 4000
KEEP_AVG_FOR_ITTERATIONS = 10

def get_sound_level(channel):
    return audioop.rms(channel.tostring(),
     2)

def prevent_overflow(soundLevel):
    return min(127, soundLevel)

audio = pyaudio.PyAudio()

def capture_audio(
    seconds              = 3600,
    index                = 0,
    channelCount         = 2,
    selectedChannelIndex = None
    ):

    stream = audio.open(
        format             = FORMAT,
        channels           = channelCount, 
        rate               = RATE, 
        input              = True, 
        frames_per_buffer  = CHUNK, 
        input_device_index = index
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
        channel    = get_channel(i, data_array)
        soundLevel = normalize_sound_level(get_sound_level(channel))
        latest     = update_latest(i, soundLevel)
        maxLevel   = round(sum(latest)/len(latest)*2)
        velocity   = prevent_overflow(maxLevel)
        note       = 60 + i
        print(velocity)
        requests.post('http://{}:{}/'.format(HOST,PORT),
                    data={'note': note, 'velocity': velocity})

    for _ in range(0, int(RATE/CHUNK*seconds)):
        data       = stream.read(CHUNK, exception_on_overflow=False)
        data_array = numpy.fromstring(data, dtype='int16')

        if selectedChannelIndex is not None:
            send_midi_note(selectedChannelIndex,data_array)
        else:
            for i in range(0,channelCount ):
                send_midi_note(i, data_array)

        time.sleep(.1)

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
