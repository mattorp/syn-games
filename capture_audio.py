import time
import pyaudio
import audioop
import sys
import requests
import numpy

FORMAT = pyaudio.paInt16
RATE = 44100
CHUNK = 1024
MAX = 127
FACTOR = 2000

audio = pyaudio.PyAudio()

def capture_audio(seconds = 3600, index = 0, channels = 2, selectedChannel = None):
    stream = audio.open(format=FORMAT, channels=channels, rate=RATE,
                        input=True, frames_per_buffer=CHUNK, input_device_index=index)

    latestRms = []
    for i in range(0,3):
        latestRms.append(list(range(0, 20)))

    def postResult(i, data_array):
        channel = data_array[i::channels]
        note = 60 + i
        rms = audioop.rms(channel.tostring(), 2)
        lRms = latestRms[i]
        lRms.pop(0)
        lRms.append(rms)
        velocity = min(127,round(max(lRms)/FACTOR*MAX))
        print(velocity)
        requests.post("http://127.0.0.1:5000/",
                    data={'note': note, 'velocity': velocity})
    

    for _ in range(0, int(RATE/CHUNK*seconds)):
        data = stream.read(CHUNK, exception_on_overflow=False)
        data_array = numpy.fromstring(data, dtype='int16')

        if selectedChannel is not None:
            postResult(selectedChannel,data_array)
        else:
            for i in range(0,channels ):
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
