export interface GpuInfoListItem {
  searchStr: string;
  href: string;
  title: string;
  hashrate: string;
  power: string;
  profit: string;
  roi?: string;
}

export type GpuInfoList = GpuInfoListItem[];
