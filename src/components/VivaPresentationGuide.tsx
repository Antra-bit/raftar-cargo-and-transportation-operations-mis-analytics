import React, { useState } from 'react';
import { 
  GraduationCap, 
  Clock, 
  UserCheck, 
  HelpCircle, 
  Code2, 
  Sparkles, 
  ShieldCheck, 
  Copy, 
  Check, 
  Layers 
} from 'lucide-react';

export const VivaPresentationGuide: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'pitch' | 'role' | 'tech' | 'viva'>('pitch');
  const [copiedPitch, setCopiedPitch] = useState<boolean>(false);

  const pitchText = `My project is Transport Operations MIS and Performance Analytics System. The project is based on the type of operational data analysis and MIS activities I was exposed to during my Data Analyst internship in the Operations Department at Raftaar Cargo and Transport Services.

The main problem I addressed is that transportation operations generate data from multiple sources such as shipment, vehicle, driver and expense records. Raw data can contain missing values, duplicates and inconsistencies, and manually preparing daily, weekly and monthly MIS reports can be time-consuming.

So I designed an end-to-end analytics workflow where operational data is first collected and cleaned using Python and Pandas. Then the data is validated using predefined quality rules and structured for analysis. SQL is used for storing and querying the data.

After that, I perform exploratory data analysis and calculate important operational KPIs such as total shipments, delivered shipments, delayed shipments, on-time delivery percentage, average delivery time and operational cost.

The system then generates daily, weekly and monthly MIS reports and presents the major KPIs through an interactive dashboard containing shipment trends, delivery status, route performance, delay analysis and cost analysis.

Finally, the system identifies operational trends and exceptions so that the data can be converted into actionable operational insights. The major focus of the project is therefore not just visualization, but the complete process of data collection, cleaning, validation, analysis, reporting and automation.`;

  const handleCopyPitch = () => {
    navigator.clipboard.writeText(pitchText);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-amber-400" />
            Viva Voce & College Presentation Defense Kit
          </h1>
          <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
            <span>Faculty Defense Ready</span>
            <span aria-hidden="true">·</span>
            <span>2-Minute Script · Role Defense · Confidentiality Protocols · Tech FAQ</span>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-lg text-xs">
          {[
            { id: 'pitch', label: '2-Min Pitch', icon: Clock },
            { id: 'role', label: 'Your Role', icon: UserCheck },
            { id: 'tech', label: 'Tech Defense', icon: Code2 },
            { id: 'viva', label: 'Critical Viva Q&A', icon: HelpCircle },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as any)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeSection === item.id
                    ? 'bg-neutral-800 text-amber-400 shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. 2-MINUTE ELEVATOR PITCH */}
      {activeSection === 'pitch' && (
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div>
              <span className="text-[11px] font-mono text-amber-400 uppercase tracking-widest">
                Script Teleprompter
              </span>
              <h2 className="font-display text-lg font-bold text-white mt-0.5">
                How to Explain the Project in 2 Minutes
              </h2>
            </div>
            <button
              onClick={handleCopyPitch}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded text-xs transition-colors cursor-pointer"
            >
              {copiedPitch ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPitch ? 'Copied to Clipboard' : 'Copy Pitch Script'}</span>
            </button>
          </div>

          <div className="p-5 bg-neutral-950 border border-neutral-800/80 rounded-lg text-sm text-neutral-200 leading-relaxed font-sans space-y-4">
            <p>
              "My project is <strong>Transport Operations MIS and Performance Analytics System</strong>. The project is based on the operational data analysis and MIS activities I was exposed to during my Data Analyst internship in the Operations Department at <strong>Raftaar Cargo and Transport Services</strong>."
            </p>
            <p>
              "The main problem I addressed is that transportation operations generate large data across multiple sources—shipment bookings, vehicle assignments, driver logs, and fuel/toll expenses. When maintained manually in Excel, it suffers from missing values, duplicates, and slow reporting cycles."
            </p>
            <p>
              "So I designed an end-to-end analytics workflow: raw data is ingested and cleaned using <strong>Python and Pandas</strong>. Then it is validated using predefined quality rules, and structured for storage in <strong>SQL</strong> for fast querying."
            </p>
            <p>
              "Next, I perform exploratory data analysis and calculate <strong>8 core operational KPIs</strong>: Total Shipments, Delivered, Delayed, On-Time Delivery %, Average Delivery Time, Total Operational Cost, Cost per Shipment, and Cost per KM."
            </p>
            <p>
              "The system automatically compiles <strong>Daily, Weekly, and Monthly MIS reports</strong> and presents the metrics on an interactive dashboard showing route throughput, delay root-causes, and cost breakdowns."
            </p>
            <p className="text-amber-300 font-medium">
              "The core distinction of this project is that it is not just a visual dashboard; it represents the complete data analytics lifecycle from raw collection to business insights."
            </p>
          </div>
        </div>
      )}

      {/* 2. WHAT EXACTLY DID YOU DO? */}
      {activeSection === 'role' && (
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-6 space-y-5">
          <div>
            <span className="text-[11px] font-mono text-amber-400 uppercase tracking-widest">
              Internship Responsibilities Defense
            </span>
            <h2 className="font-display text-lg font-bold text-white mt-0.5">
              "What Exactly Did YOU Do?"
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Your exact answer aligns directly with your official internship certificate and job responsibilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800 space-y-2">
              <div className="font-semibold text-white text-sm flex items-center gap-1.5">
                <span className="text-amber-400 font-mono">01.</span> Data Understanding & Cleaning
              </div>
              <p className="text-neutral-400">
                Mapped out real-world transportation schemas across 4 key entities: Shipments, Vehicles, Drivers, and Expenses. Built automated deduplication and text standardization scripts to correct casing variations in city and status fields.
              </p>
            </div>

            <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800 space-y-2">
              <div className="font-semibold text-white text-sm flex items-center gap-1.5">
                <span className="text-amber-400 font-mono">02.</span> Business Rules Validation
              </div>
              <p className="text-neutral-400">
                Designed a Data Quality Rules engine that checks chronological logic (e.g. delivery date cannot precede booking date), enforces positive freight and distance constraints, and verifies foreign-key integrity between vehicles and drivers.
              </p>
            </div>

            <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800 space-y-2">
              <div className="font-semibold text-white text-sm flex items-center gap-1.5">
                <span className="text-amber-400 font-mono">03.</span> KPI Formulation & SQL Schema
              </div>
              <p className="text-neutral-400">
                Implemented the 8 core operational KPIs with mathematical precision. Structured relational schemas and optimized SQL queries to aggregate corridor volume, cost-per-km, and delivery delay distributions.
              </p>
            </div>

            <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800 space-y-2">
              <div className="font-semibold text-white text-sm flex items-center gap-1.5">
                <span className="text-amber-400 font-mono">04.</span> Automated MIS & Dashboarding
              </div>
              <p className="text-neutral-400">
                Engineered the automated report generator producing Daily, Weekly, and Monthly MIS summaries. Created an interactive dashboard with live route tracking, delay filters, and operational exception flags.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. TECHNOLOGY DEFENSE */}
      {activeSection === 'tech' && (
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-6 space-y-5">
          <div>
            <span className="text-[11px] font-mono text-amber-400 uppercase tracking-widest">
              Architectural Rationale
            </span>
            <h2 className="font-display text-lg font-bold text-white mt-0.5">
              How to Defend Each Technology Choice
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-neutral-950 p-3.5 rounded-lg border border-neutral-800">
              <div className="font-semibold text-amber-400 mb-1">Faculty: "Why Python?"</div>
              <div className="text-neutral-300">
                "Python provides an efficient, reproducible environment to automate data cleaning, transformations, statistical calculations, and repetitive reporting tasks that are error-prone in manual Excel."
              </div>
            </div>

            <div className="bg-neutral-950 p-3.5 rounded-lg border border-neutral-800">
              <div className="font-semibold text-amber-400 mb-1">Faculty: "Why Pandas?"</div>
              <div className="text-neutral-300">
                "Pandas is designed for handling structured tabular data, vectorized date-time calculations (such as computing delay days between delivery timestamps), filtering outliers, and multi-key merging across shipment and expense records."
              </div>
            </div>

            <div className="bg-neutral-950 p-3.5 rounded-lg border border-neutral-800">
              <div className="font-semibold text-amber-400 mb-1">Faculty: "Why SQL?"</div>
              <div className="text-neutral-300">
                "SQL provides relational schema constraints, ACID transaction integrity, and sub-second analytical querying using indexes, group-by rollups, and window functions across millions of shipment rows."
              </div>
            </div>

            <div className="bg-neutral-950 p-3.5 rounded-lg border border-neutral-800">
              <div className="font-semibold text-amber-400 mb-1">Faculty: "Why interactive visualization?"</div>
              <div className="text-neutral-300">
                "Visual charts make trends, corridor bottlenecks, and cost anomalies immediately apparent to operational dispatchers compared to scanning raw spreadsheets with thousands of rows."
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. CRITICAL VIVA QUESTIONS */}
      {activeSection === 'viva' && (
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-6 space-y-5">
          <div>
            <span className="text-[11px] font-mono text-amber-400 uppercase tracking-widest">
              Crucial Interview & Viva Questions
            </span>
            <h2 className="font-display text-lg font-bold text-white mt-0.5">
              The #1 Most Important Question: Data Confidentiality
            </h2>
          </div>

          {/* Golden Question Box */}
          <div className="bg-amber-950/30 border border-amber-800/60 p-4 rounded-lg space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span>Examiner: "Is this the actual Raftaar company system and real client data?"</span>
            </div>
            <div className="text-xs text-neutral-200 leading-relaxed">
              <strong>Your Exact Answer:</strong><br />
              <em>
                "No, sir/ma'am. This is an academic project developed based on the operational analytics and MIS workflows I experienced during my internship at Raftaar Cargo & Transport Services. In accordance with the non-disclosure and confidentiality provisions in my internship agreement, this system uses synthetic and anonymized datasets structured to accurately represent genuine logistics operations without compromising proprietary company or customer records."
              </em>
            </div>
          </div>

          {/* Additional Common Viva Questions */}
          <div className="space-y-3 text-xs">
            <div className="bg-neutral-950 p-3.5 rounded-lg border border-neutral-800">
              <div className="font-semibold text-white mb-1">
                Q2: "What happens if a delivery date is missing in the dataset?"
              </div>
              <div className="text-neutral-400">
                "In logistics operations, missing actual delivery dates often indicate consignments currently 'In Transit'. Our validation pipeline distinguishes between genuine in-transit rows and invalid missing data by cross-checking status tags and booking timestamps."
              </div>
            </div>

            <div className="bg-neutral-950 p-3.5 rounded-lg border border-neutral-800">
              <div className="font-semibold text-white mb-1">
                Q3: "How is On-Time Delivery % calculated?"
              </div>
              <div className="text-neutral-400 font-mono">
                OTD % = (Delivered On-Time Consignments / Total Completed Deliveries) × 100. Deliveries exceeding expected date are flagged as Delayed.
              </div>
            </div>

            <div className="bg-neutral-950 p-3.5 rounded-lg border border-neutral-800">
              <div className="font-semibold text-white mb-1">
                Q4: "What is the future scope of this platform?"
              </div>
              <div className="text-neutral-400">
                "The current project focuses on descriptive and diagnostic analytics. Future enhancements include predictive delay forecasting using machine learning, dynamic route optimization, and live GPS IoT hardware integration."
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
