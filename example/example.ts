/**
 * @license GPL-3.0-or-later
 * Deno OBS Interface
 *
 * Copyright (C) 2025 Felix Beckh
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

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