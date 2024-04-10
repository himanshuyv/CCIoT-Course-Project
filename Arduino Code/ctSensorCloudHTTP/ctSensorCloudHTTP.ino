#include <Arduino.h>
#include <WiFiNINA.h>

#define WIFI_SSID "RedmiK"         // your network SSID (name)
#define WIFI_PASSWORD "password" // your network password
#define API_KEY "FTGTZGBX4UP90L6Z"  // Your ThingSpeak API Key
const char* server = "api.thingspeak.com"; // ThingSpeak server

WiFiClient client;

// Define the pins connected to the outputs of the current transformer sensors
const int currentSensorPin1 = A1;
const int currentSensorPin2 = A2;

void setup() {
  Serial.begin(9600);
  delay(1000);
  Serial.println();

  connectToWiFi();
}

void loop() {
  float current1 = readCurrent(currentSensorPin1);
  float current2 = readCurrent(currentSensorPin2);
  Serial.println(current1);
  Serial.println(current2);
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
  for(int i=0;i<1000;i++)
  {
    sensorvalue=analogRead(sensorPin);
    sensorvalue=sensorvalue*5/1023;
    rms=rms+sensorvalue*sensorvalue;
    delay(1);

  }
  rms = 2*rms; 
  rms=rms/1000;
  rms=sqrt(rms);
  rms=rms/0.06667;
  return rms;
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

  if (mqttClient.publish(topic2.c_str(), dataString2.c_str())) {
    Serial.println("Current 2 published successfully");
  } else {
    Serial.println("Failed to publish Current 2");
  }
}

