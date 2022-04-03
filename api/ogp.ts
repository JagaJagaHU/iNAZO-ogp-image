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

const validateData = (data: Array<Number>): Boolean => {
    let isAllNumber = true;
    data.forEach(x => {
        isAllNumber = (typeof x === 'number') && isAllNumber;
    });
    return (data.length === 11) && isAllNumber;
}

export default async (req: VercelRequest, res: VercelResponse) => {

    const width = Number(req.query.width) || 1200;
    const height = Number(req.query.height) || 630;
    const queryData: String = new String(req.query.data);
    const data = queryData.split(',').map(x => Number(x));
    const title = req.query.title || '';
    const titleFontSize = title.length > 50 ? 24 : 36;
    const subtitle = req.query.subtitle || '';
    const subtitleFontSize = subtitle.length > 50 ? 24 : 36;

    if (validateData(data) === false) {
        res.status(400).send("validate error");
        return;
    }

    if (width < 600 || 2000 < width || height < 600 || 2000 < height) {
        res.status(400).send("need [100px <= width and height <= 2000px]");
        return;
    }
    
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, chartCallback: (ChartJS) => {
        ChartJS.defaults.font.size = 24;
        ChartJS.defaults.font.family = 'NotoSansJP-Black';
    } });

    chartJSNodeCanvas.registerFont('./fonts/NotoSansJP-Black.otf', { family: 'NotoSansJP-Black' });

    const configuration = {
        type: 'bar',
        data: {
            labels: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D', 'D-', 'F'],
            datasets: [{
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
            layout: {
                padding: {
                    top: 10,
                    right: 30,
                    bottom: 30,
                    left: 30,
                }
            },
            scales: {
                yAxis: {
                    ticks: {
                        beginAtZero: true,
                        precision: 0,
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: titleFontSize
                    },
                    padding: {
                        top: 30,
                        bottom: 10,
                    }
                },
                subtitle: {
                    display: subtitle !== '', // subtitleがなかったら表示しない
                    text: subtitle,
                    font: {
                        size: subtitleFontSize,
                    },
                    padding: {
                        bottom: 20
                    }
                },
                legend: {
                    display: false,
                },
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