from __future__ import print_function
import pixy 
from ctypes import *
from pixy import *
import requests
from time import sleep

HOST = '192.168.0.104'
PORT = '5002'

pixy.init ()
pixy.change_prog ('color_connected_components');

class Blocks (Structure):
  _fields_ = [ ('m_signature', c_uint),
    ('m_x', c_uint),
    ('m_y', c_uint),
    ('m_width', c_uint),
    ('m_height', c_uint),
    ('m_angle', c_uint),
    ('m_index', c_uint),
    ('m_age', c_uint) ]

blocks = BlockArray(100)
frame = 0

BASE = 100
X = 0
Y = 1
SIZE = 2

NOTE_COUNT = 3

max_found = 0

def get_note(offset, index):
  return offset + BASE + index * NOTE_COUNT

def get_size(width, height):
  return max(width,height)

while 1:
  count = pixy.ccc_get_blocks (100, blocks)
  max_found = max(max_found, count)

  # Set size to zero, to zoom out unfound objects. 
  # for i in range(0, max_found):
  #    requests.post('http://{}:{}/'.format(HOST, PORT),
  #                  data={'note': get_note(SIZE, i), 'velocity': 0})

  if count > 0:
    frame = frame + 1
    for i in range (0, count):
      block = blocks[i]
      x = round(block.m_x/2.45)
      y = round(block.m_y/1.66)
      size = round(get_size(block.m_width, block.m_height)/3)
      print(get_note(X, i), x, y, size)
      sleep(.017) 

      requests.post('http://{}:{}/'.format(HOST, PORT),
                    data={'note': get_note(X, i), 'velocity': x})
      requests.post('http://{}:{}/'.format(HOST, PORT),
                    data={'note': get_note(Y, i), 'velocity': y})
      requests.post('http://{}:{}/'.format(HOST, PORT),
                    data={'note': get_note(SIZE, i), 'velocity': size})
