import React, { useEffect, useRef } from 'react';
import Plot from 'react-plotly.js';

interface PlotlyVisualizationProps {
  data: any;
}

export const PlotlyVisualization: React.FC<PlotlyVisualizationProps> = ({
  data
}) => {
  if (!data || !data.data) {
    return (
      <div className="w-full h-64 bg-muted/50 rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">No data to visualize</p>
      </div>
    );
  }

  return (
    <div className="w-full h-64 rounded-lg overflow-hidden border">
      <Plot
        data={data.data}
        layout={{
          ...data.layout,
          autosize: true,
          margin: { l: 40, r: 40, t: 40, b: 40 },
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)',
          font: { color: '#e2e8f0' }
        }}
        config={{
          displayModeBar: false,
          responsive: true
        }}
        style={{
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  );
};