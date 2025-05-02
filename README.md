# Deno OBS Interface

A simple interface for controlling OBS (Open Broadcaster Software) using Deno.

## Features

- Connects to OBS WebSocket API
- Send commands and receive events
- Easy integration with Deno projects

## Requirements

- [Deno](https://deno.land/)
- OBS with [WebSocket plugin](https://github.com/obsproject/obs-websocket) enabled

## Usage

Create new instance of ObsConnection, which will automatically connect to the OBS WebSocket server.