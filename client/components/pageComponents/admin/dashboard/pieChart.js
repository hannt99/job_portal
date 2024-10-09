'use client';

import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, Tooltip, Title, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, Tooltip, Title, Legend);

const PieChart = ({ employers, candidates }) => {
    const data = {
        labels: ['Nhà tuyển dụng', 'Ứng viên'],
        datasets: [
            {
                label: 'Số lượng',
                data: [employers, candidates],
                backgroundColor: ['rgba(255, 87, 34, 0.9)', 'rgba(54, 162, 235, 0.2)'],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        maintainAspectRatio: false,
        scales: {},
        plugins: {
            title: {
                display: true,
                text: 'Biểu đồ thống kê người dùng hệ thống',
            },
        },
    };

    return (
        <div>
            <Pie height={400} options={options} data={data} />
        </div>
    );
};

export default PieChart;
