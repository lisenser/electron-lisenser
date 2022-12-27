export { Lisenser } from './main/index'
export { getLicenseStatus, getTrialStatus, startTrial, activateLicenseKey } from './main/client'
import {
    LicenseStatus as LicenseStatus_,
    TrialStatus as TrialStatus_,
    TrialActivationStatus as TrialActivationStatus_,
} from './main/client'

export type LicenseStatus = LicenseStatus_
export type TrialStatus = TrialStatus_
export type TrialActivationStatus = TrialActivationStatus_
