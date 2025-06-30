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

// deno-lint-ignore-file no-explicit-any
import { encodeBase64 } from "@std/encoding/base64";
import { EventSubscriptions } from "./event_subscriptions.ts";
import type { RequestTypes } from "./requests.ts";

type OBSMessage<T> = {
    op: number;
    d: T;
};

type HelloMessage = {
    obsStudioVersion: string;
    obsWebSocketVersion: string;
    rpcVersion: number;
    authentication?: {
        challenge: string;
        salt: string;
    };
};

type IdentifyMessage = {
    rpcVersion: number;
    authentication?: string;
    /** See {@link EventSubscriptions} for the values of this field */
    eventSubscriptions?: number;
};

type IdentifiedMessage = {
    negotiatedRpcVersion: number;
};

type ReidentifiedMessage = {
    /** See {@link EventSubscriptions} for the values of this field */
    eventSubscriptions: number;
};

type EventMessage = {
    eventType: string;
    eventIntent: number;
    eventData: any;
};

/**
 * The message that is sent to the OBS WebSocket server when a request is made.
 * requestId is a unique identifier for the request.
 * requestType is the type of request being made.
 * requestData contains the data to be sent with the request.
 */
export type RequestMessage = {
    requestId: string;
    requestType: RequestTypes | string;
    requestData?: object;
};

/**
 * The message that is sent back from the OBS WebSocket server when a request is made.
 * requestId is a unique identifier for the request.
 * requestStatus contains the result of the request.
 * responseData contains the data returned from the request.
 */
export type RequestResponseMessage = {
    requestType: RequestTypes | string;
    requestId: string;
    requestStatus: {
        result: boolean;
        code: number;
        comment?: string;
    };
    responseData?: any;
};

/**
 * The message that is sent to the OBS WebSocket server when a batch request is made.
 * requestId is a unique identifier for the request.
 * requests is an array of requests to be sent in the batch.
 * haltOnFailure indicates whether the batch should stop on the first failure.
 * executionType indicates how the requests should be executed.
 */
export type RequestBatchMessage = {
    requestId: string;
    requests: (Partial<RequestMessage> & Omit<RequestMessage, "requestId">)[];
    haltOnFailure?: boolean;
    executionType?: number;
};

/**
 * The message that is sent back from the OBS WebSocket server when a batch request is made.
 * requestId is a unique identifier for the request.
 * results is an array of results for each request in the batch.
 */
export type RequestBatchResponseMessage = {
    requestId: string;
    results: (
        & Partial<RequestResponseMessage>
        & Omit<RequestResponseMessage, "requestId">
    )[];
};

type OBSEventListener = {
    eventType: string | undefined;
    listener: (event: EventMessage) => void;
};

/**
 * A class that represents a connection to the OBS WebSocket API.
 * It handles the connection to the WebSocket server, authentication, and event subscriptions.
 * It also provides methods to send requests and receive responses from the server.
 */
export class ObsConnection {
    private socket: WebSocket | null = null;
    private connected: boolean = false;
    private identified: boolean = false;
    private identifiedPromise: Promise<void> | null = null;
    private identifiedPromiseResolve: (() => void) | null = null;
    private eventListeners: {
        eventType: string | undefined;
        listener: (event: EventMessage) => void;
    }[] = [];

    static async initalize(
        host?: string,
        port?: number,
        password?: string,
        eventSubscriptions: number = EventSubscriptions.ALL,
        autoRetry: boolean = true,
    ): Promise<ObsConnection> {
        const connection = new ObsConnection(
            host,
            port,
            password,
            eventSubscriptions,
            autoRetry,
        );

        await connection.connect();
        await connection.waitForInitialization();

        return connection;
    }

    private constructor(
        public host?: string,
        public port?: number,
        private password?: string,
        public eventSubscriptions: number = EventSubscriptions.ALL,
        public autoRetry: boolean = true,
    ) {}

    private connect() {
        if (!this.host || !this.port) {
            return Promise.resolve<void>(void 0);
        }

        const { promise, resolve, reject } = Promise.withResolvers<void>();

        if (this.socket) {
            this.socket.readyState === WebSocket.OPEN && this.socket.close();
        }

        this.socket = new WebSocket(`ws://${this.host}:${this.port}`);

        this.identifiedPromise = new Promise((resolve) => {
            this.identifiedPromiseResolve = resolve;
        });

        this.socket.addEventListener("open", () => {
            console.log("[OBS] Connected to OBS WebSocket");
            resolve();
            this.connected = true;
        });

        this.socket.addEventListener("close", (e) => {
            this.connected = false;
            this.identified = false;
            this.identifiedPromise = new Promise((resolve) => {
                this.identifiedPromiseResolve = resolve;
            });
            console.log("[OBS] Disconnected from OBS WebSocket: ", e.reason);

            if (!this.autoRetry) {
                reject(new Error("Could not connect to OBS WebSocket"));
                return;
            }

            setTimeout(() => {
                console.log("[OBS] Reconnecting...");
                this.connect().then(resolve).catch(reject);
            }, 1000);
        });

        this.socket.addEventListener("error", (error) => {
            console.error(
                "[OBS]",
                "message" in error ? error.message : "WebSocket error",
            );
        });

        this.socket.addEventListener("message", (event) => {
            const data = JSON.parse(event.data);
            this.parseData(data);
        });

        return promise;
    }

    isConnected(): boolean {
        return this.connected;
    }

    isIdentified(): boolean {
        return this.identified;
    }

    async waitForInitialization() {
        if (this.connected && this.identified) {
            return;
        }

        await this.identifiedPromise;

        return;
    }

    private send(message: OBSMessage<object>) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        } else {
            console.error("[OBS] WebSocket is not open. Cannot send message.");
        }
    }

    private async parseData(data: OBSMessage<object>) {
        switch (data.op) {
            case 0:
                await this.processHelloMessage(data.d as HelloMessage);
                break;
            case 2:
                this.processIdentifiedMessage(data.d as IdentifiedMessage);
                break;
            case 5:
                this.processEventMessage(data.d as EventMessage);
                break;
        }
    }

    private async processHelloMessage(data: HelloMessage) {
        const auth = this.password
            ? await this.generateAuthentication(data)
            : undefined;

        const identifyMessage: IdentifyMessage = {
            rpcVersion: data.rpcVersion,
            authentication: auth,
            eventSubscriptions: this.eventSubscriptions,
        };

        this.send({
            op: 1,
            d: identifyMessage,
        });
    }

    private processIdentifiedMessage(_: IdentifiedMessage) {
        this.identified = true;
        this.identifiedPromiseResolve?.();
        console.log("[OBS] Authenticated successfully");
    }

    private processEventMessage(data: EventMessage) {
        this.eventListeners.forEach((listener) => {
            if (
                listener.eventType === undefined ||
                listener.eventType === data.eventType
            ) {
                listener.listener(data);
            }
        });
    }

    private async generateAuthentication(data: HelloMessage) {
        const { challenge, salt } = data.authentication!;
        const conc = this.password + salt;
        const hash = await crypto.subtle.digest(
            "SHA-256",
            new TextEncoder().encode(conc),
        );
        const base64 = encodeBase64(new Uint8Array(hash));
        const conc2 = base64 + challenge;
        const hash2 = await crypto.subtle.digest(
            "SHA-256",
            new TextEncoder().encode(conc2),
        );
        const auth = encodeBase64(new Uint8Array(hash2));

        return auth;
    }

    public sendRequest(
        requestType: RequestTypes | string,
        requestData?: any,
    ): Promise<RequestResponseMessage> {
        return new Promise<RequestResponseMessage>((resolve, reject) => {
            if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
                reject(
                    new Error("WebSocket is not open. Cannot send request."),
                );
                return;
            }

            const requestId = crypto.randomUUID();

            const message: RequestMessage = {
                requestType,
                requestData,
                requestId,
            };

            this.socket!.send(JSON.stringify({
                op: 6,
                d: message,
            }));

            const handleResponse = (event: MessageEvent) => {
                const data = JSON.parse(event.data) as OBSMessage<
                    RequestResponseMessage
                >;

                if (data.d.requestId === requestId) {
                    this.socket!.removeEventListener("message", handleResponse);
                    resolve(data.d);
                }
            };

            this.socket.addEventListener("message", handleResponse);
        });
    }

    public sendBatchRequest(
        requests: (Omit<RequestMessage, "requestId">)[],
        haltOnFailure: boolean = false,
        executionType: number = 0,
    ): Promise<RequestBatchResponseMessage> {
        return new Promise<RequestBatchResponseMessage>((resolve, reject) => {
            if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
                reject(
                    new Error("WebSocket is not open. Cannot send request."),
                );
                return;
            }

            const requestId = crypto.randomUUID();

            const message: RequestBatchMessage = {
                requestId,
                requests,
                haltOnFailure,
                executionType,
            };

            this.socket!.send(JSON.stringify({
                op: 8,
                d: message,
            }));

            const handleResponse = (event: MessageEvent) => {
                const data = JSON.parse(event.data) as OBSMessage<
                    RequestBatchResponseMessage
                >;

                if (data.d.requestId === requestId) {
                    this.socket!.removeEventListener("message", handleResponse);
                    resolve(data.d);
                }
            };

            this.socket.addEventListener("message", handleResponse);
        });
    }

    public addEventListener(
        eventType: string | undefined,
        callback: (event: EventMessage) => void,
    ): OBSEventListener {
        const a = { eventType, listener: callback };

        this.eventListeners.push(a);

        return a;
    }

    public removeEventListener(listener: OBSEventListener) {
        const index = this.eventListeners.indexOf(listener);

        if (index !== -1) {
            this.eventListeners.splice(index, 1);
        }
    }

    public close() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
            this.connected = false;
            this.identified = false;
            this.identifiedPromise = null;
            this.identifiedPromiseResolve = null;
            this.host = undefined;
            this.port = undefined;
            this.eventListeners = [];
            this.password = undefined;
        }
    }

    public redirect(
        host: string,
        port: number,
        password?: string,
    ) {
        this.close();
        this.host = host;
        this.port = port;
        this.password = password;

        this.connect();
    }
}
