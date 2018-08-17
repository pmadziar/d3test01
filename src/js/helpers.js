import * as d3 from "d3";

export const getSize = (d) => {
    let size = 1;
    if (d.OrgUnits && d.OrgUnits.length)
        size += d.OrgUnits.reduce((total, itm) => total + getSize(itm));
    return size;
};

export const maxDepthFunc = (d) => d.OrgUnits && d.OrgUnits.length?d3.max(d.OrgUnits.map((t) => maxDepthFunc(t))):d.Level;


const colorScales = ["gray", "red", "green", "purple", "orange", "blue"].map(x => {
    return d3.scaleLinear()
    .domain([0, 1])
    .range([x, "#eee"]);
});

export const colorScale = (branch) => colorScales[branch];

const setBranchNo = (d, no) => {
    const r = {...d, OrgUnits:[], BranchNo: no};
    if(d.OrgUnits && d.OrgUnits.length) r.OrgUnits = d.OrgUnits.map(x => setBranchNo(x, no));
    return r;
}

export const addBranchNo = (org) => {
    const r = {...org, OrgUnits:[], BranchNo: 0};
    const len = org.OrgUnits.length;
    for(let i=0; i<len;i++){
        r.OrgUnits.push(setBranchNo(org.OrgUnits[i], i+1));
    }
    return r;
}

