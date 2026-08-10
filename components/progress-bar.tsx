export function ProgressBar({ value, label }: { value: number; label?: string }) {
  return (
    <div className="progress-wrap">
      <div className="progress-copy">
        <span>{label ?? "Course progress"}</span>
        <strong>{value}%</strong>
      </div>
      <div className="progress-track" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={label ?? "Course progress"}>
        <span style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
