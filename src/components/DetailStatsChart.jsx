import React, { useMemo } from "react";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

function DetailStatsChart({ items, labels }) {
  const data = useMemo(() => {
    const done = items.filter((i) => i.isDone).length;
    const todo = items.length - done;
    return [
      { name: labels.todo, value: todo },
      { name: labels.done, value: done }
    ];
  }, [items, labels]);

  const COLORS = ["#ff9800", "#4caf50"];

  return (
    <div className="ChartCard">
      <div className="ChartTitle">{labels.title}</div>
      <div className="ChartWrap">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" outerRadius={80} innerRadius={45}>
              {data.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default DetailStatsChart;
