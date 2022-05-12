import "./index.css";
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";


const PricesChart = ({ data }) => {

    return (
        <ResponsiveContainer width="100%" height="100%">
            <div className="chart-container">
                <LineChart width={500} height={150} data={data} >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="price" stroke="#2b2b2b" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
            </div>
        </ResponsiveContainer>
    );
};

export default PricesChart;
