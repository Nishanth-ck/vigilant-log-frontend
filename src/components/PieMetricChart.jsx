import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
ChartJS.register(ArcElement, Tooltip);

export default function PieMetricChart({ labels, values, colors }) {
  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        borderColor: colors.map((c) => c.replace("0.4", "1")),
        borderWidth: 2,
      },
    ],
  };

  const options = {
    plugins: {
      legend: { display: false },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="w-36 h-36">
      <Pie data={data} options={options} />
    </div>
  );
}

