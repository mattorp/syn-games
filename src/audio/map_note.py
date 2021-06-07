from requests import post
from sys import argv
from dotenv import load_dotenv
from os import getenv
load_dotenv()


def map_node(note):
    print(note)
    post('http://{}:{}'.format(
        getenv('MIDI_SERVER_HOST'),
        getenv('MIDI_SERVER_PORT')
    ), data={'note': note, 'velocity': 90})


if __name__ == '__main__':
    map_node(argv[1])
