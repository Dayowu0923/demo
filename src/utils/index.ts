export const fmtDate = (s: string) =>
  `${s.slice(0, 4)}/${s.slice(4, 6)}/${s.slice(6)}`

export function tagClass(t: string): string {
  const m: Record<string, string> = {
    '任務完成': 'tag-done',
    '任務取消': 'tag-cancel',
    '任務異常': 'tag-err',
    '執行人員拒單': 'tag-rej',
  }
  return m[t] || 'tag-pend'
}
