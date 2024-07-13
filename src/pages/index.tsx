import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import Script from 'next/script'
import { parseDocument } from 'htmlparser2';
import { getAttributeValue, findAll, textContent } from 'domutils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface IStats {
  mission: string;
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

const fetchHtml = async () => {
  const response = await fetch('https://planet4589.org/space/con/star/stats.html');
  const html = await response.text();
  return html;
};

const getImgUrl = (element: any) => {
  const { lastChild } = element || {};
  if (lastChild) {
    return getAttributeValue(lastChild, 'src') || '';
  }
  return '';
};

const parseHtml = (document: any): IStats[] => {
  const res = [];
  const tableElements = findAll((e) => {
    return e.type === 'tag' && e.name === 'table';
  }, document.children);
  // console.log(tableElements);
  const lastTableElement = tableElements.pop() || { children: [] };
  // console.log(lastTableElement);

  const trElements = findAll((e) => {
    return e.type === 'tag' && e.name === 'tr';
  }, lastTableElement.children);

  for (const trElement of trElements) {
    const tdElements = findAll((e) => {
      return e.type === 'tag' && e.name === 'td';
    }, trElement.children);
    //console.log(tdElements.length);
    if (tdElements.length === 23) {
      const mission = textContent(tdElements[0]).trim();
      const total_sats = textContent(tdElements[1]).trim();
      const failed_to_orbit = textContent(tdElements[2]).trim();
      const early_deorbit = textContent(tdElements[3]).trim();
      const disposal_complete = textContent(tdElements[4]).trim();
      const reentry_after_fail = textContent(tdElements[5]).trim();
      const total_down = textContent(tdElements[6]).trim();
      const total_in_orbit = textContent(tdElements[7]).trim();
      const screened = textContent(tdElements[8]).trim();
      const failed_decaying = textContent(tdElements[9]).trim();
      const graveyard = textContent(tdElements[10]).trim();
      const total_working = textContent(tdElements[11]).trim();
      const disposal_underway = textContent(tdElements[12]).trim();
      const out_of_constellation = textContent(tdElements[13]).trim();
      const anomaly = textContent(tdElements[14]).trim();
      const reserve_relocating = textContent(tdElements[15]).trim();
      const special = textContent(tdElements[16]).trim();
      const drift = textContent(tdElements[17]).trim();
      const ascent = textContent(tdElements[18]).trim();
      const operational = textContent(tdElements[19]).trim();
      const orbit_heights = getImgUrl(tdElements[20]?.lastChild)
      const phase_vs_plane = getImgUrl(tdElements[21]?.lastChild)
      const planevs_time = getImgUrl(tdElements[22]?.lastChild)

      res.push({
        mission,
        total_sats: parseInt(total_sats, 0),
        early_deorbit: parseInt(early_deorbit, 0),
        disposal_complete: parseInt(disposal_complete, 0),
        reentry_after_fail: parseInt(reentry_after_fail, 0),
        total_in_orbit: parseInt(total_in_orbit, 0),
        screened: parseInt(screened, 0),
        failed_decaying: parseInt(failed_decaying, 0),
        graveyard: parseInt(graveyard, 0),
        total_working: parseInt(total_working, 0),
        disposal_underway: parseInt(disposal_underway, 0),
        out_of_constellation: parseInt(out_of_constellation, 0),
        anomaly: parseInt(anomaly, 0),
        reserve_relocating: parseInt(reserve_relocating, 0),
        special: parseInt(special, 0),
        drift: parseInt(drift, 0),
        ascent: parseInt(ascent, 0),
        operational: parseInt(operational, 0),
        total_operational: (parseInt(total_working, 0) - parseInt(disposal_underway, 0) - parseInt(out_of_constellation, 0) - parseInt(anomaly, 0) - parseInt(reserve_relocating, 0) - parseInt(special, 0) - parseInt(drift, 0) - parseInt(ascent, 0)),
        orbit_heights,
        phase_vs_plane,
        planevs_time,
      });
    }
  }
  return res;
};

const getDate = (mission: string) => {
  // TODO: date is in an unusual format
  const date = mission.split('(')[1].split(',')[1].trim();
  console.log(date);
};

export default function Home({ data }: { data: IStats[] }) {
  const [labels, setLabels] = useState<ChartLabel[]>([]);
  useEffect(() => {

    const _labels = [
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
    setLabels(_labels);

    //setChartData
  }, [data]);

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
          </BarChart>
        </ResponsiveContainer>
      </main>
    </>
  )
}
// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  const html = await fetchHtml();
  const dom = parseDocument(html);
  const data = parseHtml(dom);

  // Pass data to the page via props
  return { props: { data } }
}