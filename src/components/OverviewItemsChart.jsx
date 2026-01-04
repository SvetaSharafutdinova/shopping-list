import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function OverviewItemsChart({ lists, title }) {
  const data = useMemo(() => {
    return lists.map((l) => ({ name: l.name, items: l.itemsCount }));
  }, [lists]);

  return (
    <div className="ChartCard">
      <div className="ChartTitle">{title}</div>
      <div className="ChartWrap">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data}>
            <XAxis dataKey="name" hide />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="items" fill="#8bc34a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default OverviewItemsChart;
