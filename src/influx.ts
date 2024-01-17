import { InfluxDB, Point, HttpError, WriteApi } from '@influxdata/influxdb-client'
import { OrgsAPI, BucketsAPI, Organization, Bucket, WriteAPI } from '@influxdata/influxdb-client-apis'
import { url, token, org, bucket } from '../env.js'

export type { WriteApi }
export { Point }

const influx = new InfluxDB({ url, token })
const orgsAPI = new OrgsAPI(influx)
const bucketsAPI = new BucketsAPI(influx)

export async function getOrganizationId(org: string): Promise<string | null> {
    const organizations = await orgsAPI.getOrgs({ org })
    if (!organizations || !organizations.orgs || !organizations.orgs.length) {
        console.error(`No organization named "${org}" found!`)
        return null
    }
    return organizations.orgs[0].id;
}


export async function findOrCreateBucket(orgID: string, name: string): Promise<Bucket> {
    try {
        const buckets = await bucketsAPI.getBuckets({ org, name })
        console.warn(`bucket named "${bucket}" found!`)
        console.warn('Returning first bucket')
        return buckets.buckets[0]
    } catch (e) {
        console.warn(e)
        const bucket = await bucketsAPI.postBuckets({ body: { orgID, name } })
        return bucket
    }
}


export async function initializeInflux(): Promise<WriteApi> {
    const organization = await getOrganizationId(org)
    const bucket = await findOrCreateBucket(organization, 'exchange_status')
    const writeApi = influx.getWriteApi(org, bucket.name, 'ms')
    return writeApi
}
