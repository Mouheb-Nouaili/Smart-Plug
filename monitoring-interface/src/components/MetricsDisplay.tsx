import { Zap, TrendingUp, Activity, Clock, DollarSign } from 'lucide-react';

interface MetricsDisplayProps {
  current: number;
  voltage: number;
  power: number;
  energy: number;
  cost: number;
}

export const MetricsDisplay = ({ current, voltage, power, energy, cost }: MetricsDisplayProps) => {
  const metrics = [
    {
      icon: Zap,
      label: 'Courant',
      value: current.toFixed(2),
      unit: 'A',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      icon: TrendingUp,
      label: 'Tension',
      value: voltage.toFixed(2),
      unit: 'V',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Activity,
      label: 'Puissance',
      value: power.toFixed(2),
      unit: 'W',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Clock,
      label: 'Énergie',
      value: energy.toFixed(3),
      unit: 'kWh',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: DollarSign,
      label: 'Coût',
      value: cost.toFixed(2),
      unit: '€',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <div
            key={metric.label}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className={`w-12 h-12 ${metric.bgColor} rounded-lg flex items-center justify-center mb-3`}>
              <Icon className={`w-6 h-6 ${metric.color}`} />
            </div>
            <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
            <p className="text-2xl font-bold text-gray-900">
              {metric.value}
              <span className="text-lg font-normal text-gray-500 ml-1">
                {metric.unit}
              </span>
            </p>
          </div>
        );
      })}
    </div>
  );
};
