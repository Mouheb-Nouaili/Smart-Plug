import { useEffect, useState, useCallback } from 'react';
import mqtt, { MqttClient } from 'mqtt';

interface MQTTConfig {
  brokerUrl: string;
  username?: string;
  password?: string;
}

interface MQTTHookReturn {
  client: MqttClient | null;
  isConnected: boolean;
  error: string | null;
  publish: (topic: string, message: string) => void;
  subscribe: (topic: string, callback: (message: string) => void) => void;
  connect: (config: MQTTConfig) => void;
  disconnect: () => void;
}

export const useMQTT = (): MQTTHookReturn => {
  const [client, setClient] = useState<MqttClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscriptions, setSubscriptions] = useState<Map<string, (message: string) => void>>(new Map());

  const connect = useCallback((config: MQTTConfig) => {
    try {
      console.log('Connecting to MQTT broker at', config.brokerUrl);

      const mqttClient = mqtt.connect(config.brokerUrl, {
        username: config.username,
        password: config.password,
        reconnectPeriod: 5000,
      });
      
      console.log('MQTT client created', mqttClient);

      mqttClient.on('connect', () => {
        console.log('MQTT client connected');
        setIsConnected(true);
        setError(null);
      });

      mqttClient.on('error', (err) => {
        console.error('MQTT client error', err);
        setError(err.message);
        setIsConnected(false);
      });

      mqttClient.on('close', () => {
        console.log('MQTT client disconnected');
        setIsConnected(false);
      });

      mqttClient.on('message', (topic, message) => {
        const callback = subscriptions.get(topic);
        if (callback) {
          callback(message.toString());
        }
      });

      setClient(mqttClient);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed');
    }
  }, [subscriptions]);

  const disconnect = useCallback(() => {
    if (client) {
      client.end();
      setClient(null);
      setIsConnected(false);
    }
  }, [client]);

  const publish = useCallback((topic: string, message: string) => {
    if (client && isConnected) {
      console.log("publishing to topic:",topic, "message:", message)
      client.publish(topic, message);
    }
  }, [client, isConnected]);

  const subscribe = useCallback((topic: string, callback: (message: string) => void) => {
    if (client && isConnected) {
      client.subscribe(topic, (err) => {
        if (!err) {
          setSubscriptions(prev => new Map(prev).set(topic, callback));
        }
      });
    }
  }, [client, isConnected]);

  useEffect(() => {
    return () => {
      if (client) {
        client.end();
      }
    };
  }, [client]);

  return {
    client,
    isConnected,
    error,
    publish,
    subscribe,
    connect,
    disconnect,
  };
};
