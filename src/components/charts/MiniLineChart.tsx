
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis
} from 'recharts';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent
} from "@/components/ui/chart";
import { chartConfig, sampleData } from '@/utils/chartConfig';

const MiniLineChart = () => {
  return (
    <ChartContainer config={chartConfig} className="h-full">
      <LineChart data={sampleData}>
        <XAxis dataKey="name" hide />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line 
          type="monotone" 
          dataKey="value" 
          name="Primary" 
          stroke="var(--color-primary)" 
          strokeWidth={2} 
          dot={false} 
        />
      </LineChart>
    </ChartContainer>
  );
};

export default MiniLineChart;
