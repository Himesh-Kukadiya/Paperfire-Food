import { useEffect, useState } from 'react';
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill } from 'react-icons/bs'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import axios from 'axios';
function Dashboard() {
    const [counters, setCounters] = useState({});
    const [graphData, setGraphData] = useState({});

    useEffect(() => {
        axios.get("http://localhost:7575/api/admin/getCounters")
        .then(res => setCounters(res.data))
        .catch(err => console.error("Error fetching counters:", err));

        axios.get("http://localhost:7575/api/admin/getGraphData")
        .then(res => {
            setTimeout(() => {
                setGraphData(res.data)
            }, 2000)
        })
        .catch(err => console.error("Error fetching graph data:", err));
    }, [])

    useEffect(() => {
        console.log(graphData.barGraph)
    }, [graphData])
    const data = [
        {
            name: 'Page A',
            uv: 4000,
            pv: 2400,
            amt: 2400,
        },
        {
            name: 'Page B',
            uv: 3000,
            pv: 1398,
            amt: 2210,
        },
        {
            name: 'Page C',
            uv: 2000,
            pv: 9800,
            amt: 2290,
        },
        {
            name: 'Page D',
            uv: 2780,
            pv: 3908,
            amt: 2000,
        },
        {
            name: 'Page E',
            uv: 1890,
            pv: 4800,
            amt: 2181,
        },
        {
            name: 'Page F',
            uv: 2390,
            pv: 3800,
            amt: 2500,
        },
        {
            name: 'Page G',
            uv: 3490,
            pv: 4300,
            amt: 2100,
        },
    ];


    return (
        <main className='main-container'>
            <div className='main-cards'>
                <div className='card'>
                    <div className='card-inner'>
                        <span className='title'>TOTAL PRODUCTS</span>
                        <BsFillArchiveFill className='card_icon' />
                    </div>
                    <span className='data'>{counters.totProducts}</span>
                </div>
                <div className='card'>
                    <div className='card-inner'>
                            <span className='title'>Products on Rent</span>
                        <BsFillGrid3X3GapFill className='card_icon' />
                    </div>
                    <span className='data'>{counters.totRents}</span>
                </div>
                <div className='card'>
                    <div className='card-inner'>
                            <span className='title'>Total Users</span>
                        <BsPeopleFill className='card_icon' />
                    </div>
                    <span className='data'>{counters.totUsers}</span>
                </div>
                <div className='card'>
                    <div className='card-inner'>
                            <span className='title'>Total Revenue</span>
                        <BsFillBellFill className='card_icon' />
                    </div>
                    <span className='data'>{counters.totRevenue}</span>
                </div>
            </div>

            <div className='charts'>
                <div className="chart-box">
                    <h3 className="chart-title">Total Monthly Revenue</h3>
                    <div className="chart-inner d-flex align-items-center justify-content-center">
                    {graphData.barGraph === undefined 
                    ? <>
                        <span class="loader"></span>
                    </>
                    : <>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={graphData.barGraph}
                                margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                {/* <Bar dataKey="totalRevenue" fill="#8884d8" /> */}
                                <Bar dataKey="totalRevenue" fill="#82ca9d" />
                                {/* <Bar dataKey="totalRevenue" fill="#FFE6A5" /> */}
                            </BarChart>
                        </ResponsiveContainer>
                    </>}
                    </div>
                </div>

                <div className="chart-box ">
                    <h3 className="chart-title">Line Chart Overview</h3>
                    <div className="chart-inner d-flex align-items-center justify-content-center">
                    {graphData.lineChart === undefined 
                    ? <>
                        <span class="loader"></span>
                    </>
                    : <>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={graphData.lineChart}
                                margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                {/* <Line type="monotone" dataKey="totalRevenue" stroke="#8884d8" activeDot={{ r: 8 }} /> */}
                                <Line type="monotone" dataKey="cumulativeRent" stroke="#82ca9d" activeDot={{ r: 8 }} />
                                {/* <Line type="monotone" dataKey="cumulativeRent" stroke="#FFE6A5" activeDot={{ r: 8 }}/> */}
                            </LineChart>
                        </ResponsiveContainer>
                    </>}
                    </div>
                </div>
            </div>        </main>
    )
}

export default Dashboard