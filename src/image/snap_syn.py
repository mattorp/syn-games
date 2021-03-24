import os
from time import sleep
from dotenv import load_dotenv
from os import getenv
load_dotenv()

SLEEP = 10

while True:
  # TODO: change to exceute action
  os.system(
      'open {}'.format(getenv('BTT_SNAP_SYN')))
  sleep(2)
  os.system(
      'python3 ./get_pixels.py')

  sleep(SLEEP)
