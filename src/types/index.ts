export type DoneRecord = {
  no: number
  exec: string
  date: string
  sysno: string
  type: string
  from: string
  to: string
  content: string
  pay: number
}

export type UndoneRecord = {
  no: number
  exec: string
  date: string
  sysno: string
  type: string
  from: string
  to: string
  content: string
}

export type SummaryRow = {
  name: string
  done: number
  undone: number
  pay: number
  fee: number
}

export type FilterTrigger = {
  person: string
  ver: number
}
