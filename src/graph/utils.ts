import fs from 'fs'
import dayjs from 'dayjs'

export async function callQuery(query: string, subgraph: string) {
    try {
        const response = await fetch(subgraph, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        })
        const json = await response.json()
        return json
    } catch (error) {
        console.log(error)
    }
}

export const get2DayChange = (valueNow: string, value24HoursAgo: string, value48HoursAgo: string): [number, number] => {
    // get volume info for both 24 hour periods
    const currentChange = parseFloat(valueNow) - parseFloat(value24HoursAgo)
    const previousChange = parseFloat(value24HoursAgo) - parseFloat(value48HoursAgo)
    const adjustedPercentChange = ((currentChange - previousChange) / previousChange) * 100
    if (isNaN(adjustedPercentChange) || !isFinite(adjustedPercentChange)) {
        return [currentChange, 0]
    }
    return [currentChange, adjustedPercentChange]
}

export function useDeltaTimestamps(timestampInSeconds?: number): [number, number, number] {
    let time = dayjs()
    if (timestampInSeconds) {
        time = dayjs(timestampInSeconds * 1000)
    }
    const t1 = time.subtract(1, 'day').startOf('minute').unix()
    const t2 = time.subtract(2, 'day').startOf('minute').unix()
    const tWeek = time.subtract(1, 'week').startOf('minute').unix()
    return [t1, t2, tWeek]
}

export async function saveToFile(data: any, fileName: string) {
    fs.writeFile(fileName, JSON.stringify(data, null, 2), function(err) {
        if (err) return console.log(err);
    });
}

