import type { DoneRecord, UndoneRecord } from '../types'

export const people = ['daniel', '張義旻', '陳明瑋', '黃馨儀', '劉金維', '劉俊翔']
export const orgs = ['台中榮總', '中國醫藥', '童綜合', '澄清醫院', '光田醫院', '仁愛醫院']
export const contents = ['病人轉送', '文件配送', '藥品配送', '設備運送', '緊急轉診', '檢體運送']
export const undoneTypes = ['任務取消', '任務異常', '執行人員拒單', '起始任務完成']

const rnd = (a: string[]) => a[Math.floor(Math.random() * a.length)]
const dateStr = (offset: number) => {
  const d = new Date('2026-04-18')
  d.setDate(d.getDate() + offset)
  return d.toISOString().slice(0, 10).replace(/-/g, '')
}

const doneData: DoneRecord[] = []
const personDone: Record<string, number> = {
  daniel: 5, '張義旻': 4, '陳明瑋': 3, '黃馨儀': 6, '劉金維': 2, '劉俊翔': 11,
}
let dnIdx = 1
people.forEach((p) => {
  const cnt = personDone[p] || 0
  for (let i = 0; i < cnt; i++) {
    doneData.push({
      no: dnIdx,
      exec: p,
      date: dateStr(Math.floor(Math.random() * 7)),
      sysno: 'SYS-2026-' + String(dnIdx).padStart(4, '0'),
      type: '任務完成',
      from: rnd(orgs),
      to: rnd(orgs),
      content: rnd(contents),
      pay: [100, 150, 200, 250, 300][Math.floor(Math.random() * 5)],
    })
    dnIdx++
  }
})

const undoneCount: Record<string, number> = {
  daniel: 2, '張義旻': 2, '陳明瑋': 1, '黃馨儀': 2, '劉金維': 1, '劉俊翔': 16,
}
const undoneData: UndoneRecord[] = []
let udIdx = 1
people.forEach((p) => {
  const cnt = undoneCount[p] || 0
  for (let i = 0; i < cnt; i++) {
    undoneData.push({
      no: udIdx,
      exec: p,
      date: dateStr(Math.floor(Math.random() * 7)),
      sysno: 'SYS-2026-U' + String(udIdx).padStart(4, '0'),
      type: p === 'daniel' && i === 0 ? '任務異常' : rnd(undoneTypes),
      from: rnd(orgs),
      to: rnd(orgs),
      content: rnd(contents),
    })
    udIdx++
  }
})

export { doneData, undoneData }
