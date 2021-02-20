# Synesthesia Games

A suite of tools that allow various interactions with Synethesia with the goal of creating new types of sport games.

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

## Usage
Provide sounds for each microphone to trigger the MIDI notes.

# Examples

Examples of usage: 
- Position microphones
  - around a table. As players drum on the table, various parameters are changed in Synesthesia. Present synethesia on a screen or projected on to the table.
  - in the corners of a squash court and project the image(s) onto the wall(s), floor and/or ceiling. Now moving around the court has an impact on the game as well

- Detect impact point (not yet implemented)
  - Use a camera for object tracking, e.g. a Pixy cam. Map the imapct to x/y properties in synesthesia.

This extends to various sports and games. 

## Videos
These are placeholder. New ones will replcae them soon

https://youtu.be/1zvDIPuOZ5A

https://youtu.be/R23TcANc-0w
