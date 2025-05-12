
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";
import { chartConfig, sampleData } from '@/utils/chartConfig';

const LineChartComponent = () => {
  return (
    <ChartContainer config={chartConfig} className="h-full">
      <LineChart data={sampleData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line 
          type="monotone" 
          dataKey="value" 
          name="Primary" 
          stroke="var(--color-primary)" 
          strokeWidth={2} 
        />
        <Line 
          type="monotone" 
          dataKey="value2" 
          name="Secondary" 
          stroke="var(--color-secondary)" 
          strokeWidth={2} 
        />
        <Line 
          type="monotone" 
          dataKey="value3" 
          name="Tertiary" 
          stroke="var(--color-tertiary)" 
          strokeWidth={2} 
        />
      </LineChart>
    </ChartContainer>
  );
};

export default LineChartComponent;
