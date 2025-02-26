export type Data = {
    title: string;
    url: string;
    note?: string;
    addDataTime : string;
};

export type Folder = {
    name: string;
    note: string;
    updateTime: string;
    items: Data[];
};