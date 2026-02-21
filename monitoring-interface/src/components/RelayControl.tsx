import { Power } from 'lucide-react';

interface RelayControlProps {
  relayStatus: boolean;
  onToggle: () => void;
  disabled: boolean;
}

export const RelayControl = ({ relayStatus, onToggle, disabled }: RelayControlProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Contrôle du Relais
      </h3>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            relayStatus ? 'bg-green-100' : 'bg-gray-100'
          }`}>
            <Power className={`w-6 h-6 ${relayStatus ? 'text-green-600' : 'text-gray-400'}`} />
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {relayStatus ? 'Activé' : 'Désactivé'}
            </p>
            <p className="text-sm text-gray-500">
              État actuel du relais
            </p>
          </div>
        </div>

        <button
          onClick={onToggle}
          disabled={disabled}
          className={`px-8 py-3 rounded-lg font-medium transition-all ${
            relayStatus
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {relayStatus ? 'Désactiver' : 'Activer'}
        </button>
      </div>
    </div>
  );
};
