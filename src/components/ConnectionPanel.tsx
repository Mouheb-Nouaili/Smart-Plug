import { useState } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

interface ConnectionPanelProps {
  isConnected: boolean;
  onConnect: (url: string, username: string, password: string) => void;
  onDisconnect: () => void;
  error: string | null;
}

export const ConnectionPanel = ({ isConnected, onConnect, onDisconnect, error }: ConnectionPanelProps) => {
  const [brokerUrl, setBrokerUrl] = useState('wss://ea3a52e947bf4015b53b67059b4761c9.s1.eu.hivemq.cloud:8884/mqtt');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleConnect = () => {
    onConnect(brokerUrl, username, password);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        {isConnected ? (
          <Wifi className="w-6 h-6 text-green-500" />
        ) : (
          <WifiOff className="w-6 h-6 text-gray-400" />
        )}
        <h2 className="text-xl font-semibold text-gray-800">
          Connexion HiveMQ
        </h2>
        <div className={`ml-auto px-3 py-1 rounded-full text-sm font-medium ${
          isConnected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
        }`}>
          {isConnected ? 'Connecté' : 'Déconnecté'}
        </div>
      </div>

      {!isConnected && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL du Broker MQTT
            </label>
            <input
              type="text"
              value={brokerUrl}
              onChange={(e) => setBrokerUrl(e.target.value)}
              placeholder="wss://broker.hivemq.com:8884/mqtt"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username (optionnel)
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password (optionnel)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            onClick={handleConnect}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Se connecter
          </button>
        </div>
      )}

      {isConnected && (
        <button
          onClick={onDisconnect}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-lg transition-colors"
        >
          Se déconnecter
        </button>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};
