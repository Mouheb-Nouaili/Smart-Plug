#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>

const char* ssid = "wifi";
const char* password = "12345678";

const char* mqtt_server = "ea3a52e947bf4015b53b67059b4761c9.s1.eu.hivemq.cloud";
const int mqtt_port = 8883;
const char* mqtt_username = "username";
const char* mqtt_password = "********";

WiFiClientSecure espClient;
PubSubClient client(espClient);

const char root_ca[] PROGMEM =
"-----BEGIN CERTIFICATE-----\n"
"MIIFazCCA1OgAwIBAgIRAIIQz7DSQONZRGPgu2OCiwAwDQYJKoZIhvcNAQELBQAw\n"
"TzELMAkGA1UEBhMCVVMxKTAnBgNVBAoTIEludGVybmV0IFNlY3VyaXR5IFJlc2Vh\n"
"cmNoIEdyb3VwMRUwEwYDVQQDEwxJU1JHIFJvb3QgWDEwHhcNMTUwNjA0MTEwNDM4\n"
"WhcNMzUwNjA0MTEwNDM4WjBPMQswCQYDVQQGEwJVUzEpMCcGA1UEChMgSW50ZXJu\n"
"ZXQgU2VjdXJpdHkgUmVzZWFyY2ggR3JvdXAxFTATBgNVBAMTDElTUkcgUm9vdCBY\n"
"MTCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBAK3oJHP0FDfzm54rVygc\n"
"h77ct984kIxuPOZXoHj3dcKi/vVqbvYATyjb3miGbESTtrFj/RQSa78f0uoxmyF+\n"
"0TM8ukj13Xnfs7j/EvEhmkvBioZxaUpmZmyPfjxwv60pIgbz5MDmgK7iS4+3mX6U\n"
"A5/TR5d8mUgjU+g4rk8Kb4Mu0UlXjIB0ttov0DiNewNwIRt18jA8+o+u3dpjq+sW\n"
"T8KOEUt+zwvo/7V3LvSye0rgTBIlDHCNAymg4VMk7BPZ7hm/ELNKjD+Jo2FR3qyH\n"
"B5T0Y3HsLuJvW5iB4YlcNHlsdu87kGJ55tukmi8mxdAQ4Q7e2RCOFvu396j3x+UC\n"
"B5iPNgiV5+I3lg02dZ77DnKxHZu8A/lJBdiB3QW0KtZB6awBdpUKD9jf1b0SHzUv\n"
"KBds0pjBqAlkd25HN7rOrFleaJ1/ctaJxQZBKT5ZPt0m9STJEadao0xAH0ahmbWn\n"
"OlFuhjuefXKnEgV4We0+UXgVCwOPjdAvBbI+e0ocS3MFEvzG6uBQE3xDk3SzynTn\n"
"jh8BCNAw1FtxNrQHusEwMFxIt4I7mKZ9YIqioymCzLq9gwQbooMDQaHWBfEbwrbw\n"
"qHyGO0aoSCqI3Haadr8faqU9GY/rOPNk3sgrDQoo//fb4hVC1CLQJ13hef4Y53CI\n"
"rU7m2Ys6xt0nUW7/vGT1M0NPAgMBAAGjQjBAMA4GA1UdDwEB/wQEAwIBBjAPBgNV\n"
"HRMBAf8EBTADAQH/MB0GA1UdDgQWBBR5tFnme7bl5AFzgAiIyBpY9umbbjANBgkq\n"
"hkiG9w0BAQsFAAOCAgEAVR9YqbyyqFDQDLHYGmkgJykIrGF1XIpu+ILlaS/V9lZL\n"
"ubhzEFnTIZd+50xx+7LSYK05qAvqFyFWhfFQDlnrzuBZ6brJFe+GnY+EgPbk6ZGQ\n"
"3BebYhtF8GaV0nxvwuo77x/Py9auJ/GpsMiu/X1+mvoiBOv/2X/qkSsisRcOj/KK\n"
"NFtY2PwByVS5uCbMiogziUwthDyC3+6WVwW6LLv3xLfHTjuCvjHIInNzktHCgKQ5\n"
"ORAzI4JMPJ+GslWYHb4phowim57iaztXOoJwTdwJx4nLCgdNbOhdjsnvzqvHu7Ur\n"
"TkXWStAmzOVyyghqpZXjFaH3pO3JLF+l+/+sKAIuvtd7u+Nxe5AW0wdeRlN8NwdC\n"
"jNPElpzVmbUq4JUagEiuTDkHzsxHpFKVK7q4+63SM1N95R1NbdWhscdCb+ZAJzVc\n"
"oyi3B43njTOQ5yOf+1CceWxG1bQVs5ZufpsMljq4Ui0/1lvh+wjChP4kqKOJ2qxq\n"
"4RgqsahDYVvTH9w7jXbyLeiNdd8XM2w9U/t7y0Ff/9yi0GE44Za4rF2LN9d11TPA\n"
"mRGunUHBcnWEvgJBQl9nJEiU0Zsnvgc/ubhPgXRR4Xq37Z0j4r7g1SgEEzwxA57d\n"
"emyPxgcYxn/eR44/KJ4EBs+lVDR3veyJm+kXQ99b21/+jh5Xos1AnX5iItreGCc=\n"
"-----END CERTIFICATE-----\n";

const char* topic_current       = "smartplug/current";
const char* topic_voltage       = "smartplug/voltage";
const char* topic_power         = "smartplug/power";
const char* topic_energy        = "smartplug/energy";
const char* topic_cost          = "smartplug/cost";
const char* topic_relay_control = "smartplug/relay/control";
const char* topic_relay_status  = "smartplug/relay/status";
const char* topic_max_current   = "smartplug/settings/max_current";
const char* topic_max_voltage   = "smartplug/settings/max_voltage";
const char* topic_auto_mode     = "smartplug/settings/auto_mode";

#define SHUNT_ADC_PIN   4
#define VOLTAGE_ADC_PIN 5
#define RELAY_PIN       10

const float R2 = 2e6f;
const float R3 = 10e3f;
const float VOLTAGE_DIVIDER_RATIO = R3 / (R2 + R3);
const float ENERGY_COST_PER_KWH = 0.15f;

float energy_kWh = 0.0;
unsigned long last_time = 0;
unsigned long last_publish_time = 0;
const unsigned long PUBLISH_INTERVAL_MS = 2000;

// Defaults (can be overwritten by MQTT)
float max_current_threshold = 100.0f;  // Amps
float max_voltage_threshold = 300.0f;  // Volts
bool auto_mode_enabled = false;

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);

  Serial.print("Connecting to WiFi");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");

  espClient.setCACert(root_ca);
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(mqtt_callback);
  reconnect();

  last_time = millis();
  last_publish_time = millis();
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  unsigned long now = millis();
  if (now - last_publish_time >= PUBLISH_INTERVAL_MS) {
    float dt_hours = (now - last_time) / 3600000.0;
    float current = read_current();
    float voltage = read_voltage();
    float power = voltage * current;
    energy_kWh += power * dt_hours;
    float cost = energy_kWh * ENERGY_COST_PER_KWH;

    client.publish(topic_current, String(current, 2).c_str());
    client.publish(topic_voltage, String(voltage, 2).c_str());
    client.publish(topic_power,   String(power, 2).c_str());
    client.publish(topic_energy,  String(energy_kWh, 4).c_str());
    client.publish(topic_cost,    String(cost, 4).c_str());

    // Automation logic
    if (auto_mode_enabled) {
      if (current > max_current_threshold || voltage > max_voltage_threshold) {
        digitalWrite(RELAY_PIN, LOW);
        client.publish(topic_relay_status, "OFF");
        Serial.println("Auto turned OFF relay due to threshold");
      }
    }

    last_time = now;
    last_publish_time = now;
  }
}

float read_current() {
  const int NUM_SAMPLES = 50;
  const float ADC_REF_VOLTAGE = 3.3f;
  const float SHUNT_RESISTANCE = 0.025f; 
  const float AMPLIFIER_GAIN = 20.0f;    

  float sumCurrent = 0;

  for (int i = 0; i < NUM_SAMPLES; i++) {
    int adc = analogRead(SHUNT_ADC_PIN);
    float voltage = (adc / 4095.0f) * ADC_REF_VOLTAGE;

   
    float current = voltage / (AMPLIFIER_GAIN * SHUNT_RESISTANCE);
    sumCurrent += current;

    delay(5);
  }

  float avgCurrent = sumCurrent / NUM_SAMPLES;
  return avgCurrent;
}

float read_voltage() {
  const int NUM_SAMPLES = 100;
  int max_adc = 0;
  for (int i = 0; i < NUM_SAMPLES; i++) {
    int adc_val = analogRead(VOLTAGE_ADC_PIN);
    if (adc_val > max_adc) max_adc = adc_val;
    delay(1); 
  }
  float divided_voltage = (max_adc / 4095.0f) * 3.3f;
  float ac_peak_voltage = divided_voltage / VOLTAGE_DIVIDER_RATIO;
  float ac_rms_voltage = ac_peak_voltage * 0.707f;
  return ac_rms_voltage;
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("ESP32SmartPlug", mqtt_username, mqtt_password)) {
      Serial.println("connected");
      client.subscribe(topic_relay_control);
      client.subscribe(topic_max_current);
      client.subscribe(topic_max_voltage);
      client.subscribe(topic_auto_mode);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void mqtt_callback(char* topic, byte* payload, unsigned int length) {
  String message;
  for (unsigned int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  message.trim();

  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("]: ");
  Serial.println(message);

  if (String(topic) == topic_relay_control) {
    if (message.equalsIgnoreCase("ON")) {
      digitalWrite(RELAY_PIN, HIGH);
      client.publish(topic_relay_status, "ON");
    } else if (message.equalsIgnoreCase("OFF")) {
      digitalWrite(RELAY_PIN, LOW);
      client.publish(topic_relay_status, "OFF");
    }
  }

  else if (String(topic) == topic_max_current) {
    max_current_threshold = message.toFloat();
    Serial.print("Updated max current threshold: ");
    Serial.println(max_current_threshold);
  }

  else if (String(topic) == topic_max_voltage) {
    max_voltage_threshold = message.toFloat();
    Serial.print("Updated max voltage threshold: ");
    Serial.println(max_voltage_threshold);
  }

  else if (String(topic) == topic_auto_mode) {
    if (message.equalsIgnoreCase("ON")) {
      auto_mode_enabled = true;
    } else if (message.equalsIgnoreCase("OFF")) {
      auto_mode_enabled = false;
    }
    Serial.print("Auto mode: ");
    Serial.println(auto_mode_enabled ? "ENABLED" : "DISABLED");
  }
}

