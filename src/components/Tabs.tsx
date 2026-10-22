"use client";

import React, { useState, useRef, KeyboardEvent } from "react";

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTabId?: string;
  className?: string;
}

export default function Tabs({
  tabs,
  defaultTabId,
  className = "",
}: TabsProps) {
  const [activeTabId, setActiveTabId] = useState<string>(
    defaultTabId || (tabs[0]?.id ?? "")
  );

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  if (tabs.length === 0) return null;

  const activeIndex = tabs.findIndex((t) => t.id === activeTabId);
  const currentTab = tabs[activeIndex !== -1 ? activeIndex : 0];

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let newIndex = index;
    if (e.key === "ArrowRight") {
      newIndex = (index + 1) % tabs.length;
      e.preventDefault();
    } else if (e.key === "ArrowLeft") {
      newIndex = (index - 1 + tabs.length) % tabs.length;
      e.preventDefault();
    } else if (e.key === "Home") {
      newIndex = 0;
      e.preventDefault();
    } else if (e.key === "End") {
      newIndex = tabs.length - 1;
      e.preventDefault();
    } else {
      return;
    }

    const nextTab = tabs[newIndex];
    if (nextTab) {
      setActiveTabId(nextTab.id);
      tabRefs.current[newIndex]?.focus();
    }
  };

  return (
    <section
      className={`border-2 border-brand-blue rounded-xl bg-white overflow-hidden ${className}`}
    >
      {/* Tab List */}
      <div
        role="tablist"
        aria-label="Informasi Produk"
        className="flex border-b-2 border-brand-blue bg-brand-tint overflow-x-auto scrollbar-none"
      >
        {tabs.map((tab, idx) => {
          const isSelected = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[idx] = el;
              }}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isSelected}
              aria-controls={`panel-${tab.id}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setActiveTabId(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`px-4 sm:px-6 py-2.5 font-heading text-xs sm:text-sm whitespace-nowrap min-h-[44px] flex items-center justify-center transition-colors border-r-2 border-brand-blue last:border-r-0 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-orange ${
                isSelected
                  ? "bg-white text-brand-blue font-bold"
                  : "text-brand-blue/70 hover:text-brand-blue hover:bg-white/70 font-normal"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panel */}
      {currentTab ? (
        <div
          role="tabpanel"
          id={`panel-${currentTab.id}`}
          aria-labelledby={`tab-${currentTab.id}`}
          tabIndex={0}
          className="p-4 sm:p-6 bg-white font-body text-xs sm:text-sm text-brand-blue leading-relaxed font-normal focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-orange"
        >
          {currentTab.content}
        </div>
      ) : null}
    </section>
  );
}
