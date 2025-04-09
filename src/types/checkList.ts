export interface CheckList extends CheckListBase {
  id: number
}

export interface CheckListBase {
  building: string,
  status: Status,
  date: string,
  inspector: string,
  notes: string,
}

export enum Status {
  PASS = 'Pass',
  FAIL = 'Fail',
}
