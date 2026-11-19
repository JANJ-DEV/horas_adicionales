import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { localDateValue, type StatisticsPeriod } from "./calculations";

type StatisticsRow = {
  key: string;
  label: string;
  count: number;
  totalHoursDecimal: number;
  totalSalary: number;
};
type Metric = "totalHoursDecimal" | "totalSalary" | "count";
type ChartKind = "bar" | "line" | "pie";
const colors = [
  "#ff7a45",
  "#22b5cf",
  "#8aaf67",
  "#d5a051",
  "#ae89cb",
  "#e8798e",
  "#5ca1dd",
  "#b0b764",
  "#bd8c63",
  "#619e9d",
  "#d493bf",
  "#91a2cf",
];

const StatisticsChart = ({
  rows,
  start,
  end,
  period,
  metric,
  kind,
}: {
  rows: StatisticsRow[];
  start: Date;
  end: Date;
  period: StatisticsPeriod;
  metric: Metric;
  kind: ChartKind;
}) => {
  const monthly = period === "year" || period === "semester" || period === "quarter";
  const byKey = new Map(rows.map((row) => [row.key, row]));
  const buckets: StatisticsRow[] = [];
  const cursor = new Date(start);
  while (cursor < end) {
    const key = monthly ? localDateValue(cursor).slice(0, 7) : localDateValue(cursor);
    const label = new Intl.DateTimeFormat(
      "es-ES",
      monthly ? { month: "short" } : { day: "numeric", month: "short" }
    ).format(cursor);
    const row = byKey.get(key);
    buckets.push({
      key,
      label,
      count: row?.count ?? 0,
      totalHoursDecimal: row?.totalHoursDecimal ?? 0,
      totalSalary: row?.totalSalary ?? 0,
    });
    if (monthly) cursor.setMonth(cursor.getMonth() + 1);
    else cursor.setDate(cursor.getDate() + 1);
  }
  const data = kind === "pie" ? buckets.filter((row) => row[metric] > 0) : buckets;
  if (kind === "pie" && data.length === 0)
    return (
      <p className="py-8 text-sm text-[var(--text-muted)]">
        No hay valores para mostrar en el gráfico circular.
      </p>
    );
  const metricLabel =
    metric === "count" ? "Jornadas" : metric === "totalSalary" ? "Sueldo estimado (€)" : "Horas";
  return (
    <div
      role="img"
      aria-label={`Gráfico de ${metricLabel.toLowerCase()}; los valores también están disponibles en la tabla inferior.`}
      className="h-72 w-full min-w-0 sm:h-80"
    >
      <ResponsiveContainer width="100%" height="100%">
        {kind === "pie" ? (
          <PieChart accessibilityLayer>
            <Tooltip
              contentStyle={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
            />
            <Pie
              data={data}
              dataKey={metric}
              nameKey="label"
              name={metricLabel}
              outerRadius="80%"
              label={data.length <= 6}
            >
              {data.map((entry, index) => (
                <Cell key={entry.key} fill={colors[index % colors.length]} />
              ))}
            </Pie>
          </PieChart>
        ) : kind === "line" ? (
          <LineChart
            data={data}
            accessibilityLayer
            margin={{ top: 10, right: 12, left: 0, bottom: 5 }}
          >
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tick={{ fill: "var(--text-muted)", fontSize: 11 }}
              minTickGap={18}
            />
            <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} width={48} />
            <Tooltip
              contentStyle={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
            />
            <Line
              name={metricLabel}
              type="monotone"
              dataKey={metric}
              stroke="var(--accent)"
              strokeWidth={3}
              dot={{ r: 3 }}
              isAnimationActive={false}
            />
          </LineChart>
        ) : (
          <BarChart
            data={data}
            accessibilityLayer
            margin={{ top: 10, right: 12, left: 0, bottom: 5 }}
          >
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tick={{ fill: "var(--text-muted)", fontSize: 11 }}
              minTickGap={18}
            />
            <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} width={48} />
            <Tooltip
              contentStyle={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
            />
            <Bar
              name={metricLabel}
              dataKey={metric}
              fill="var(--accent)"
              isAnimationActive={false}
            />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};
export default StatisticsChart;
