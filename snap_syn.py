import os
from time import sleep
from subprocess import call

SLEEP = 10

while True:
  os.system(
      'open btt://execute_assigned_actions_for_trigger/?uuid=BCB15335-F58B-4BE2-9C54-52877F654953')
  sleep(2)
  os.system(
      'python3 ./get_pixels.py')

  sleep(SLEEP)
