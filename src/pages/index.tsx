import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import Script from 'next/script'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Pie, PieChart, Brush } from 'recharts';
import Table from 'antd/lib/table';
import Button from 'antd/lib/button';
import Col from 'antd/lib/col';
import Collapse from 'antd/lib/collapse';
import Flex from 'antd/lib/flex';
import Row from 'antd/lib/grid/row';
import { CollapseProps, type TableColumnsType, type TableProps } from 'antd';
import { utils, write, writeFile } from 'xlsx';

interface IStats {
  mission: string;
  number: number;
  year: number;
  day: number;
  date: string
  total_sats: number;
  early_deorbit: number;
  disposal_complete: number;
  reentry_after_fail: number;
  total_in_orbit: number;
  screened: number;
  failed_decaying: number;
  graveyard: number;
  total_working: number;
  disposal_underway: number;
  out_of_constellation: number;
  anomaly: number;
  reserve_relocating: number;
  special: number;
  drift: number;
  ascent: number;
  operational: number;
  total_operational: number;
  orbit_heights: string;
  phase_vs_plane: string;
  planevs_time: string;
};

interface ChartLabel {
  name: string;
  color: string;
}

// fetch json from /api/data and parse it as IStats[]
const fetchJson = async () => {
  const response = await fetch('/api/data');
  const data = await response.json();
  return data;
}

const labels: ChartLabel[] = [
  { name: 'early_deorbit', color: 'rgb(241, 90, 89)' },
  { name: 'disposal_complete', color: 'rgb(237, 43, 42)' },
  { name: 'reentry_after_fail', color: 'rgb(210, 19, 18)' },
  { name: 'screened', color: 'rgb(231, 70, 70)' },
  { name: 'failed_decaying', color: 'rgb(252, 79, 0)' },
  { name: 'disposal_underway', color: 'rgb(252, 79, 0)' },
  { name: 'out_of_constellation', color: 'rgb(255, 217, 90)' },
  { name: 'anomaly', color: 'rgb(249, 123, 34)' },
  { name: 'reserve_relocating', color: 'rgb(8, 131, 149)' },
  { name: 'special', color: 'rgb(10, 77, 104)' },
  { name: 'drift', color: 'rgb(157, 192, 139)' },
  { name: 'ascent', color: 'rgb(199, 232, 202)' },
  { name: 'total_operational', color: 'rgb(96, 153, 102)' },
];

export default function Home() {
  const [data, setData] = useState<IStats[]>([]);
  const [totals, setTotals] = useState<{
    total_sats: number,
    total_operational: number,
    reserve_relocating: number,
  }>({
    total_sats: 0,
    total_operational: 0,
    reserve_relocating: 0,
  });


  const exportDataExcel = () => {
    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'data');
    writeFile(workbook, "data.xlsx");
  }

  const exportDataJson = () => {
    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();
  }

  const columns: TableColumnsType<IStats> = [
    {
      title: 'Mission',
      dataIndex: 'mission',
      key: 'mission',
      sorter: (a, b) => a.mission.localeCompare(b.mission),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Number',
      dataIndex: 'number',
      key: 'number',
      sorter: (a, b) => a.number - b.number,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => a.date.localeCompare(b.date),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Total Sats',
      dataIndex: 'total_sats',
      key: 'total_sats',
      sorter: (a, b) => a.total_sats - b.total_sats,
      sortDirections: ['descend', 'ascend'],
    },
    // total_working
    {
      title: 'Total Working',
      dataIndex: 'total_working',
      key: 'total_working',
      sorter: (a, b) => a.total_working - b.total_working,
      sortDirections: ['descend', 'ascend'],
    },
    // total_operational
    {
      title: 'Total Operational',
      dataIndex: 'total_operational',
      key: 'total_operational',
      sorter: (a, b) => a.total_operational - b.total_operational,
      sortDirections: ['descend', 'ascend'],
    },
    //total_in_orbit
    {
      title: 'Total In Orbit',
      dataIndex: 'total_in_orbit',
      key: 'total_in_orbit',
      sorter: (a, b) => a.total_in_orbit - b.total_in_orbit,
      sortDirections: ['descend', 'ascend'],
    },
    //early_deorbit
    {
      title: 'Early Deorbit',
      dataIndex: 'early_deorbit',
      key: 'early_deorbit',
      sorter: (a, b) => a.early_deorbit - b.early_deorbit,
      sortDirections: ['descend', 'ascend'],
    },
    //disposal_complete
    {
      title: 'Disposal Complete',
      dataIndex: 'disposal_complete',
      key: 'disposal_complete',
      sorter: (a, b) => a.disposal_complete - b.disposal_complete,
      sortDirections: ['descend', 'ascend'],
    },
    //disposal_underway
    {
      title: 'Disposal Underway',
      dataIndex: 'disposal_underway',
      key: 'disposal_underway',
      sorter: (a, b) => a.disposal_underway - b.disposal_underway,
      sortDirections: ['descend', 'ascend'],
    },
    //out_of_constellation
    {
      title: 'Out of Constellation',
      dataIndex: 'out_of_constellation',
      key: 'out_of_constellation',
      sorter: (a, b) => a.out_of_constellation - b.out_of_constellation,
      sortDirections: ['descend', 'ascend'],
    },
  ];

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: 'Data Table',
      children: <Row>
        <Col span={24}>
          <Flex gap="small" wrap>
            <Button
              type="primary"
              onClick={exportDataExcel}
            >Export Excel</Button>
            <Button
              onClick={exportDataJson}
            >Export JSON</Button>
          </Flex>
        </Col>
        <Col span={24}><Table columns={columns} dataSource={data} /></Col>
      </Row>,
    },
  ];

  const fetchData = async () => {
    const data = await fetchJson() as unknown as IStats[];
    setData(data);
    // totals
    const total_sats = data.reduce((acc, curr) => acc + curr.total_sats, 0);
    const total_operational = data.reduce((acc, curr) => acc + curr.total_operational, 0);
    const reserve_relocating = data.reduce((acc, curr) => acc + curr.reserve_relocating, 0);
    setTotals({
      total_sats,
      total_operational,
      reserve_relocating,
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>Starlink Launch Statistics</title>
      </Head>
      <Script src="https://unpkg.com/react/umd/react.production.min.js" />
      <Script src="https://unpkg.com/react-dom/umd/react-dom.production.min.js" />
      <Script src="https://unpkg.com/recharts/umd/Recharts.min.js" />
      <main className={`bg-gray-50 flex overflow-x-auto space-x-8 w-full bg min-h-max flex-col items-center justify-between p-20`}>
        <p className="text-black text-lg">Source: Jonathan McDowell <a className="text-blue-600 text-md" href="https://planet4589.org" target="_blank">https://planet4589.org</a></p>
        <Collapse
          items={items}
          defaultActiveKey={['2']}
          style={{ width: '100%' }}
          destroyInactivePanel
        />

        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mission" />
            <YAxis />
            <Tooltip />
            <Legend />
            {
              labels.map((label, i) => <Bar key={i} dataKey={label.name} stackId="a" fill={label.color} />)
            }
            <Brush dataKey="name" height={30} stroke="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
        {/* totals pie chart */}
        <ResponsiveContainer width="100%" height="100%">
        <PieChart width={500} height={500}>
          <Pie data={[
            { name: 'Total Nonfunctional', value: totals.total_sats - totals.total_operational, fill: 'rgb(241, 90, 89)' },
            { name: 'Total Operational', value: totals.total_operational, fill: 'rgb(96, 153, 102)' },
            { name: 'Reserve Relocating', value: totals.reserve_relocating, fill: 'rgb(8, 131, 149)' },
          ]} dataKey="value" cx="50%" cy="50%" outerRadius={200} label />
          <Tooltip />
          <Legend />
        </PieChart>
        </ResponsiveContainer>
      </main>
    </>
  )
}