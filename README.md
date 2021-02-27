# Synesthesia Games

A suite of tools that allow various interactions with Synethesia with the goal of creating new types of games: Sports, board games, language learning, song/music lessons, etc.

__NOTE:__ The project is still in very early stage, and is not documented well yet. Do only try using this now if you don't mind working out most problems yourself, and find documentation elsewhere. 

## Setup

For sound: Connect multiple microphones to the computer. You can use usb to jack converters for this.

### Terminal microphone access

Trigger prompt:

```bash
brew install sox
sox -d -d
```

#### VSCode microphone access

Start VSCode from the terminal:

```bash
code
```

For the default input and options use. 
```
python3 syn_server.py
```

You can adjust the settings using
```
python3 syn_server.py seconds=3600 index=7 channelCount=3 selectedChannelIndex=0
```

selectedChannelIndex is optional, if not provided it uses all channel inputs.

### Synesthesia
Install and open Synesthesia from https://www.synesthesia.live

### MIDI
Go to MIDI settings -> Devices in Synesthesia and refresh.

For mapping use the selectedChannelIndex parameter as shown above. This lets you map individual channels/microphones to each MIDI mapping.

### Video
[DRAFT]('./Video_README_DRAFT.md')

#### When video is set up

In host

```bash
cd ~/github/syn-games
python3 midi_server.py
```

Start Synesthesia, and map notes to controls. Notes are indexed as 100 + offset * object_index + notes_per_object 

offset example: x = 0, y = 1, size = 2

Then notes_per_object is 3

Map the notes. For two objects with three notes, do so for 100-105
```
python3 map_note.py [note]
```

Then start the Pixy VM
```
vboxmanage startvm pixy --type headless
sudo ssh pixy@127.0.0.1 -p 2222
```

(re)connect the physical usb to Pixy.

In the VM (ssh)
```
cd ~/pixy2/build/midi
sudo python3 pixy_to_midi.py
```

## Usage
Provide sounds for each microphone to trigger the MIDI notes.

# Examples

Examples of usage: 
- Track sound at various points
  - Position microphones
    - around a table. As players drum on the table, various parameters are changed in Synesthesia. Present synethesia on a screen or projected on to the table.
    - in the corners of a squash court and project the image(s) onto the wall(s), floor and/or ceiling. Now moving around the court has an impact on the game as well

- Detect impact point
  - Use a camera for object tracking, e.g. a Pixy cam. Map the imapct to x/y properties in synesthesia. And the distance to the wall as size. 

- Use midi controller, e.g AKAI MPD218, ribn (iOS/ipadOS)

- Draw the background. E.g. by recording a physical paper or other drawing surfaces. Or by routing Concepts(.app) into Synesthesia -- for this use:
  - AirServer (mac)
  - Concepts w. pencil (ipadOS)
  - Syphon Recorder (mac)

## Videos
These are placeholder. New ones will replcae them soon

https://youtu.be/KRB6ZPVpBxg

https://youtu.be/1zvDIPuOZ5A

https://youtu.be/R23TcANc-0w
