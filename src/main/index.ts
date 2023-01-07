import electron from 'electron'
import fs, { promises as fsP } from 'fs'
import path from 'path'
// @ts-ignore
import * as md from 'machine-digest'
import * as client from './client'

/**
 * An instance of the `Lisenser` class is used to manage
 * the license status of an Electron app.
 */
export class Lisenser {
    /**
     * The product ID of the app.
     */
    productId: string
    /**
     * The name of the app.
     */
    appName: string
    /**
     * A unique identifier for the machine running the app.
     */
    private machineId: string

    /**
     * Initializes a new instance of the `Lisenser` class.
     *
     * @param productId The product ID of the app.
     * @param appName The name of the app.
     * @param machineId A unique identifier for the machine running the app.
     * If not provided, a machine ID will be generated using the `machine-digest` package.
     */
    constructor (productId: string, appName: string = '', machineId?: string) {
        this.productId = productId
        this.appName = appName
        this.machineId = machineId || md.get().digest
    }

    /**
     * Determines whether the app has write access to the user data directory.
     *
     * @returns A `Promise` that resolves to `true` if the app has write access
     * to the user data directory, or `false` if it does not.
     */
    private async canUseFileStorage (): Promise<boolean> {
        try {
            await fsP.access(`${electron.app.getPath('userData')}/`, fs.constants.W_OK)
            return true
        } catch (error) {
            return false
        }
    }

    /**
     * Returns the license key stored on the local file system. If no license key is found, returns an empty string.
     * If the app does not have permission to access the file system in the user's App Data folder, throws a
     * "File Permission Error" CustomError.
     */
    private async getLocallyStoredLicenseKey (): Promise<string> {
        if (!await this.canUseFileStorage()) {
            throw new CustomError('Unable to access the folder path of this App', 'File Permission Error')
        }

        try {
            const licensePath = path.join(electron.app.getPath('userData'), this.productId)
            return await fsP.readFile(licensePath, 'utf8')
        } catch (error) {
            return ''
        }
    }

    /**
     * Stores the provided license key on the local file system. 
     * If the app does not have permission to access the file system in the user's App Data folder, throws a "File Permission Error" CustomError.
     */
    private async storeLicenseKeyLocally (licenseKey: string): Promise<void> {
        if (!await this.canUseFileStorage()) {
            throw new CustomError('Unable to access the folder path of this App', 'File Permission Error')
        }

        const licensePath = path.join(electron.app.getPath('userData'), this.productId)
        await fsP.writeFile(licensePath, licenseKey)
    }

    /**
     * Returns the status of the license key. If no license key is stored locally, returns `no-key`.
     *
     * @returns {Promise<client.LicenseStatus>} The status of the license key
     */
    async getLicenseStatus (): Promise<client.LicenseStatus> {
        const licenseKey = await this.getLocallyStoredLicenseKey()
        if (!licenseKey) {
            return { status: 'no-key', daysToExpiry: 0, isActive: false }
        }

        const req = { machineId: this.machineId, productId: this.productId }
        return await client.getLicenseStatus({ licenseKey, ...req })
    }

    /**
     * Activates the given license key.
     *
     * @param {string} licenseKey The license key to activate
     * @returns {Promise<client.LicenseStatus>} The status of the license key
     */
    async activateLicenseKey (licenseKey: string): Promise<client.LicenseStatus> {
        const req = { machineId: this.machineId, productId: this.productId }
        const status = await client.activateLicenseKey({ licenseKey, ...req })
        if (!status.isActive) {
            return status
        }

        await this.storeLicenseKeyLocally(licenseKey)
        return status
    }
 
    /**
     * Activates the trial for this product.
     *
     * @returns {Promise<client.TrialActivationStatus>} The status of the trial activation
     */
    async startTrial (): Promise<client.TrialActivationStatus> {
        return client.startTrial(this.productId, this.machineId)
    }

    /**
     * Returns the status of the trial for this product.
     *
     * @returns {Promise<client.TrialStatus>} The status of the trial
     */
    async getTrialStatus (): Promise<client.TrialStatus> {
        return client.getTrialStatus(this.productId, this.machineId)
    }

    /**
     * Creates a window that prompts the user to enter a license key.
     *
     * @param {string} iconPath The file path to the app's icon
     * @param {string} urlToBuy The URL where the user can purchase a license key
     * @param {string} [overrideAppName] An optional name to override the app's default name
     * @returns {Promise<void>}
     */
    async createLicenseKeyWindow (iconPath: string, urlToBuy: string, overrideAppName?: string): Promise<void> {
        const appName = overrideAppName || this.appName
        const window = new electron.BrowserWindow({
            width: 600,
            height: 300,
            icon: iconPath,
            minWidth: 600,
            minHeight: 300,
            title: `${appName} - License Key`,
            webPreferences: {
                preload: path.join(callsites()[0].getFileName()!, '../preloads/foractivate.js')
            },
        })

        window.loadFile(path.join(callsites()[0].getFileName()!, '../renderer/activate.html'))

        // disable dev console
        // @todo: consider making this optional
        const menu = electron.Menu.buildFromTemplate([])
        electron.Menu.setApplicationMenu(menu)

        return new Promise((resolve, reject) => {
            // @todo: make this optional as well
            window.on('close', () => reject(new Error('Activation window was closed before activation')))

            electron.ipcMain.handle('license:activate', async (_, key: string): Promise<string | void> => {
                const status = await this.activateLicenseKey(key)
                if (!status.isActive) {
                    const messages = {
                        invalid: 'The License Key provided is invalid.',
                        expired: 'The Licens Key provided has expired.'
                    }

                    electron.dialog.showErrorBox(
                        `${appName} - License ${status.status.toUpperCase()}`,
                        messages[status.status]
                    )
                }

                try {
                    await this.storeLicenseKeyLocally(key)
                } catch (error) {
                    if (error instanceof CustomError) {
                        electron.dialog.showErrorBox(error.title, error.message)

                        return
                    }

                    reject(error)
                }

                window.close()
                resolve()
            })

            electron.ipcMain.on('license:buy', () => {
                electron.shell.openExternal(urlToBuy)
            })
        })
    }
}

class CustomError extends Error {
    title: string
    constructor(message: string, title: string) {
        super(message)
        this.title = title
    }
}

// adding code from https://github.com/sindresorhus/callsites
// directly since importing its npm package keeps failing
// due to esm module incompatibility
function callsites(): {getFileName: () => string}[] {
    const _prepareStackTrace = Error.prepareStackTrace
    Error.prepareStackTrace = (_, stack) => stack
    const stack = new Error().stack!.slice(1) // eslint-disable-line unicorn/error-message
    Error.prepareStackTrace = _prepareStackTrace
    // @ts-ignore
    return stack
}
