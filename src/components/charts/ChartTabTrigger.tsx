
import React from 'react';
import { TabsTrigger } from "@/components/ui/tabs";
import { LucideIcon } from 'lucide-react';

interface ChartTabTriggerProps {
  value: string;
  label: string;
  icon: LucideIcon;
}

const ChartTabTrigger = ({ value, label, icon: Icon }: ChartTabTriggerProps) => {
  return (
    <TabsTrigger value={value} className="flex items-center gap-2">
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </TabsTrigger>
  );
};

export default ChartTabTrigger;
