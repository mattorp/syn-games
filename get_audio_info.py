from pyaudio import PyAudio

def get_audio_info():
    audio = PyAudio()
    info = audio.get_host_api_info_by_index(0)
    print(info, '\n')
    for i in range(audio.get_device_count()):
        print(audio.get_device_info_by_index(i))

if __name__ =='__main__':
  get_audio_info()
