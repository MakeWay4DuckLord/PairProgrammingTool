import { Chart } from "react-google-charts";
import React from 'react';
import styles from '../styles/PiChart.module.css';

const PiChart = ({subject, metric, subject1, subject2, val1, val2}) => {
    const [data, setData] = React.useState([[subject, metric], [subject1, parseInt(val1)], [subject2, parseInt(val2)]]);

    React.useEffect(() => {
        setData([[subject, metric], [subject1, parseInt(val1)], [subject2, parseInt(val2)]]);
    }, [val1, val2])
    return (
    <>
        {val1 === 0 && val2 === 0 && <span className={styles.absolute}>No data to display!</span>}
        <Chart 
        chartType="PieChart" 
        title=""
        data={data}
        className={styles.piChart}
        width={'110%'}
        height={'90%'}
        options={{
            backgroundColor: 'transparent',
            sliceVisibilityThreshold: val1 !== 0 || val2 !== 0 ? 0 : 1,
        }}
        />
    </>)
}

export default PiChart;