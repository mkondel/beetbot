
import React from "react";
import PropTypes from "prop-types";

import { scaleTime } from "d3-scale";
import { utcDay } from "d3-time";
import { format } from 'd3-format';

import { ChartCanvas, Chart } from "react-stockcharts";
import {
    BarSeries,
    CandlestickSeries,
    // VolumeProfileSeries,
    // BollingerSeries,
    // RSISeries,
    // MACDSeries,
} from 'react-stockcharts/lib/series';
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last, timeIntervalBarWidth } from "react-stockcharts/lib/utils";

import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import {
    MouseCoordinateX,
    MouseCoordinateY,
    CrossHairCursor,
    EdgeIndicator,
} from 'react-stockcharts/lib/coordinates';

// class CandleStickChart extends React.Component {
	// render() {
class CandleStickChart extends React.Component {
    render() {
        const { type, data: initialData, ratio, width, height, candleCount } = this.props;
        // const xAccessor = d => d.date
        const xScaleProvider = discontinuousTimeScaleProvider
            .inputDateAccessor(d => d.date);
        const {
            data,
            xScale,
            xAccessor,
            displayXAccessor,
        } = xScaleProvider(initialData);

        const start = xAccessor(last(data));
        const end = xAccessor(data[Math.max(0, data.length - candleCount)]);

        const candleOffset = 2;
        const xExtents = [start + candleOffset, end];
        // console.log(`${xExtents}`)

        const crossHairStyles = {
            stroke: '#000000'
        }
        const candleStickStyles = {
            opacity: 1,
            wickStroke: '#000000',
            // stroke: '#FFFFFF77',
            // stroke: '#000000',
            // widthRatio: 0.5,
            candleStrokeWidth: 5,
            stroke: d => d.close > d.open ? '#6BA583' : '#FF0000',
            fill: d => d.close > d.open ? '#6BA583' : '#FF0000',
        }
        const coorinateStyles = {
            // fill: '#FFFFFF',
        }
        const edgeStyles = {
            lineStroke: 'white',
            fill: d => d.close > d.open ? '#6BA583' : '#FF0000',
        }

        return (
            <div>
                {/*<span>{JSON.stringify(data[0])}</span>*/}
                <ChartCanvas height={height}
                        ratio={ratio}
                        width={width}
                        margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
                        type={type}
                        seriesName="MSFT"
                        data={data}
                        xAccessor={xAccessor}
                        displayXAccessor={displayXAccessor}
                        xScale={xScale}
                        xExtents={xExtents}
                        >

                    <Chart id={1} 
                        yExtents={d => [d.high*1.001, d.low*0.999]}
                        height={height / 1.5}
                    >
                        <XAxis axisAt="bottom" orient="bottom" ticks={6}/>
                        <YAxis axisAt="left" orient="left" ticks={5} />
                        <CandlestickSeries {...candleStickStyles}/>
                        {/*<CandlestickSeries width={timeIntervalBarWidth(utcDay)}/>*/}

                        <EdgeIndicator
                            yAccessor={d => d.close} 
                            itemType='last'
                            orient='right'
                            edgeAt='right'
                            {...edgeStyles}
                        />
                        <CrossHairCursor {...crossHairStyles} />
                        {<MouseCoordinateY
                            at='left'
                            orient='left'
                            displayFormat={format('.2f')}
                            {...coorinateStyles}
                        />}
                    </Chart>

                    <Chart id={2} 
                        yExtents={d => [d.volume, 0]}
                        height={height / 4}
                        origin={(w, h) => [0, h - height/4]}
                    >
                        <XAxis axisAt="bottom" orient="bottom" ticks={6}/>
                        <YAxis axisAt="left" orient="left" ticks={5} />
                        <BarSeries yAccessor={d => d.volume}/>
                        <CrossHairCursor {...crossHairStyles} />
                    </Chart>
                </ChartCanvas>
            </div>
        );
    }
}

CandleStickChart.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickChart.defaultProps = {
	type: "svg",
};
CandleStickChart = fitWidth(CandleStickChart);

export default CandleStickChart;
