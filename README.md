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

```typescript
import { ObsConnection, EventSubscriptions, RequestTypes } from "jsr:@bewis09/obs-interface";

// EventSubscriptions.ALL is optional, since it is the default value
const connection = await ObsConnection.initalize("localhost", 4455, "password",
    EventSubscriptions.ALL
);

// If the EventType is set to undefined, it will listen to all events
connection.addEventListener("CurrentProgramSceneChanged", (event) => {
    console.log(event.eventData);
});

connection.sendRequest(RequestTypes.GetVersion).then((response) => {
    console.log(response.requestType, response.requestId, response.responseData);
});
```