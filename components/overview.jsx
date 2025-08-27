"use client"

import { useState, useEffect } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts"
import { Skeleton } from "./ui/skeleton"
import { useMonthlyRevenue } from "../hooks/use-dashboard-queries"

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-lg p-3 shadow-lg animate-fade-in">
        <p className="font-semibold text-sm">{`${label} 2024`}</p>
        <p className="text-primary text-sm">
          Revenue: <span className="font-bold">OMR {payload[0].value.toLocaleString()}</span>
        </p>
        <p className="text-muted-foreground text-xs">Target: OMR {payload[0].payload.target.toLocaleString()}</p>
      </div>
    )
  }
  return null
}

export function Overview() {
  const [animationComplete, setAnimationComplete] = useState(false)
  const { data: monthlyData, isLoading, error } = useMonthlyRevenue()

  useEffect(() => {
    const timer = setTimeout(() => setAnimationComplete(true), 500)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="w-full">
        <Skeleton className="w-full h-[350px]" />
        <div className="flex items-center justify-center space-x-6 mt-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-[350px] flex items-center justify-center text-muted-foreground">
        <p>Failed to load revenue data</p>
      </div>
    )
  }

  if (!monthlyData) {
    return (
      <div className="w-full h-[350px] flex items-center justify-center text-muted-foreground">
        <p>No revenue data available</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis
            dataKey="name"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            className="text-muted-foreground"
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `OMR ${value}`}
            className="text-muted-foreground"
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="total"
            radius={[6, 6, 0, 0]}
            className="transition-all duration-300"
            animationDuration={1000}
            animationBegin={0}
          >
            {monthlyData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.total >= entry.target
                    ? "hsl(var(--primary))"
                    : index % 2 === 0
                      ? "hsl(var(--primary) / 0.8)"
                      : "hsl(var(--accent))"
                }
                className="hover:opacity-80 transition-opacity duration-200"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-4 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-sm bg-primary"></div>
          <span className="text-muted-foreground">Revenue</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-sm bg-accent"></div>
          <span className="text-muted-foreground">Below Target</span>
        </div>
      </div>
    </div>
  )
}
