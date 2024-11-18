import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill } from 'react-icons/bs'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

function Dashboard() {

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
                    <span className='data'>300</span>
                </div>
                <div className='card'>
                    <div className='card-inner'>
                            <span className='title'>Products on Rent</span>
                        <BsFillGrid3X3GapFill className='card_icon' />
                    </div>
                    <span className='data'>12</span>
                </div>
                <div className='card'>
                    <div className='card-inner'>
                            <span className='title'>Total Users</span>
                        <BsPeopleFill className='card_icon' />
                    </div>
                    <span className='data'>33</span>
                </div>
                <div className='card'>
                    <div className='card-inner'>
                            <span className='title'>Total Revenue</span>
                        <BsFillBellFill className='card_icon' />
                    </div>
                    <span className='data'>42</span>
                </div>
            </div>

            <div className='charts'>
                <div className="chart-box">
                    <h3 className="chart-title">Bar Chart Overview</h3>
                    <div className="chart-inner">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={data}
                                margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="pv" fill="#8884d8" />
                                <Bar dataKey="uv" fill="#82ca9d" />
                                <Bar dataKey="amt" fill="#FFE6A5" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-box">
                    <h3 className="chart-title">Line Chart Overview</h3>
                    <div className="chart-inner">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={data}
                                margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="uv" stroke="#82ca9d" activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="amt" stroke="#FFE6A5" activeDot={{ r: 8 }}/>
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>        </main>
    )
}

export default Dashboard