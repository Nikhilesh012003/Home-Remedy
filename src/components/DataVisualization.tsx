import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, LineChart as LineChartIcon, Activity, ChartPie } from 'lucide-react';

import BarChartComponent from './charts/BarChartComponent';
import LineChartComponent from './charts/LineChartComponent';
import AreaChartComponent from './charts/AreaChartComponent';
import PieChartComponent from './charts/PieChartComponent';
import MiniPieChart from './charts/MiniPieChart';
import MiniLineChart from './charts/MiniLineChart';
import ChartTabTrigger from './charts/ChartTabTrigger';

const DataVisualization = () => {
  const [activeTab, setActiveTab] = useState('bar');
  
  return (
    <div 
      className="min-h-screen pb-4 md:pb-8"
      style={{ 
        backgroundImage: "url('/photo-1470813740244-df37b8c1edcb')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      <div className="container mx-auto p-2 md:p-4 backdrop-blur-sm bg-background/80">
        <h1 className="text-xl md:text-3xl font-bold mb-4 md:mb-6 pt-2 md:pt-4 text-center">Data Visualization Dashboard</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4 overflow-x-auto">
            <ChartTabTrigger value="bar" label="Bar" icon={BarChart3} />
            <ChartTabTrigger value="line" label="Line" icon={LineChartIcon} />
            <ChartTabTrigger value="area" label="Area" icon={Activity} />
            <ChartTabTrigger value="pie" label="Pie" icon={ChartPie} />
          </TabsList>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="backdrop-blur-md bg-card/90 border border-border/50">
              <CardHeader className="p-3 md:p-6">
                <CardTitle className="text-lg md:text-xl">Monthly Performance</CardTitle>
                <CardDescription>
                  Visualization of performance metrics over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-60 md:h-80 p-2 md:p-4">
                <TabsContent value="bar" className="h-full">
                  <BarChartComponent />
                </TabsContent>
                
                <TabsContent value="line" className="h-full">
                  <LineChartComponent />
                </TabsContent>
                
                <TabsContent value="area" className="h-full">
                  <AreaChartComponent />
                </TabsContent>
                
                <TabsContent value="pie" className="h-full">
                  <PieChartComponent />
                </TabsContent>
              </CardContent>
            </Card>
            
            <div className="grid gap-4 grid-rows-2">
              <Card className="backdrop-blur-md bg-card/90 border border-border/50">
                <CardHeader className="p-3 md:p-6">
                  <CardTitle className="text-lg md:text-xl">Performance Breakdown</CardTitle>
                  <CardDescription>Category distribution</CardDescription>
                </CardHeader>
                <CardContent className="h-32 md:h-40 p-2 md:p-4">
                  <MiniPieChart />
                </CardContent>
              </Card>
              
              <Card className="backdrop-blur-md bg-card/90 border border-border/50">
                <CardHeader className="p-3 md:p-6">
                  <CardTitle className="text-lg md:text-xl">Trend Analysis</CardTitle>
                  <CardDescription>Last 7 periods</CardDescription>
                </CardHeader>
                <CardContent className="h-32 md:h-40 p-2 md:p-4">
                  <MiniLineChart />
                </CardContent>
              </Card>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default DataVisualization;
