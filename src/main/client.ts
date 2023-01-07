import axios from 'axios'

const API_URL = 'https://api.lisenser.com/v1'

export interface LicenseRequest {
    licenseKey: string
    machineId: string
    productId: string
}

export interface LicenseStatus {
    isActive: boolean
    status: 'expired' | 'active' | 'invalid' | 'no-key'
    daysToExpiry: number | null
}

export interface TrialStatus {
    isActive: boolean
    status: 'expired' | 'active' | 'not-started' | 'not-allowed'
    daysToExpiry: number
}

export async function getLicenseStatus (req: LicenseRequest): Promise<LicenseStatus> {
    const { licenseKey: key, machineId, productId} = req
    const url = `${API_URL}/license/status`
    const resp = await axios.post<{data: LicenseStatus}>(url, { key, machineId, productId })

    return resp.data.data
}

export async function activateLicenseKey (req: LicenseRequest): Promise<LicenseStatus> {
    const { licenseKey: key, machineId, productId} = req
    const url = `${API_URL}/license/activate`
    const resp = await axios.post<{data: LicenseStatus}>(url, { key, machineId, productId })

    return resp.data.data
}

export async function getTrialStatus (productId: string, machineId: string): Promise<TrialStatus> {
    const url = `${API_URL}/trial/status`
    const resp = await axios.post<{data: TrialStatus}>(url, { machineId, productId })

    return resp.data.data
}

export type TrialActivationStatus = 'started' | 'not-allowed' | 'conflict'

export async function startTrial (productId: string, machineId: string): Promise<TrialActivationStatus> {
    const url = `${API_URL}/trial/activate`
    const resp = await axios.post<{data: TrialActivationStatus}>(url, { machineId, productId })

    return resp.data.data
}
