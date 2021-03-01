# Synesthesia Games

A suite of tools that allow various interactions with Synethesia with the goal of creating new types of games: Sports, board games, language learning, song/music lessons, etc.

With these tools, you can map sound at different locations (if using multiple microphones), track movement of objects/players, draw the gameboard in realtime, etc. All to provide a dynamic experience, that can easily change between sessions. 

A primary goal is to let everyone quickly design new games. The user experience is abysmal for now however, but it should improve rapidly.

__NOTE:__ The project is still in very early stage, and is not documented well yet. Do only try to use this now if you don't mind working out most problems yourself, and find documentation elsewhere. 

## Environment variables

.env should contain -- values are examples:
```
MIDI_SERVER_HOST=192.168.0.104
MIDI_SERVER_PORT=5002
BTT_SERVER_HOST=127.0.0.1
BTT_SERVER_PORT=56556
BTT_SNAP_SYN='btt://execute_assigned_actions_for_trigger/?uuid=12D19A27-4D74-4D7F-91BA-49B57B977828'
OVERLAY_SERVER_HOST=192.168.0.104
OVERLAY_SERVER_PORT=5010
OVERLAY_SERVER_PATH=overlay
```

## Synesthesia
Install and open Synesthesia from https://www.synesthesia.live

### MIDI

Start the midi server in one terminal
```
python3 midi_server.py
```

Go to MIDI settings -> Devices in Synesthesia and refresh.

For mapping use the following, which sends a single specified note to Synesthesia. Click MIDI in the top right corner, select the control and run the script below for each control.

In another terminal
```
python3 map_note.py [note]
```

## Sound

Connect one or multiple microphones to the computer. You can use usb to jack converters for this.

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

```
python3 capture_audio.py
```

You can adjust the settings using
```
python3 capture_audio.py seconds=3600 index=7 channelCount=3 selectedChannelIndex=0
```

selectedChannelIndex is optional, if not provided it uses all channel inputs.



## Video
[DRAFT]('./Video_README_DRAFT.md')

### When video is set up

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
```2

### Bugs

If the position in synesthesia is not updated:
- Try to restart Synesthesia
- Make sure that the correct variables are used in the .glsl file

If pixy_to_midi returns nothing, and no errors:
- Make sure that the cam registers objects

## Track score

For BTT python scripts add this to environment variables under exectute shell script

```
PYTHONPATH=/Library/Frameworks/Python.Framework/Versions/3.9/lib/Python3.9/site-packages
```

### Show score

Use snap_syn.py -- which currently counts the white+black (player 1) pixels and compares them with all other colors (player 2). In this game mode, the players fight to clear or fill the screen with color. This is just one of many ways to get the score from a game.

#### Using btt

[BetterTouchTool](https://folivora.ai)

Note that this can be unstable! But it allows some nice functionality.
see [btt.js](btt.js) 

## Examples

Examples of usage: 
- Track sound at various points
  - Position microphones
    - around a table. As players drum on the table, various parameters are changed in Synesthesia. Present synethesia on a screen or projected on to the table.
    - in the corners of a squash court and project the image(s) onto the wall(s), floor and/or ceiling. Now moving around the court has an impact on the game as well

- Detect impact point / object movement
  - Use a camera for object tracking, e.g. a Pixy cam. Map the imapct to x/y properties in synesthesia. And the distance to the wall as size. 

- Use midi controller, e.g AKAI MPD218, ribn (iOS/ipadOS)

- Draw the background. E.g. by recording a physical paper or other drawing surfaces. Or by routing Concepts(.app) into Synesthesia -- for this use:
  - AirServer (mac)
  - Concepts w. pencil (ipadOS)
  - Syphon Recorder (mac)

### Videos

[Object tracking](https://youtu.be/KRB6ZPVpBxg)
