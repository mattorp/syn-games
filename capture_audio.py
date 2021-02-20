import time
import pyaudio
import audioop
import sys
import numpy
import requests

FORMAT = pyaudio.paInt16
RATE = 44100
CHUNK = 1024
MAX = 127
FACTOR = 10000

audio = pyaudio.PyAudio()

def capture_audio(seconds = 3600, index = 0, channels = 2, selectedChannel = None):
    stream = audio.open(format=FORMAT, channels=channels, rate=RATE,
                        input=True, frames_per_buffer=CHUNK, input_device_index=index)

    def postResult(i, data_array):
        channel = data_array[i::channels]
        note = 60 + i
        rms = audioop.rms(channel.tostring(), 2)
        velocity = round(rms/FACTOR*MAX)
        print(rms)
        print(velocity)
        requests.post("http://127.0.0.1:5000/",
                    data={'note': note, 'velocity': velocity})

    for _ in range(0, int(RATE/CHUNK*seconds)):
        data = stream.read(CHUNK, exception_on_overflow=False)
        data_array = numpy.fromstring(data, dtype='int16')

        if selectedChannel is not None:
            postResult(selectedChannel,data_array)
        else:
            for i in range(0,channels - 1):
                postResult(i, data_array)

        time.sleep(.1)

    stream.stop_stream()
    stream.close()
    audio.terminate()

if __name__ == "__main__":
    if len(sys.argv) == 1:
        capture_audio()
    else:
        capture_audio(int(sys.argv[1]), int(sys.argv[2]),
           int(sys.argv[3]), int(sys.argv[4]) if len(sys.argv) == 5 else None)
