// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { parseDocument } from 'htmlparser2';
import { getAttributeValue, findAll, textContent } from 'domutils';
import dayjs from 'dayjs';

interface IStats {
  mission: string;
  total_sats_launched: number;// not in use
  failed_to_orbit: number; // not in use - f
  early_deorbit: number;// F
  disposal_complete: number;// R
  reentry_after_fail: number;// M
  total_down: number; // not in use
  total_in_orbit: number;
  screened: number;// F
  failed_decaying: number;// M
  graveyard: number;// G
  total_working: number;
  disposal_underway: number; // R
  out_of_constellation: number; // L
  anomaly: number; // U
  reserve_relocating: number; // T
  special: number; // S
  drift: number; // D
  ascent: number;// A
  operational_orbit: number; // O
  //orbit_heights: string;
  //phase_vs_plane: string;
  //planevs_time: string;

  number: number;
  year: number;
  day: number;
  date: string
  
  total_operational: number;
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
// Tintin Prototypes (Launch 0, 2018-020)
// Starlink Group 10-13 (Launch 203, 2024-196)
const getMissionNumber = (mission: string) => {
  const matches = mission.match(/Launch (\d+), (\d+-\d+)/);
  if (matches) {
    return parseInt(matches[1], 0);
  }
  return 0;
}
// Tintin Prototypes (Launch 0, 2018-020)
// Starlink Group 10-13 (Launch 203, 2024-196)
const getMissionYear = (mission: string) => {
  const matches = mission.match(/Launch (\d+), (\d+-\d+)/);
  if (matches) {
    return parseInt(matches[2].split('-')[0], 0);
  }
  return 0;
}
// Tintin Prototypes (Launch 0, 2018-020)
// Starlink Group 10-13 (Launch 203, 2024-196)
const getMissionDay = (mission: string) => {
  const matches = mission.match(/Launch (\d+), (\d+-\d+)/);
  if (matches) {
    return parseInt(matches[2].split('-')[1], 0);
  }
  return 0;
}
// from date and day, get the date in the format yyyy-mm-dd
const getDate = (year: number, day: number) => {
  return dayjs().year(year).add(day, 'day').format('YYYY-MM-DD');
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
      const total_sats_launched = textContent(tdElements[1]).trim();
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
      const operational_orbit = textContent(tdElements[19]).trim();
      const orbit_heights = getImgUrl(tdElements[20]?.lastChild)
      const phase_vs_plane = getImgUrl(tdElements[21]?.lastChild)
      const planevs_time = getImgUrl(tdElements[22]?.lastChild)

      const year = getMissionYear(mission);
      const day = getMissionDay(mission);
      const number = getMissionNumber(mission);
      res.push({
        mission,
        number,
        year,
        day,
        date: getDate(year, day),
        total_sats_launched: parseInt(total_sats_launched, 0),
        failed_to_orbit: parseInt(failed_to_orbit, 0),
        early_deorbit: parseInt(early_deorbit, 0),
        disposal_complete: parseInt(disposal_complete, 0),
        reentry_after_fail: parseInt(reentry_after_fail, 0),
        total_down: parseInt(total_down, 0),
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
        operational_orbit: parseInt(operational_orbit, 0),
        total_operational: (parseInt(total_working, 0) - parseInt(disposal_underway, 0) - parseInt(out_of_constellation, 0) - parseInt(anomaly, 0) - parseInt(reserve_relocating, 0) - parseInt(special, 0) - parseInt(drift, 0) - parseInt(ascent, 0)),
        //orbit_heights,
        //phase_vs_plane,
        //planevs_time,
      });
    }
  }
  return res;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const html = await fetchHtml();
  const dom = parseDocument(html);
  const data = parseHtml(dom);

  res.status(200).json(data)
}
