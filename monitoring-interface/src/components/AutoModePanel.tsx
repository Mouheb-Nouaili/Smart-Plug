import { useState, useEffect } from 'react';
import { Shield, AlertTriangle } from 'lucide-react';

interface AutoModePanelProps {
  autoMode: boolean;
  maxCurrent: number;
  maxVoltage: number;
  onToggleAutoMode: () => void;
  onUpdateLimits: (maxCurrent: number, maxVoltage: number) => void;
  disabled: boolean;
}

export const AutoModePanel = ({
  autoMode,
  maxCurrent,
  maxVoltage,
  onToggleAutoMode,
  onUpdateLimits,
  disabled,
}: AutoModePanelProps) => {
  const [localMaxCurrent, setLocalMaxCurrent] = useState(maxCurrent.toString());
  const [localMaxVoltage, setLocalMaxVoltage] = useState(maxVoltage.toString());

  useEffect(() => {
    setLocalMaxCurrent(maxCurrent.toString());
    setLocalMaxVoltage(maxVoltage.toString());
  }, [maxCurrent, maxVoltage]);

  const handleApplyLimits = () => {
    const current = parseFloat(localMaxCurrent) || 0;
    const voltage = parseFloat(localMaxVoltage) || 0;
    onUpdateLimits(current, voltage);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
          autoMode ? 'bg-orange-100' : 'bg-gray-100'
        }`}>
          <Shield className={`w-6 h-6 ${autoMode ? 'text-orange-600' : 'text-gray-400'}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">
            Mode Automatique
          </h3>
          <p className="text-sm text-gray-500">
            Protection par seuils de sécurité
          </p>
        </div>
        <button
          onClick={onToggleAutoMode}
          disabled={disabled}
          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
            autoMode ? 'bg-orange-500' : 'bg-gray-300'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
              autoMode ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {autoMode && (
        <>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-orange-800">
              Le relais s'ouvrira automatiquement si les valeurs dépassent les limites définies.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Courant Maximum (A)
              </label>
              <input
                type="number"
                step="0.1"
                value={localMaxCurrent}
                onChange={(e) => setLocalMaxCurrent(e.target.value)}
                disabled={disabled}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tension Maximum (V)
              </label>
              <input
                type="number"
                step="0.1"
                value={localMaxVoltage}
                onChange={(e) => setLocalMaxVoltage(e.target.value)}
                disabled={disabled}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <button
              onClick={handleApplyLimits}
              disabled={disabled}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Appliquer les limites
            </button>
          </div>
        </>
      )}
    </div>
  );
};
