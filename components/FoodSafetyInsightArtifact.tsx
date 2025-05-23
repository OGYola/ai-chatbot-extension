'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { cn } from '@/lib/utils';

interface FoodSafetyData {
  category: string;
  incidents: number;
}

interface FoodSafetyInsightArtifactProps {
  data: FoodSafetyData[];
}

// More sophisticated color palette
const COLORS = {
  'Salmonella': '#ef4444',    // red-500
  'E. coli': '#f97316',        // orange-500
  'Listeria': '#eab308',       // yellow-500
  'Norovirus': '#3b82f6',      // blue-500
  'Campylobacter': '#8b5cf6', // violet-500
  default: '#6b7280'           // gray-500
};

export function FoodSafetyInsightArtifact({ data }: FoodSafetyInsightArtifactProps) {
  const sortedData = [...data].sort((a, b) => b.incidents - a.incidents);
  const maxIncidents = Math.max(...data.map(d => d.incidents));
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / data.reduce((sum, item) => sum + item.incidents, 0)) * 100).toFixed(1);
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3">
          <p className="font-semibold text-foreground">{label}</p>
          <p className="text-sm text-muted-foreground">
            Incidents: <span className="font-bold text-foreground">{payload[0].value}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            {percentage}% of total cases
          </p>
        </div>
      );
    }
    return null;
  };

  const totalIncidents = data.reduce((sum, item) => sum + item.incidents, 0);

  return (
    <div className={cn(
      "w-full p-6 rounded-lg border",
      "bg-background border-border"
    )}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Food Safety Incidents by Pathogen Type
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Q4 2024 Contamination Report
        </p>
      </div>
      
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={sortedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            className="stroke-muted-foreground/20"
          />
          <XAxis 
            dataKey="category" 
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fill: 'currentColor' }}
            className="text-muted-foreground text-xs"
          />
          <YAxis 
            label={{ 
              value: '# of Incidents', 
              angle: -90, 
              position: 'insideLeft',
              style: { fill: 'currentColor' },
            }}
            tick={{ fill: 'currentColor' }}
            className="text-muted-foreground text-xs"
          />
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ fill: 'currentColor', opacity: 0.05 }}
          />
          <Bar 
            dataKey="incidents" 
            radius={[8, 8, 0, 0]}
            animationDuration={1000}
          >
            {sortedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[entry.category as keyof typeof COLORS] || COLORS.default}
                className="hover:opacity-80 transition-opacity"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="text-center p-3 rounded-lg bg-muted/50">
          <p className="text-2xl font-bold text-foreground">{totalIncidents}</p>
          <p className="text-xs text-muted-foreground">Total Incidents</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-muted/50">
          <p className="text-2xl font-bold text-foreground">
            {sortedData[0]?.category || 'N/A'}
          </p>
          <p className="text-xs text-muted-foreground">Most Common</p>
        </div>
      </div>
    </div>
  );
}