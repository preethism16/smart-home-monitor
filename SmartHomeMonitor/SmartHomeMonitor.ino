#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

const char* ssid = "sam";
const char* password = "12345678";
const char* mqtt_server = "192.168.56.1";

#define DHT_PIN 15 // GPIO pin where the DHT sensor is connected
#define DHT_TYPE DHT22 // DHT sensor type (DHT11, DHT22, AM2302)

DHT dht(DHT_PIN, DHT_TYPE);

WiFiClient espClient;
PubSubClient client(espClient);

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("ESP32Client")) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  dht.begin();
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // Read temperature and humidity from sensor
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  // Check if any reads failed and exit early (to try again).
  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  // Publish temperature and humidity to MQTT topics
  String temperatureTopic = "home/sensors/" + String(WiFi.macAddress()) + "/temperature";
  String humidityTopic = "home/sensors/" + String(WiFi.macAddress()) + "/humidity";
  client.publish(temperatureTopic.c_str(), String(temperature).c_str());
  client.publish(humidityTopic.c_str(), String(humidity).c_str());

  delay(5000); // Wait for 5 seconds before publishing again
}
