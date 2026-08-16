import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { MarketData } from '../types';

const dummyData: MarketData[] = [
  { name: 'Jan', price: 400, date: '2024-01' },
  { name: 'Feb', price: 300, date: '2024-02' },
  { name: 'Mar', price: 600, date: '2024-03' },
  { name: 'Apr', price: 800, date: '2024-04' },
  { name: 'May', price: 500, date: '2024-05' },
  { name: 'Jun', price: 900, date: '2024-06' },
  { name: 'Jul', price: 1100, date: '2024-07' },
];

export default function MarketTrends() {
  return (
    <div id="market-trends-container" className="stat-card">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <p className="text-[#556b2f] font-sans font-bold uppercase tracking-[0.2em] text-[10px] mb-1">Market Analysis</p>
          <h2 className="font-serif text-3xl text-[#2d3436]">Wheat Futures</h2>
          <p className="text-sm text-gray-400 font-sans mt-1">Price trends for Premium Grade Wheat (USD/ton)</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-1.5 rounded-full bg-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:bg-gray-200 transition-all">1W</button>
          <button className="px-4 py-1.5 rounded-full bg-[#2d3436] text-[10px] font-bold uppercase tracking-widest text-white shadow-lg shadow-[#2d3436]/20">1M</button>
          <button className="px-4 py-1.5 rounded-full bg-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:bg-gray-200 transition-all">1Y</button>
        </div>
      </div>
      
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dummyData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#556b2f" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#556b2f" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8f9fa" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#adb5bd', fontSize: 10, fontWeight: 600 }}
              dy={15}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#adb5bd', fontSize: 10, fontWeight: 600 }}
              dx={-10}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', padding: '16px' }}
              itemStyle={{ fontFamily: 'Inter', fontSize: '12px', fontWeight: 'bold' }}
            />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="#556b2f" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorPrice)" 
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-10 grid grid-cols-3 gap-6">
        <div className="bg-gray-50 p-5 rounded-[2rem] border border-gray-100">
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-sans font-bold mb-1">Current</p>
          <p className="text-2xl font-serif text-[#2d3436]">$1,100</p>
        </div>
        <div className="bg-gray-50 p-5 rounded-[2rem] border border-gray-100">
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-sans font-bold mb-1">Growth</p>
          <p className="text-2xl font-serif text-green-600">+18.4%</p>
        </div>
        <div className="bg-gray-50 p-5 rounded-[2rem] border border-gray-100">
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-sans font-bold mb-1">Peak</p>
          <p className="text-2xl font-serif text-[#2d3436]">$1,250</p>
        </div>
      </div>
    </div>
  );
}
