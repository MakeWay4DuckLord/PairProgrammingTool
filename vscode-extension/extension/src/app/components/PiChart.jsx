import { Chart } from "react-google-charts";
import React from 'react';
import styles from '../styles/PiChart.module.css';

const PiChart = ({subject, metric, subject1, subject2, val1, val2, title}) => {
    const [data, setData] = React.useState([[subject, metric], [subject1, val1], [subject2, val2]]);
    return (
    <Chart 
    chartType="PieChart" 
    title=""
    data={data}
    className={styles.piChart}
    width={'110%'}
    height={'90%'}
    options={{
        backgroundColor: 'transparent'
    }}
    />)
}

export default PiChart;