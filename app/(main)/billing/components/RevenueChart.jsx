import { LineChart, Line, XAxis, YAxis } from "recharts";

export default function RevenueChart({ data }) {
  return (
    <LineChart width={500} height={300} data={data}>
      <XAxis dataKey="date" />
      <YAxis />
      <Line dataKey="revenue" stroke="#2563eb" />
    </LineChart>
  );
}
