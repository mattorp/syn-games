import sounddevice as sd
fs = 48000
sd.default.samplerate = fs
duration = 3  # seconds
# while True:
#     myrecording = sd.rec(int(duration * fs), samplerate=fs, device=6,
#                          channels=2, blocking=False)
#     sd.play(myrecording, blocking=True, device=4)


# sd.stop()
# duration = 2  # seconds


# * Make sure that Monitor is enabled in sound siphon
while True:

    def callback(indata, outdata, frames, time, status):
        if status:
            print(status)
        # print(frames)
        sd.play(indata, device=4, blocking=False)
        sd.sleep(int(duration * fs))
        indata[:] = outdata
    # sd.Stream(channels=2, callback=callback, device=6)
    with sd.Stream(channels=2, callback=callback, device=4):
        sd.sleep(int(duration * fs))
