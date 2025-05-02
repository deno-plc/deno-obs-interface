import { ObsConnection } from "../connection/connection.ts";
import { EventSubscriptions } from "../connection/event_subscriptions.ts";
import { RequestTypes } from "../connection/requests.ts";

const connection = await ObsConnection.initalize("localhost", 4455, Deno.env.get("OBS_PASSWORD"),
    EventSubscriptions.ALL
);

connection.addEventListener("CurrentProgramSceneChanged", (event) => {
    console.log(event.eventData);
});

connection.sendRequest(RequestTypes.GetVersion).then((response) => {
    console.log(response.requestType, response.requestId, response.responseData);
});