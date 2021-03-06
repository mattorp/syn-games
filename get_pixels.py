from glob import iglob
from PIL import Image
import shutil
import os
from dotenv import load_dotenv
from os import getenv
load_dotenv()

# HOST = '127.0.0.1'
# PORT='12345'
ROOT_DIR = '~/Movies/syphon-recordings'

last_file, *_ = iglob('./latest-snapshot/*.png', recursive=True)
print(last_file)

im = Image.open(last_file)

black = 0
white = 0
other = 0
for pixel in im.getdata():
    if pixel == (0, 0, 0, 255):
        black += 1
    elif pixel ==( 255,255,255, 255):
        white += 1
    else:
        other += 1

s0 = str(round((black+white)/10000))
s1 = str(round(other/10000))
print(s0,s1)

os.system("open 'http://{HOST}:{PORT}/{PATH}?{s0}-{s1}'".format(
    HOST=getenv('OVERLAY_SERVER_HOST'),
    PORT=getenv('OVERLAY_SERVER_PORT'),
    PATH=getenv('OVERLAY_SERVER_PATH'),
    s0=s0,
    s1=s1))

# !Calling btt is very unstable atm
# os.system(
#     """node -e 'require("./btt.js").announceWinner([{},{}])' """.format(s0, s1), shell=True)


shutil.move(last_file, './snapshots/')

