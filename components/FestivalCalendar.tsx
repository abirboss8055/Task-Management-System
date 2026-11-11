import React from "react";
import { CalendarDays, Sparkles, Tag, Clock } from "lucide-react";

interface FestivalEvent {
  name: string;
  date: string;
  month: string;
  day: string;
  productionNote: string;
  seasonTag: string;
}

export default function FestivalCalendar() {
  const festivals: FestivalEvent[] = [
    {
      name: "Eid-ul-Fitr",
      date: "March 20",
      month: "MAR",
      day: "20",
      productionNote: "Peak Festive & Panjabi drop dispatch window. Final QC 10 days prior.",
      seasonTag: "Main Festival Drop",
    },
    {
      name: "Pohela Boishakh",
      date: "April 14",
      month: "APR",
      day: "14",
      productionNote: "Heritage Bangla New Year red/white traditional collections delivery.",
      seasonTag: "Heritage Capsule",
    },
    {
      name: "Eid-ul-Adha",
      date: "May 27",
      month: "MAY",
      day: "27",
      productionNote: "High-volume traditional cut & sew drop. Packaging deadline May 18.",
      seasonTag: "Q2 Seasonal Peak",
    },
  ];

  return (
    <div className="bg-surface border-2 border-navy">
      {/* Navy Blue (#0B2545) Header */}
      <div className="bg-navy text-surface px-5 py-4 border-b-2 border-maroon flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <CalendarDays className="w-5 h-5 text-ivory" />
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-ivory">
              Festival Production Calendar
            </h3>
            <p className="text-[10px] text-slate-300 uppercase tracking-wider">
              Bangladeshi Seasonal Drop Milestones
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center space-x-1 px-2 py-0.5 bg-maroon text-[10px] font-bold uppercase tracking-wider text-white">
          <Sparkles className="w-3 h-3 mr-1" />
          <span>Retail Peaks</span>
        </span>
      </div>

      {/* Flat White Cards List */}
      <div className="p-4 space-y-3 bg-ivory">
        {festivals.map((fest) => (
          <div
            key={fest.name}
            className="bg-surface border border-line p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 transition-colors hover:border-navy"
          >
            {/* Date Block & Name */}
            <div className="flex items-start space-x-4">
              {/* Editorial Date Badge */}
              <div className="w-14 h-14 bg-ivory border-2 border-navy flex flex-col items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-bold tracking-widest uppercase text-maroon">
                  {fest.month}
                </span>
                <span className="text-lg font-black tracking-tight text-navy font-mono leading-none">
                  {fest.day}
                </span>
              </div>

              {/* Event Info */}
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-navy">
                    {fest.name}
                  </h4>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    — {fest.date}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 max-w-lg leading-relaxed">
                  {fest.productionNote}
                </p>
              </div>
            </div>

            {/* Tag Badge */}
            <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-1 flex-shrink-0">
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-ivory border border-navy/30 text-navy font-mono">
                <Tag className="w-3 h-3 text-maroon mr-1" />
                <span>{fest.seasonTag}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
