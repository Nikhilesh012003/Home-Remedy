
import React from 'react';
import { 
  BarChart, 
  Bar, 
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

const BarChartComponent = () => {
  return (
    <ChartContainer config={chartConfig} className="h-full">
      <BarChart data={sampleData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="value" name="Primary" fill="var(--color-primary)" />
        <Bar dataKey="value2" name="Secondary" fill="var(--color-secondary)" />
        <Bar dataKey="value3" name="Tertiary" fill="var(--color-tertiary)" />
      </BarChart>
    </ChartContainer>
  );
};

export default BarChartComponent;
