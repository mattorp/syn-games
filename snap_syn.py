import os
from time import sleep

SLEEP = 10

while True:
  # TODO: change to exceute action
  os.system(
      'open btt://execute_assigned_actions_for_trigger/?uuid=12D19A27-4D74-4D7F-91BA-49B57B977828')
  sleep(2)
  os.system(
      'python3 ./get_pixels.py')

  sleep(SLEEP)
