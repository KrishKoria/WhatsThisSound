"use client";

import React from "react";
import AudioPlayer from "./AudioPlayer";
import LayerExplorer from "./LayerExplorer";
import Waveform from "./Waveform";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { getEmojiForClass, type ApiResponse } from "~/lib/model-helpers";

interface ResultsDashboardProps {
  data: ApiResponse;
  audioUrl: string | null;
  onReset: () => void;
}

export default function ResultsDashboard({
  data,
  audioUrl,
  onReset,
}: ResultsDashboardProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Audio & Waveform - spans 7 cols */}
        <div className="space-y-6 lg:col-span-7">
          <Card className="border-stone-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium text-stone-900">
                Audio Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <AudioPlayer audioUrl={audioUrl} />
              <div className="rounded-lg border border-stone-100 bg-stone-50 p-4">
                 <Waveform
                  data={data.waveform.values}
                  title={`${data.waveform.duration.toFixed(2)}s • ${data.waveform.sample_rate}Hz`}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Predictions - spans 5 cols */}
        <div className="space-y-6 lg:col-span-5">
          <Card className="h-full border-stone-200 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium text-stone-900">
                  Model Predictions
                </CardTitle>
                <Badge variant="outline" className="font-mono text-xs">
                  {data.predictions[0]?.class}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {data.predictions.slice(0, 5).map((pred, i) => (
                  <div key={pred.class} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 font-medium text-stone-700">
                        <span className="text-lg" role="img" aria-label={pred.class}>
                          {getEmojiForClass(pred.class)}
                        </span>
                        <span className="capitalize">
                          {pred.class.replaceAll("_", " ")}
                        </span>
                      </div>
                      <span className="font-mono text-stone-500">
                        {(pred.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress
                      value={pred.confidence * 100}
                      className={i === 0 ? "h-2.5 bg-stone-100" : "h-1.5 bg-stone-100"}
                      // Customizing the indicator color based on confidence rank
                      // This requires direct style manipulation or tailored classNames if supported
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section: Layer Explorer */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-light tracking-tight text-stone-900">
            Internal Representations
          </h2>
          <p className="text-sm text-stone-500">
            Explore how the network processes sound
          </p>
        </div>
        <LayerExplorer
          visualization={data.visualization}
          inputSpectrogram={data.input_spectrogram}
        />
      </div>
      
       <div className="flex justify-center pt-8">
            <button 
                onClick={onReset}
                className="text-sm text-stone-400 hover:text-stone-600 underline decoration-stone-300 underline-offset-4 transition-colors"
            >
                Upload another file
            </button>
        </div>
    </div>
  );
}
