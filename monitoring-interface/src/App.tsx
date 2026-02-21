import { useState, useEffect } from 'react';
import { useMQTT } from './hooks/useMQTT';
import { ConnectionPanel } from './components/ConnectionPanel';
import { MetricsDisplay } from './components/MetricsDisplay';
import { RelayControl } from './components/RelayControl';
import { AutoModePanel } from './components/AutoModePanel';
import { Plug } from 'lucide-react';

const TOPICS = {
  current: 'smartplug/current',
  voltage: 'smartplug/voltage',
  power: 'smartplug/power',
  energy: 'smartplug/energy',
  cost: 'smartplug/cost',
  relayControl: 'smartplug/relay/control',
  relayStatus: 'smartplug/relay/status',
  maxCurrent: 'smartplug/settings/max_current',
  maxVoltage: 'smartplug/settings/max_voltage',
  autoMode: 'smartplug/settings/auto_mode',
};

function App() {
  const { isConnected, error, publish, subscribe, connect, disconnect } = useMQTT();

  const [current, setCurrent] = useState(0);
  const [voltage, setVoltage] = useState(0);
  const [power, setPower] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [cost, setCost] = useState(0);
  const [relayStatus, setRelayStatus] = useState(false);
  const [autoMode, setAutoMode] = useState(false);
  const [maxCurrent, setMaxCurrent] = useState(10);
  const [maxVoltage, setMaxVoltage] = useState(250);

  useEffect(() => {
    if (isConnected) {
      subscribe(TOPICS.current, (msg) => setCurrent(parseFloat(msg) || 0));
      subscribe(TOPICS.voltage, (msg) => setVoltage(parseFloat(msg) || 0));
      subscribe(TOPICS.power, (msg) => setPower(parseFloat(msg) || 0));
      subscribe(TOPICS.energy, (msg) => setEnergy(parseFloat(msg) || 0));
      subscribe(TOPICS.cost, (msg) => setCost(parseFloat(msg) || 0));
      subscribe(TOPICS.relayStatus, (msg) => {
        console.log("meessage:relay:subscription", msg)
        if(msg === "ON") {
          setRelayStatus(true)
        } else {
          setRelayStatus(false)
        }
      });
      subscribe(TOPICS.autoMode, (msg) => {
        console.log("meessage:automode:subscription", msg)
        if(msg === "on") {
          setAutoMode(true)
        } else {
          setAutoMode(false)
        }
        
      });
      subscribe(TOPICS.maxCurrent, (msg) => setMaxCurrent(parseFloat(msg) || 10));
      subscribe(TOPICS.maxVoltage, (msg) => setMaxVoltage(parseFloat(msg) || 250));
    }
  }, [isConnected, subscribe]);

  const handleConnect = (url: string, username: string, password: string) => {
    connect({
      brokerUrl: url,
      username: username || undefined,
      password: password || undefined,
    });
  };

  const handleToggleRelay = () => {
    const newStatus = !relayStatus;
    publish(TOPICS.relayControl, newStatus ? 'on' : 'off');
  };

  const handleToggleAutoMode = () => {
    const newAutoMode = !autoMode;
    publish(TOPICS.autoMode, newAutoMode ? 'on' : 'off');
  };

  const handleUpdateLimits = (newMaxCurrent: number, newMaxVoltage: number) => {
    publish(TOPICS.maxCurrent, newMaxCurrent.toString());
    publish(TOPICS.maxVoltage, newMaxVoltage.toString());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Plug className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Smart Plug IoT
            </h1>
            <p className="text-gray-600">
              Surveillance et contrôle en temps réel
            </p>
          </div>
        </div>

        <ConnectionPanel
          isConnected={isConnected}
          onConnect={handleConnect}
          onDisconnect={disconnect}
          error={error}
        />

        {isConnected && (
          <>
            <MetricsDisplay
              current={current}
              voltage={voltage}
              power={power}
              energy={energy}
              cost={cost}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RelayControl
                relayStatus={relayStatus}
                onToggle={handleToggleRelay}
                disabled={!isConnected}
              />

              <AutoModePanel
                autoMode={autoMode}
                maxCurrent={maxCurrent}
                maxVoltage={maxVoltage}
                onToggleAutoMode={handleToggleAutoMode}
                onUpdateLimits={handleUpdateLimits}
                disabled={!isConnected}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
