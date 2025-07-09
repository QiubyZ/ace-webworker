declare namespace cordova {
    interface WebSocketPlugin {
        /**
         * Connects to a WebSocket server
         * @param url The WebSocket server URL
         * @param protocols (Optional) An array of subprotocol strings
         * @param headers (Optional) Custom headers as key-value pairs
         * @returns A Promise that resolves to a WebSocketInstance
         */
        connect(
            url: string,
            protocols?: string[],
            headers?: Record<string, string>
        ): Promise<WebSocketInstance>;

        /**
         * Lists all stored webSocket instance IDs
         * @returns Promise that resolves to an array of instanceId strings
         */
        listClients(): Promise<string[]>;

        /**
         * Sends a message (same as WebSocketInstance.send but needs instanceId)
         * @param instanceId The WebSocket instance ID
         * @param message The message to send
         * @returns Promise that resolves when sent
         */
        send(instanceId: string, message: string): Promise<void>;

        /**
         * Closes the connection (same as WebSocketInstance.close but needs instanceId)
         * @param instanceId The WebSocket instance ID
         * @param code (Optional) Close code
         * @param reason (Optional) Close reason
         * @returns Promise that resolves when closed
         */
        close(instanceId: string, code?: number, reason?: string): Promise<void>;
    }

    interface WebSocketInstance {
        /**
         * Sends a message to the server
         * @param message The message to send
         * @throws An error if the connection is not open
         */
        send(message: string): void;

        /**
         * Closes the connection
         * @param code (Optional) Close code (default: 1000 for normal closure)
         * @param reason (Optional) Close reason (max 123 UTF-8 bytes)
         */
        close(code?: number, reason?: string): void;

        /** Event listener for connection open */
        onopen: (event: WebSocketEvent) => void;

        /** Event listener for messages received */
        onmessage: (event: WebSocketMessageEvent) => void;

        /** Event listener for connection close */
        onclose: (event: WebSocketEvent) => void;

        /** Event listener for errors */
        onerror: (event: WebSocketEvent) => void;

        /** The state of the connection */
        readonly readyState: WebSocketReadyState;

        /** Extensions negotiated by the server */
        readonly extensions: string;
    }

    interface WebSocketEvent {
        /** The WebSocket instance */
        target: WebSocketInstance;
        /** Additional event data */
        [key: string]: any;
    }

    interface WebSocketMessageEvent extends WebSocketEvent {
        /** The received message data */
        data: string;
    }

    /** WebSocket connection state values */
    const enum WebSocketReadyState {
        CONNECTING = 0,
        OPEN = 1,
        CLOSING = 2,
        CLOSED = 3
    }

    const websocket: WebSocketPlugin;
}