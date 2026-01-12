"use client";

import React, { useState } from "react";
import FeatureMap from "./FeatureMap";
import ColorScale from "./ColorScale";
import { splitLayers, type LayerData, type VisualizationData } from "~/lib/model-helpers";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface LayerExplorerProps {
  visualization: VisualizationData;
  inputSpectrogram: LayerData;
}

type Tab = "input" | "early" | "middle" | "deep";

export default function LayerExplorer({
  visualization,
  inputSpectrogram,
}: LayerExplorerProps) {
  const [activeTab, setActiveTab] = useState<Tab>("input");
  const { main, internals } = splitLayers(visualization);

  const tabs: { id: Tab; label: string }[] = [
    { id: "input", label: "Input Analysis" },
    { id: "early", label: "Early Features (L1)" },
    { id: "middle", label: "Intermediate (L2-L3)" },
    { id: "deep", label: "Deep Concepts (L4)" },
  ];

  const getLayersForTab = (tab: Tab) => {
    switch (tab) {
      case "early":
        return main.filter(([name]) => name.includes("layer1"));
      case "middle":
        return main.filter(([name]) => name.includes("layer2") || name.includes("layer3"));
      case "deep":
        return main.filter(([name]) => name.includes("layer4"));
      default:
        return [];
    }
  };

  const renderContent = () => {
    if (activeTab === "input") {
      return (
        <div className="flex flex-col items-center">
            <FeatureMap
              data={inputSpectrogram.values}
              title={`Mel Spectrogram (${inputSpectrogram.shape.join(" x ")})`}
              spectrogram
            />
          <p className="mt-4 max-w-2xl text-center text-sm text-stone-500">
            The Mel Spectrogram represents the audio frequency content over time.
            The x-axis is time, and the y-axis is frequency (Mel scale).
            Brighter colors indicate higher energy in that frequency band.
          </p>
        </div>
      );
    }

    const layers = getLayersForTab(activeTab);

    if (layers.length === 0) {
      return (
        <div className="flex h-40 items-center justify-center text-stone-400">
          No layers found for this section.
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
        {layers.map(([mainName, mainData]) => (
          <div key={mainName} className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-stone-900">{mainName}</h4>
              <FeatureMap
                data={mainData.values}
                title={`${mainData.shape.join(" x ")}`}
              />
            </div>

            {internals[mainName] && (
              <div className="space-y-2">
                 <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Internal Activations</p>
                <div className="max-h-60 space-y-4 overflow-y-auto rounded border border-stone-100 bg-stone-50/50 p-2 scrollbar-thin scrollbar-thumb-stone-200">
                  {internals[mainName]
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([layerName, layerData]) => (
                      <FeatureMap
                        key={layerName}
                        data={layerData.values}
                        title={layerName.replace(`${mainName}.`, "")}
                        internal={true}
                      />
                    ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="overflow-hidden border-stone-200 shadow-sm">
      <div className="border-b border-stone-200 bg-stone-50/50 px-6 pt-4">
        <div className="flex space-x-6 overflow-x-auto pb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "border-b-2 pb-3 text-sm font-medium transition-colors hover:text-stone-900 focus:outline-none",
                activeTab === tab.id
                  ? "border-stone-900 text-stone-900"
                  : "border-transparent text-stone-500"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <CardContent className="min-h-[400px] bg-white p-6">
        {renderContent()}
        <div className="mt-8 flex justify-end border-t border-stone-100 pt-4">
           <div className="flex items-center gap-2">
               <span className="text-xs text-stone-400">Low Activation</span>
               <ColorScale width={150} height={12} min={-1} max={1} />
               <span className="text-xs text-stone-400">High Activation</span>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}
