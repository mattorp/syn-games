import os
from dotenv import load_dotenv
from os import getenv
load_dotenv()

os.system('http-server -p {PORT} -a {HOST} -o {PATH}'.format(
  HOST=getenv('OVERLAY_SERVER_HOST'),
  PORT=getenv('OVERLAY_SERVER_PORT'),
  PATH=getenv('OVERLAY_SERVER_PATH')
  ))
