type MetricDatum = {
  label: string;
  value: number;
  color: string;
};

type TrendPoint = {
  label: string;
  value: number;
};

export function DepartmentBarChart({ data }: { data: MetricDatum[] }) {
  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.label}>
          <div className="mb-1 flex items-center justify-between text-[11px] text-slate-300">
            <span>{item.label}</span>
            <span className="font-mono text-slate-400">{item.value}</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800/80">
            <div
              className="h-full rounded-full"
              style={{ width: `${(item.value / max) * 100}%`, background: item.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DonutChart({ data }: { data: MetricDatum[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const chartTotal = total || 1;
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 140 140" className="h-32 w-32">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#1f2937" strokeWidth="14" />
        {data.map((item) => {
          const dash = (item.value / chartTotal) * circumference;
          const nextOffset = offset - dash;
          const circle = (
            <circle
              key={item.label}
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth="14"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(-90 70 70)"
            />
          );
          offset = nextOffset;
          return circle;
        })}
        <text x="70" y="72" textAnchor="middle" fill="#f8fafc" fontSize="22" fontWeight="700">
          {total}
        </text>
        <text x="70" y="90" textAnchor="middle" fill="#94a3b8" fontSize="11">
          total
        </text>
      </svg>

      <div className="space-y-2 text-xs text-slate-300">
        {data.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
            <span>{item.label}</span>
            <span className="ml-auto font-mono text-slate-400">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LineChart({ data }: { data: TrendPoint[] }) {
  const max = Math.max(...data.map((item) => item.value), 1);
  const min = Math.min(...data.map((item) => item.value), 0);
  const points = data
    .map((item, index) => {
      const x = (index / Math.max(data.length - 1, 1)) * 220;
      const y = 90 - ((item.value - min) / Math.max(max - min, 1)) * 70;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="space-y-3">
      <svg viewBox="0 0 220 100" className="h-28 w-full">
        <path d="M 0 90 L 220 90" stroke="#334155" strokeWidth="1" />
        <polyline
          fill="none"
          stroke="#60a5fa"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={points}
        />
        {data.map((point, index) => {
          const x = (index / Math.max(data.length - 1, 1)) * 220;
          const y = 90 - ((point.value - min) / Math.max(max - min, 1)) * 70;
          return <circle key={point.label} cx={x} cy={y} r="3" fill="#93c5fd" />;
        })}
      </svg>
      <div className="flex justify-between text-[10px] uppercase tracking-wide text-slate-400">
        {data.map((point) => (
          <span key={point.label}>{point.label}</span>
        ))}
      </div>
    </div>
  );
}

export function ColumnChart({ data }: { data: MetricDatum[] }) {
  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className="flex h-36 items-end gap-3">
      {data.map((item) => (
        <div key={item.label} className="flex flex-1 flex-col items-center justify-end gap-2">
          <span className="text-[10px] font-mono text-slate-400">{item.value}</span>
          <div
            className="w-full rounded-t-xl"
            style={{ height: `${(item.value / max) * 100}%`, background: item.color }}
          />
          <span className="text-[10px] uppercase tracking-wide text-slate-400">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
