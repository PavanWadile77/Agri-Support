import { Sprout, Activity, Zap } from 'lucide-react';

export default function SoilHealthWidget() {
  return (
    <div className="stat-card">
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-400 font-sans font-bold">Soil Health Index</p>
          <h3 className="text-3xl font-serif mt-1 text-[#556b2f]">Optimal</h3>
          <p className="text-sm text-gray-500 font-sans">Last tested: 2 days ago</p>
        </div>
        <div className="bg-[#556b2f]/10 p-3 rounded-2xl">
          <Sprout className="text-[#556b2f]" size={24} />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] uppercase font-bold text-gray-400">
            <span>Nitrogen (N)</span>
            <span>85%</span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#556b2f] w-[85%] rounded-full" />
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] uppercase font-bold text-gray-400">
            <span>Phosphorus (P)</span>
            <span>62%</span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#556b2f] w-[62%] rounded-full" />
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] uppercase font-bold text-gray-400">
            <span>Potassium (K)</span>
            <span>78%</span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#556b2f] w-[78%] rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
