import _ from "lodash";
import { createContext, useEffect, useState } from "react";
import mqtt from "mqtt";
import Constants from "../utils/Constants";

const MQTTProviderContext = createContext({});

export const MQTTProvider = ({ children }) => {
  const [client, setClient] = useState(null);
  const [state, setState] = useState({
    isConnected: false,
    isSubscribed: false,
    isReconnecting: false,
  });
  const [requireUpdate, setRequireUpdate] = useState([]);

  const publishMessage = (topic, message) => {
    console.log("publishMessage", topic, message);
    if (!client) return;

    if (!(typeof topic === "string") && _.isEmpty(message)) return;

    client.publish(topic, message);
  };

  const mqttSub = (subscription) => {
    if (client) {
      const { topic, qos } = subscription;

      client.subscribe(topic, { qos }, (error) => {
        if (error) {
          setState({ ...state, isSubscribed: false });
          return;
        }
        setState({ ...state, isSubscribed: true });
      });
    }
  };

  useEffect(() => {
    if (client) return;

    const initialConnectionOptions = {
      protocol: "ws",
      host: Constants.MQTT.URL,
      clientId:
        Constants.MQTT.CLIENT_ID + Math.random().toString(16).substring(2, 8),
      port: Constants.MQTT.PORT,
      username: Constants.MQTT.USERNAME,
      password: Constants.MQTT.PASSWORD,
    };
    const { protocol, host, clientId, port, username, password } =
      initialConnectionOptions;
    const url = `${protocol}://${host}:${port}/mqtt`;
    const options = {
      clientId,
      username,
      password,
      clean: true,
      reconnectPeriod: 1000, // ms
      connectTimeout: 30 * 1000, // ms
    };
    setTimeout(() => {
      setClient(mqtt.connect(url, options));
    }, 300);
  }, [client]);

  useEffect(() => {
    if (client && !state.isConnected) {
      client.on("connect", () => {
        setState({ ...state, isConnected: true });
      });

      client.on("reconnect", () => {
        setState({ ...state, isReconnecting: true });
      });

      client.on("error", (err) => {
        client.end();
      });
    }
  }, [client, state]);

  useEffect(() => {
    if (state.isConnected) {
      mqttSub({ topic: "trello/update", qos: 0 });
    }
  }, [state.isConnected]);

  useEffect(() => {
    if (state.isConnected && state.isSubscribed) {
      client.on("message", (topic, message) => {
        try {
          const payload = {
            topic,
            message: JSON.parse(message.toString()),
          };

          setRequireUpdate(payload.message);
        } catch (error) {
          console.error("Error parsing message", error);
        }
      });
    }
  }, [state, client]);

  return (
    <MQTTProviderContext.Provider
      value={{
        client,
        setClient,
        state,
        setState,
        requireUpdate,
        setRequireUpdate,
        publishMessage,
        mqttSub,
      }}
    >
      {children}
    </MQTTProviderContext.Provider>
  );
};

export default MQTTProviderContext;
