import { useEffect, useState } from 'react';
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill } from 'react-icons/bs'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function Dashboard() {
    const navigate = useNavigate();

    const [counters, setCounters] = useState({});
    const [graphData, setGraphData] = useState({});

    useEffect(() => {
        if(localStorage.getItem("PFFAdminData") === null) {
            navigate("/");
        }
    }, [])
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

    return (
        <section id="dashboard" className='main-container'>
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
            </div>        
        </section>
    )
}

export default Dashboard