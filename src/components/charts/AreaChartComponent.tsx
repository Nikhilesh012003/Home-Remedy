
import React from 'react';
import { 
  AreaChart, 
  Area, 
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

const AreaChartComponent = () => {
  return (
    <ChartContainer config={chartConfig} className="h-full">
      <AreaChart data={sampleData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Area 
          type="monotone" 
          dataKey="value" 
          name="Primary" 
          fill="var(--color-primary)" 
          stroke="var(--color-primary)" 
          fillOpacity={0.6} 
        />
        <Area 
          type="monotone" 
          dataKey="value2" 
          name="Secondary" 
          fill="var(--color-secondary)" 
          stroke="var(--color-secondary)" 
          fillOpacity={0.6} 
        />
        <Area 
          type="monotone" 
          dataKey="value3" 
          name="Tertiary" 
          fill="var(--color-tertiary)" 
          stroke="var(--color-tertiary)" 
          fillOpacity={0.6} 
        />
      </AreaChart>
    </ChartContainer>
  );
};

export default AreaChartComponent;
