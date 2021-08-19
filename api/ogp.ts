/*
 * "NotoSansJP-Black" is lisenced under the SIL Open Font License 1.1
 * https://fonts.google.com/attribution
 * http://scripts.sil.org/OFL
 */

const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const canvas = require('canvas'); // point
import { VercelRequest, VercelResponse } from '@vercel/node';

const plugin = {
    id: 'custom_canvas_background_color',
    beforeDraw: (chart) => {
        const ctx = chart.canvas.getContext('2d');
        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, chart.width, chart.height);
        ctx.restore();
    }
};

const validata = (data: Array<Number>): Boolean => {
    let isAllNumber = true;
    data.forEach(x => {
        isAllNumber = (typeof x === 'number') && isAllNumber;
    });
    return (data.length === 11) && isAllNumber;
}

export default async (req: VercelRequest, res: VercelResponse) => {
    const width = 1200;
    const height = 630;
    const query: String = new String(req.query.data);
    const data = query.split(',').map(x => Number(x));

    if (validata(data) === false) {
        res.end("validata error");
    }
    
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, chartCallback: (ChartJS) => {
        ChartJS.defaults.font.family = 'NotoSansJP-Black';
    } });

    chartJSNodeCanvas.registerFont('./fonts/NotoSansJP-Black.otf', { family: 'NotoSansJP-Black' });

    const configuration = {
        type: 'bar',
        data: {
            labels: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D', 'D-', 'F'],
            datasets: [{
                label: '人数',
                data: data,
                backgroundColor: [
                    'rgba(33, 150, 243, 1)',
                    'rgba(33, 150, 243, 1)',
                    'rgba(33, 150, 243, 1)',
                    'rgba(187, 222, 251, 1)',
                    'rgba(187, 222, 251, 1)',
                    'rgba(187, 222, 251, 1)',
                    'rgba(255, 152, 0, 1)',
                    'rgba(255, 152, 0, 1)',
                    'rgba(244, 67, 54, 1)',
                    'rgba(244, 67, 54, 1)',
                    'rgba(244, 67, 54, 1)',
                ],
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        callback: (value) => '$' + value
                    }
                }]
            }
        },
        plugins: [plugin],
    };
    
    const buffer = await chartJSNodeCanvas.renderToBuffer(configuration);
    res.writeHead(200, {
        "Content-Type": "image/png",
        "Content-Length": buffer.length,
    });
    res.end(buffer, "binary");
}