import { tool } from 'ai';
import { z } from 'zod';

// comprehensive mock data for food safety incidents
const mockFoodSafetyData = {
  currentQuarter: [
    { category: 'Salmonella', incidents: 45, severity: 'high', trend: 'increasing' },
    { category: 'E. coli', incidents: 30, severity: 'high', trend: 'stable' },
    { category: 'Listeria', incidents: 15, severity: 'medium', trend: 'decreasing' },
    { category: 'Norovirus', incidents: 25, severity: 'medium', trend: 'increasing' },
    { category: 'Campylobacter', incidents: 20, severity: 'low', trend: 'stable' }
  ],
  // Additional data for richer insights
  previousQuarter: {
    total: 115,
    highestCategory: 'Salmonella',
    highestCount: 38
  }
};

export const foodSafetyInsightTool = tool({
  description: 'Show food safety incident data and trends. Use this when users ask about food safety trends, contamination incidents, foodborne illness statistics, or food safety analysis.',
  parameters: z.object({
    query: z.string().describe('The user query about food safety'),
  }),
  execute: async ({ query }) => {
    const data = mockFoodSafetyData.currentQuarter;
    
    // Calculate comprehensive insights
    const totalIncidents = data.reduce((sum, item) => sum + item.incidents, 0);
    const highestCategory = data.reduce((max, item) => 
      item.incidents > max.incidents ? item : max
    );
    const lowestCategory = data.reduce((min, item) => 
      item.incidents < min.incidents ? item : min
    );
    
    // Calculate percentage change from previous quarter
    const percentageChange = ((totalIncidents - mockFoodSafetyData.previousQuarter.total) / 
      mockFoodSafetyData.previousQuarter.total * 100).toFixed(1);
    
    // Count trends
    const increasingCount = data.filter(item => item.trend === 'increasing').length;
    const highSeverityCount = data.filter(item => item.severity === 'high').length;
    
    // Generate contextual summary based on the query
    let summary = '';
    
    if (query.toLowerCase().includes('trend')) {
      summary = `Food safety incident trends for Q4 2024 show ${totalIncidents} total cases, a ${percentageChange}% ${Number(percentageChange) > 0 ? 'increase' : 'decrease'} from last quarter. ${highestCategory.category} remains the leading concern with ${highestCategory.incidents} cases${highestCategory.trend === 'increasing' ? ' and is trending upward' : ''}. ${increasingCount} out of 5 pathogen types are showing increasing trends.`;
    } else if (query.toLowerCase().includes('summary') || query.toLowerCase().includes('overview')) {
      summary = `In the past quarter, we tracked ${totalIncidents} food safety incidents across 5 major pathogen categories. ${highestCategory.category} led with ${highestCategory.incidents} cases (${(highestCategory.incidents / totalIncidents * 100).toFixed(1)}% of total), while ${lowestCategory.category} had the fewest at ${lowestCategory.incidents} cases. ${highSeverityCount} pathogens are classified as high severity.`;
    } else {
      summary = `Here's the latest food safety data: ${totalIncidents} total incidents this quarter. ${highestCategory.category} is the most common contaminant (${highestCategory.incidents} cases), followed by E. coli (${data[1].incidents} cases) and Norovirus (${data[3].incidents} cases). This represents a ${Math.abs(Number(percentageChange))}% ${Number(percentageChange) > 0 ? 'increase' : 'decrease'} from the previous quarter.`;
    }
    
    return {
      type: 'food-safety-chart',
      data: data.map(({ category, incidents }) => ({ category, incidents })), // Only send what's needed for the chart
      summary,
      insights: {
        total: totalIncidents,
        percentageChange,
        trending: increasingCount,
        highSeverity: highSeverityCount
      }
    };
  },
});