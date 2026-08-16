import { CloudRain, Thermometer, Wind, Droplets } from 'lucide-react';

export default function WeatherWidget() {
  return (
    <div className="stat-card bg-gradient-to-br from-[#556b2f] to-[#2d3436] text-white border-none">
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-xs uppercase tracking-widest opacity-70 font-sans font-bold">Local Weather</p>
          <h3 className="text-3xl font-serif mt-1">24°C</h3>
          <p className="text-sm opacity-90 font-sans">Partly Cloudy • Satara, MH</p>
        </div>
        <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md">
          <CloudRain className="text-white" size={24} />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
        <div className="text-center">
          <Droplets size={16} className="mx-auto mb-1 opacity-60" />
          <p className="text-[10px] uppercase opacity-60 font-sans">Humidity</p>
          <p className="text-sm font-serif">65%</p>
        </div>
        <div className="text-center">
          <Wind size={16} className="mx-auto mb-1 opacity-60" />
          <p className="text-[10px] uppercase opacity-60 font-sans">Wind</p>
          <p className="text-sm font-serif">12km/h</p>
        </div>
        <div className="text-center">
          <Thermometer size={16} className="mx-auto mb-1 opacity-60" />
          <p className="text-[10px] uppercase opacity-60 font-sans">Soil Temp</p>
          <p className="text-sm font-serif">19°C</p>
        </div>
      </div>
    </div>
  );
}
