# electron-lisenser

Electron/Javascript Client for the Lisenser Service

An instance of the `Lisenser` class is used to manage
the license status of an Electron app.

##### `productId: string`
The product ID of the app.

##### `appName: string`
The name of the app.

##### `machineId: string`
A unique identifier for the machine running the app.

##### `constructor(productId: string, appName: string = '', machineId?: string)`

Initializes a new instance of the `Lisenser` class.

###### Parameters

- `productId` The product ID of the app.
- `appName` The name of the app.
- `machineId` A unique identifier for the machine running the app. If not provided, a machine ID will be generated using the `machine-digest` package.

---

##### `getLicenseStatus(): Promise<client.LicenseStatus>`

Returns the status of the license key. If no license key is stored locally, returns `no-key`.

###### Returns

The status of the license key.

---

##### `activateLicenseKey(licenseKey: string): Promise<client.LicenseStatus>`

Activates the given license key.

###### Parameters

- `licenseKey` The license key to activate

---

###### Returns

The status of the license key

---

##### `startTrial(): Promise<client.TrialActivationStatus>`

Attempts to start a trial for the app.

###### Returns

The activation status of the trial

---

##### `getTrialStatus(): Promise<client.TrialStatus>`

Gets the current status of the trial for the app.

###### Returns

The current status of the trial

---

##### `createLicenseKeyWindow(iconPath: string, urlToBuy: string, overrideAppName?: string): Promise<void>`

Opens a window for entering a license key.

###### Parameters

- `iconPath` The path to the app icon
- `urlToBuy` The URL to purchase a license key
- `overrideAppName` The name of the app to display in the window. If not provided, the `appName` provided in the constructor will be used.

---