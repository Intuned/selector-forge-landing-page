type Row = {
  label: string;
  value: string;
  target?: boolean;
};
type CG = {
  icon: {
    x: number;
    y: number;
  };
  pick: {
    x: number;
    y: number;
  };
  target: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
};

export type { Row, CG };
