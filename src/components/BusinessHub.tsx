import ReactMarkdown from 'react-markdown';
import { Briefcase, Leaf, TrendingUp, Truck, Settings, Target, ShieldAlert, Maximize, BarChart3, Globe, Users, DollarSign } from 'lucide-react';

const businessPlanContent = `
# BananaFiber Eco-Solutions: Strategic Business Plan

## 1. Executive Summary
**BananaFiber Eco-Solutions** is a pioneering sustainable startup focused on the high-value extraction of natural fibers from banana plant stems—a major agricultural waste product. By sourcing directly from small-hold farmers, we create a circular economy that generates additional income for rural communities while providing the textile, paper, and packaging industries with premium, biodegradable raw materials.

---

## 2. Business Model & Value Chain
Our model follows a strictly controlled **"Farm-to-Fiber"** value chain designed for maximum efficiency and social impact:
1.  **Farmer (Sourcing):** Purchase post-harvest banana stems at a fair price ($15-$25 per ton).
2.  **Collection (Logistics):** Mobile collection units transport stems to regional processing hubs within 24 hours of harvest.
3.  **Processing (Extraction):** Mechanical extraction of fibers and conversion of sap/pulp into organic liquid fertilizer.
4.  **Company (B2B Supply):** Sale of graded fibers to eco-friendly product manufacturing companies.

---

## 3. Benefits & Global Impact
### For Farmers
-   **15-20% increase** in annual household income.
-   **Zero-cost waste disposal**, reducing farm labor requirements.
-   **Access to organic fertilizer** produced as a byproduct of our process.

### For the Environment
-   **Methane Reduction:** Prevents anaerobic decomposition of stems in fields.
-   **Water Conservation:** Banana fiber requires significantly less water than cotton.
-   **Biodegradability:** Fibers decompose naturally, reducing plastic pollution.

### For Manufacturers
-   **Premium Material:** High-tensile, lightweight, and moisture-wicking properties.
-   **ESG Compliance:** Helps companies meet sustainability targets and consumer demand for eco-friendly products.

---

## 4. Cost Structure & Revenue Streams
### Cost Structure
-   **Procurement (25%):** Fair-price payments to farmers.
-   **Logistics (20%):** Fuel, vehicle maintenance, and collection labor.
-   **Processing (35%):** Machinery operation, electricity, and hub staff.
-   **Admin & Marketing (20%):** Certifications, B2B sales, and overhead.

### Revenue Streams
-   **Primary:** Sale of Banana Fiber (Textile/Paper grade).
-   **Secondary:** Sale of Banana Pulp (for handmade paper/compost).
-   **Tertiary:** Sale of Banana Sap (Organic liquid fertilizer).

---

## 5. Logistics & Supply Chain Strategy
We utilize a decentralized **Hub-and-Spoke Model**:
-   **Spokes:** Collection centers strategically located within 20km of major banana plantations.
-   **Hubs:** Centralized processing plants equipped with high-capacity extraction machinery.
-   **Strategy:** Real-time tracking of harvest cycles to ensure just-in-time collection, preventing stem dehydration and ensuring maximum fiber quality.

---

## 6. Required Machinery & Processing Steps
### Machinery
-   **Raspador Machine:** For mechanical decortication (fiber extraction).
-   **Drying Racks:** Solar-powered industrial dryers to maintain fiber integrity.
-   **Softening & Baling Machines:** To prepare fiber for industrial shipping.

### Processing Steps
1.  **Splitting:** Stems are split into sheaths manually or mechanically.
2.  **Extraction:** Raspador removes the pulp, leaving the fiber.
3.  **Washing & Drying:** Fibers are cleaned and solar-dried to <10% moisture.
4.  **Grading:** Sorted by color, strength, and length for different industrial uses.

---

## 7. Target Customers
-   **Eco-Friendly Brands:** Sustainable fashion labels (textiles).
-   **Packaging Companies:** Manufacturers of biodegradable food containers and shipping materials.
-   **Paper Industry:** Specialty paper mills focusing on tree-free, premium products.

---

## 8. Marketing & Partnership Strategies
-   **Direct B2B Partnerships:** Long-term supply contracts with industrial manufacturers.
-   **Sustainability Certification:** Obtaining GRS (Global Recycled Standard) and Fair Trade certifications.
-   **Farmer Cooperatives:** Partnering with local agricultural unions to ensure consistent, high-volume supply.

---

## 9. Challenges & Risk Management
-   **Logistics Costs:** Mitigated by setting up processing hubs close to plantations.
-   **Quality Consistency:** Managed through standardized training and automated grading systems.
-   **Seasonality:** Diversifying sourcing across different geographic regions with varying harvest cycles.

---

## 10. Scalability & Future Expansion
-   **Geographic Expansion:** Replicating the hub model in other major banana-producing nations (e.g., India, Ecuador, Philippines).
-   **Product Diversification:** Expanding into pineapple leaf fiber (PALF) and coconut coir processing.
-   **Vertical Integration:** Developing in-house biodegradable packaging lines for direct-to-consumer sales.
`;

export default function BusinessHub() {
  return (
    <div id="business-hub-container" className="space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-[#556b2f] font-sans font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Strategic Planning & Impact</p>
          <h2 className="text-5xl md:text-6xl font-serif text-[#2d3436] tracking-tight">Business <span className="italic text-[#556b2f]">Hub</span></h2>
        </div>
        <div className="flex gap-3">
          <button className="bg-[#2d3436] text-white px-6 py-3 rounded-2xl font-sans text-xs font-bold uppercase tracking-widest shadow-lg shadow-[#2d3436]/20 flex items-center gap-2">
            <TrendingUp size={16} />
            Market Analysis
          </button>
          <button className="bg-[#556b2f] text-white px-6 py-3 rounded-2xl font-sans text-xs font-bold uppercase tracking-widest shadow-lg shadow-[#556b2f]/20 flex items-center gap-2">
            <DollarSign size={16} />
            Financial Forecast
          </button>
        </div>
      </header>

      {/* Impact Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Globe, label: "Carbon Offset", value: "12.4 Tons", color: "text-blue-600", bg: "bg-blue-50" },
          { icon: Users, label: "Farmers Impacted", value: "1,250+", color: "text-[#556b2f]", bg: "bg-[#556b2f]/10" },
          { icon: Leaf, label: "Waste Diverted", value: "450 Tons", color: "text-green-600", bg: "bg-green-50" },
          { icon: BarChart3, label: "Projected ROI", value: "24.5%", color: "text-purple-600", bg: "bg-purple-50" }
        ].map((stat, i) => (
          <div key={i} className="stat-card flex items-center gap-4">
            <div className={`${stat.bg} p-4 rounded-2xl`}>
              <stat.icon className={stat.color} size={24} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-sans font-bold">{stat.label}</p>
              <p className="text-2xl font-serif text-[#2d3436]">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation for the Plan */}
        <div className="lg:col-span-1 space-y-4">
          <div className="stat-card p-4 sticky top-8">
            <h3 className="font-serif text-lg mb-4 text-[#2d3436]">Plan Sections</h3>
            <nav className="space-y-1">
              {[
                { icon: Briefcase, label: "Executive Summary" },
                { icon: Truck, label: "Supply Chain" },
                { icon: Settings, label: "Machinery" },
                { icon: Target, label: "Target Market" },
                { icon: ShieldAlert, label: "Risk Management" },
                { icon: Maximize, label: "Scalability" }
              ].map((item, i) => (
                <button key={i} className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-400 hover:bg-gray-50 hover:text-[#556b2f] transition-all text-left">
                  <item.icon size={14} />
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="mt-8 pt-8 border-t border-gray-50">
              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-gray-400 mb-2">Sustainability Score</p>
                <div className="flex items-end gap-2">
                  <p className="text-3xl font-serif text-[#556b2f]">94</p>
                  <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-gray-400 mb-1">/ 100</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Plan Content */}
        <div className="lg:col-span-3">
          <div className="stat-card p-10">
            <div className="markdown-body prose prose-slate max-w-none 
              prose-h1:font-serif prose-h1:text-5xl prose-h1:text-[#2d3436] prose-h1:tracking-tight prose-h1:mb-10
              prose-h2:font-serif prose-h2:text-3xl prose-h2:text-[#556b2f] prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-gray-100 prose-h2:pb-2
              prose-h3:font-serif prose-h3:text-xl prose-h3:text-[#2d3436] prose-h3:mt-8
              prose-p:font-sans prose-p:text-gray-600 prose-p:leading-relaxed prose-p:text-base
              prose-li:font-sans prose-li:text-gray-600 prose-li:text-sm
              prose-strong:text-[#2d3436] prose-strong:font-bold
              prose-hr:border-gray-100 prose-hr:my-12">
              <ReactMarkdown>{businessPlanContent}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
