#include <Arduino.h>
#include <WiFiNINA.h>
#include <PubSubClient.h>

#define WIFI_SSID "RedmiK"
#define WIFI_PASSWORD "password"
#define MQTT_SERVER "mqtt3.thingspeak.com"
#define MQTT_PORT 1883
#define MQTT_USERNAME "Bxs3PSghAxEbLhMwHSY0PAk"
#define MQTT_PASSWORD "XyaQ1hPh3fwTJtgzAlR5V3Se"
#define MQTT_CLIENT_ID "Bxs3PSghAxEbLhMwHSY0PAk"
#define CHANNEL_ID "2488210"
#define API_KEY "FTGTZGBX4UP90L6Z"

const int currentSensorPin1 = A1;
const int currentSensorPin2 = A2;

WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);

void setup() {
  Serial.begin(9600);
  delay(1000);
  Serial.println();

  connectToWiFi();
  mqttClient.setServer(MQTT_SERVER, MQTT_PORT);
}

void loop() {
  if (!mqttClient.connected()) {
    reconnect();
  }

  float current1 = readCurrent(currentSensorPin1);
  float current2 = readCurrent(currentSensorPin2);
  Serial.print("Current1: ");
  Serial.print(current1);
  Serial.println(" A");
  Serial.print("Current2: ");
  Serial.print(current2);
  Serial.println(" A");
  sendToThingSpeak(current1, current2);
  delay(2000);
}

void connectToWiFi() {
  Serial.print("Connecting to WiFi...");
  while (WiFi.begin(WIFI_SSID, WIFI_PASSWORD) != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("Connected to WiFi");
}

float readCurrent(int sensorPin) {
  float rms=0;
  float sensorvalue;
  for(int i=0;i<500;i++)
  {
    sensorvalue=analogRead(sensorPin);
    sensorvalue=sensorvalue*5/1023;
    rms=rms+sensorvalue*sensorvalue;
    delay(1);
  }
  rms = 2*rms; 
  rms=rms/500;
  rms=sqrt(rms);
  rms=rms/0.06667;
  return rms;
}

void reconnect() {
  while (!mqttClient.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (mqttClient.connect(MQTT_CLIENT_ID, MQTT_USERNAME, MQTT_PASSWORD)) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.println(mqttClient.state());
      if (mqttClient.state()==-2){
        connectToWiFi();
      }else{
        Serial.println("try again in 5 seconds");
        delay(5000);
      }
    }
  }
}

void sendToThingSpeak(float current1, float current2) {
  String dataString1 = String(current1);
  String dataString2 = String(current2);
  String topic1 = "channels/" + String(CHANNEL_ID) + "/publish/fields/field1";
  String topic2 = "channels/" + String(CHANNEL_ID) + "/publish/fields/field2";

  if (mqttClient.publish(topic1.c_str(), dataString1.c_str())) {
    Serial.println("Current 1 published successfully");
  } else {
    Serial.println("Failed to publish Current 1");
  }
  delay(2000);
  if (mqttClient.publish(topic2.c_str(), dataString2.c_str())) {
    Serial.println("Current 2 published successfully");
  } else {
    Serial.println("Failed to publish Current 2");
  }
}

