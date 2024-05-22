import { useState, useEffect } from 'react';
import axios from 'axios';
import "./LineGraph.css";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LineGraph = () => {
    const [graphData, setGraphData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/salaries');
            const data = response.data.reduce((acc, curr) => {
                acc.push({
                    year: curr.work_year,
                    totalJobs: curr.totalJobs
                });
                return acc;
            }, []);
            setGraphData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div className="line-graph-container">
            <h3 className="line-graph-h3">Number of Jobs from 2020 to 2024</h3>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={graphData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="totalJobs" stroke="#8884d8" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default LineGraph;
