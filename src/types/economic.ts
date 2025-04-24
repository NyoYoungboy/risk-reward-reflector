
export interface EconomicEvent {
  id: string;
  date: Date;
  indicator: string;
  actual?: number;
  previous?: number;
  forecast?: number;
  currency: string;
}

export type EconomicEvents = {
  [date: string]: EconomicEvent[];
};
