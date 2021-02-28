from glob import iglob
from PIL import Image
import shutil
from subprocess import call

HOST = '127.0.0.1'
PORT='12345'
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

call(
    """node -e 'require("./btt.js").announceWinner([{},{}])' """.format(s0, s1), shell=True)

shutil.move(last_file, './snapshots/')

