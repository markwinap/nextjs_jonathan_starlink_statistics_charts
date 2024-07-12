import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import { parseDocument } from 'htmlparser2';
import { getAttributeValue, findAll, textContent } from 'domutils';
import dayjs from 'dayjs';
import zoomPlugin from 'chartjs-plugin-zoom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
const isBrowser = () => typeof window !== 'undefined';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);
interface IStats {
  mission: string;
  total_sats: string;
  early_deorbit: string;
  disposal_complete: string;
  reentry_after_fail: string;
  total_in_orbit: string;
  screened: string;
  failed_decaying: string;
  graveyard: string;
  total_working: string;
  disposal_underway: string;
  out_of_constellation: string;
  anomaly: string;
  reserve_relocating: string;
  special: string;
  drift: string;
  ascent: string;
  operational: string;
  orbit_heights: string;
  phase_vs_plane: string;
  planevs_time: string;
}
const options = {
  plugins: {
    title: {
      display: true,
      text: 'Starlink Launch Statistics',
    },

  },
  responsive: true,
 // maintainAspectRatio: false,
  interaction: {
    mode: 'index' as const,
    intersect: true,
  },
  scales: {
    x: {
      stacked: true,
      ticks: {
        font: {
          size: 10,
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0
        }
      }
    },
    y: {
      stacked: true,
    },
  },
};

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
  console.log(lastTableElement);

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
      const orbit_heights =  getImgUrl(tdElements[20]?.lastChild)
      const phase_vs_plane = getImgUrl(tdElements[21]?.lastChild)
      const planevs_time = getImgUrl(tdElements[22]?.lastChild)

      res.push({
        mission,
        total_sats,
        early_deorbit,
        disposal_complete,
        reentry_after_fail,
        total_in_orbit,
        screened,
        failed_decaying,
        graveyard,
        total_working,
        disposal_underway,
        out_of_constellation,
        anomaly,
        reserve_relocating,
        special,
        drift,
        ascent,
        operational,
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

export default function Home({ data }: any) {
  const [labels, setLabels] = useState<string[]>([]);
  const [datasets, setDatasets] = useState<any[]>([]);
  useEffect(() => {
    const _labels = data.map((p: IStats, i: number) => `${p.mission}`);
    setLabels(_labels);

    const _datasets = [
      // {
      //   label: 'Total Sats',
      //   data: data.map((p: IStats) => p.total_sats),
      //   backgroundColor: 'rgb(155, 164, 181)',
      //   stack: 'Total',
      // },
      {
        label: 'Early Deorbit',
        data: data.map((p: IStats) => p.early_deorbit),
        backgroundColor: 'rgb(241, 90, 89)',
        stack: 'Group',
      },
      {
        label: 'Disposal Complete',
        data: data.map((p: IStats) => p.disposal_complete),
        backgroundColor: 'rgb(237, 43, 42)',
        stack: 'Group',
      },
      {
        label: 'Reentry After Fail',
        data: data.map((p: IStats) => p.reentry_after_fail),
        backgroundColor: 'rgb(210, 19, 18)',
        stack: 'Group',
      },
      // {
      //   label: 'Total In Orbit',
      //   data: data.map((p: IStats) => p.total_in_orbit),
      //   backgroundColor: 'rgb(57, 72, 103)',
      //   stack: 'Total In Orbit',
      // },
      {
        label: 'Screened',
        data: data.map((p: IStats) => p.screened),
        backgroundColor: 'rgb(231, 70, 70)',
        stack: 'Group',
      },
      {
        label: 'Failed Decaying',
        data: data.map((p: IStats) => p.failed_decaying),
        backgroundColor: 'rgb(255, 99, 132)',
        stack: 'Group',
      },
      {
        label: 'Graveyard',
        data: data.map((p: IStats) => p.graveyard),
        backgroundColor: 'rgb(252, 79, 0)',
        stack: 'Group',
      },
      // {
      //   label: 'Total Working',
      //   data: data.map((p: IStats) => p.total_working),
      //   backgroundColor: 'rgb(246, 241, 241)',
      //   stack: 'Group',
      // },
      {
        label: 'Disposal Underway',
        data: data.map((p: IStats) => p.disposal_underway),
        backgroundColor: 'rgb(252, 79, 0)',
        stack: 'Group',
      },
      {
        label: 'Out of Constellation',
        data: data.map((p: IStats) => p.out_of_constellation),
        backgroundColor: 'rgb(255, 217, 90)',
        stack: 'Group',
      },
      {
        label: 'Anomaly',
        data: data.map((p: IStats) => p.anomaly),
        backgroundColor: 'rgb(249, 123, 34)',
        stack: 'Group',
      },
      {
        label: 'Reserve Relocating',
        data: data.map((p: IStats) => p.reserve_relocating),
        backgroundColor: 'rgb(8, 131, 149)',
        stack: 'Group',
      },
      {
        label: 'Special',
        data: data.map((p: IStats) => p.special),
        backgroundColor: 'rgb(10, 77, 104)',
        stack: 'Group',
      },
      {
        label: 'Drift',
        data: data.map((p: IStats) => p.drift),
        backgroundColor: 'rgb(157, 192, 139)',
        stack: 'Group',
      },
      {
        label: 'Ascent',
        data: data.map((p: IStats) => p.ascent),
        backgroundColor: 'rgb(199, 232, 202)',
        stack: 'Group',
      },
      {
        label: 'Operational',
        data: data.map((p: IStats) => (parseInt(p.total_working, 0) - parseInt(p.disposal_underway, 0) - parseInt(p.out_of_constellation, 0) - parseInt(p.anomaly, 0) - parseInt(p.reserve_relocating, 0) - parseInt(p.special, 0) - parseInt(p.drift, 0) - parseInt(p.ascent, 0))),
        backgroundColor: 'rgb(96, 153, 102)',
        stack: 'Group',
      },
    ]
    setDatasets(_datasets);
  }, [data]);
  return (
    <div>
      <Head>
        <title>Starlink Launch Statistics</title>
      </Head>
      <main
        className={`bg-gray-50 flex overflow-x-auto space-x-8 w-full bg min-h-max flex-col items-center justify-between p-20`}
      >
        <p className="text-black text-lg">Source: Jonathan McDowell <a className="text-blue-600 text-lg" href="https://planet4589.org" target="_blank">https://planet4589.org</a></p>
        <Bar options={options} data={{ labels, datasets }} />
      </main>
    </div>
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