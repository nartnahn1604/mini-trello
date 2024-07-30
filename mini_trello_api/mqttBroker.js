const mqttConfig = {
  URL: "127.0.0.1",
  PORT: "1884",
  USERNAME: "",
  PASSWORD: "",
  CLIENT_ID: "trello",
};

const mqtt = require("mqtt");

const client = mqtt.connect(`ws://${mqttConfig.URL}:${mqttConfig.PORT}/mqtt`, {
  clientId: mqttConfig.CLIENT_ID,
});

var connectionStatus = "disconnected";

client.on("connect", () => {
  console.log("Connected to MQTT broker");
  connectionStatus = "connected";
});

client.on("reconnect", () => {
  console.log("Reconnecting to MQTT broker");
  connectionStatus = "reconnecting";
});

client.on("error", (err) => {
  console.log(err);
  connectionStatus = "error";
});

function publishMessage(topic, message) {
  console.log("Publishing message to MQTT broker");
  client.publish(topic, JSON.stringify(message));
}

module.exports = {
  publishMessage,
  connectionStatus,
};
