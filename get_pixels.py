import os
from PIL import Image

HOST = '127.0.0.1'
PORT='12345'

im = Image.open('test.png')

black = 0
white = 0
other = 0
for pixel in im.getdata():
    if pixel == (0, 0, 0, 255):  # if your image is RGB (if RGBA, (0, 0, 0, 255) or so
        black += 1
    elif pixel ==( 255,255,255, 255):
        white += 1
    else:
        other += 1

s0 = str(round((black+white)/10000))
s1 = str(round(other/10000))
print(s0,s1)

os.system('open http://localhost:5500/overlay/index.html?'+s0+'-'+s1)

print('black=' + str(black)+', white='+str(white)+', other='+str(other))
