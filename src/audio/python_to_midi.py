import capture_audio
import sys
sys.path.append('./capture_audio.py')


def python_to_midi():
    def normalize_sound_level(soundLevel):
        return round(soundLevel/FACTOR*MAX)

    def get_channel(i, data_array):
        return data_array[i::channelCount]

    def send_midi_note(i, data_array):
        channel = get_channel(i, data_array)
        soundLevel = normalize_sound_level(get_sound_level(channel))
        latest = update_latest(i, soundLevel)
        maxLevel = round(sum(latest)/len(latest)*2)
        velocity = prevent_overflow(maxLevel)
        note = 60 + i
        print(velocity)
        requests.post('http://{HOST}:{PORT}/'.format(
            HOST=getenv('MIDI_SERVER_HOST'),
            PORT=getenv('MIDI_SERVER_PORT'),
        ),
            data={'note': note, 'velocity': velocity})

    for _ in range(0, int(RATE/CHUNK*seconds)):
        data = stream.read(CHUNK, exception_on_overflow=False)
        data_array = numpy.fromstring(data, dtype='int16')

        if selectedChannelIndex is not None:
            send_midi_note(selectedChannelIndex, data_array)
        else:
            for i in range(0, channelCount):
                send_midi_note(i, data_array)

        time.sleep(.1)
