const InvoiceProgressBar = ({ total, paid }) => {
  const progress = Math.min((paid / total) * 100, 100);

  let barColor = "bg-danger";
  if (progress >= 100) barColor = "bg-success";
  else if (progress >= 25) barColor = "bg-warning";

  return (
    <div className="progress" style={{ height: "20px" }}>
      <div
        className={`progress-bar ${barColor}`}
        role="progressbar"
        style={{ width: `${progress}%` }}
      >
        {progress.toFixed(0)}%
      </div>
    </div>
  );
};
export default InvoiceProgressBar;