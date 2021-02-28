from requests import post
from sys import argv

HOST = 'localhost'
PORT = '5002'

def map_node(note):
  post('http://{}:{}'.format(HOST,PORT),data={'note': note,'velocity': 90})

if __name__ == '__main__':
  map_node(argv[1])
