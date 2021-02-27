## Runs audio capture and midi server
## TODO: Update to include all services. Users should be able to specificy which services to start, or leave at default to start all.

import os
import subprocess
import signal
import time
import sys

def run(seconds=3600, index=0, channels=2, selectedChannel=None):
  channel = '' if selectedChannel is None else selectedChannel
  tasks = ['midi_server.py','capture_audio.py {} {} {}'.format(seconds, index, channels,channel)]

  os.setpgrp()
  processes = []

  def clean_up():
      for p in processes:
        p.kill()

  processes = [
    subprocess.Popen(r'python3 '+ task, shell=True)
    for task in tasks
  ]
    
  signal.signal(signal.SIGINT, clean_up)

  time.sleep(seconds)
  clean_up()

if __name__ == "__main__":
    if len(sys.argv) == 1:
        run()
    else:
        run(
          int(sys.argv[1]), 
          int(sys.argv[2]),
          int(sys.argv[3]),
          int(sys.argv[4]) if len(sys.argv) == 5 else None
          )
