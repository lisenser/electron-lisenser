import {
    app,
    Menu,
    BrowserWindow,
    MenuItemConstructorOptions,
} from 'electron'

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
    selector?: string
    submenu?: DarwinMenuItemConstructorOptions[] | Menu
}

export function buildMenu(window: BrowserWindow, appName: string): Menu {
    const template =
        process.platform === 'darwin'
            ? buildDarwinTemplate(appName)
            : buildDefaultTemplate(window)

    return Menu.buildFromTemplate(template)
}

function buildDarwinTemplate(appName: string): MenuItemConstructorOptions[] {
    const subMenuAbout: DarwinMenuItemConstructorOptions = {
        label: appName,
        submenu: [
            {
                label: `About ${appName}`,
                selector: 'orderFrontStandardAboutPanel:',
            },
            { type: 'separator' },
            { label: 'Services', submenu: [] },
            { type: 'separator' },
            {
                label: `Hide ${appName}`,
                accelerator: 'Command+H',
                selector: 'hide:',
            },
            {
                label: 'Hide Others',
                accelerator: 'Command+Shift+H',
                selector: 'hideOtherApplications:',
            },
            { label: 'Show All', selector: 'unhideAllApplications:' },
            { type: 'separator' },
            {
                label: 'Quit',
                accelerator: 'Command+Q',
                click: () => {
                    app.quit()
                },
            },
        ],
    }
    const subMenuEdit: DarwinMenuItemConstructorOptions = {
        label: 'Edit',
        submenu: [
            { label: 'Undo', accelerator: 'Command+Z', selector: 'undo:' },
            {
                label: 'Redo',
                accelerator: 'Shift+Command+Z',
                selector: 'redo:',
            },
            { type: 'separator' },
            { label: 'Cut', accelerator: 'Command+X', selector: 'cut:' },
            { label: 'Copy', accelerator: 'Command+C', selector: 'copy:' },
            {
                label: 'Paste',
                accelerator: 'Command+V',
                selector: 'paste:',
            },
            {
                label: 'Select All',
                accelerator: 'Command+A',
                selector: 'selectAll:',
            },
        ],
    }
    const subMenuWindow: DarwinMenuItemConstructorOptions = {
        label: 'Window',
        submenu: [
            {
                label: 'Minimize',
                accelerator: 'Command+M',
                selector: 'performMiniaturize:',
            },
            {
                label: 'Close',
                accelerator: 'Command+W',
                selector: 'performClose:',
            },
            { type: 'separator' },
            { label: 'Bring All to Front', selector: 'arrangeInFront:' },
        ],
    }

    return [
        subMenuAbout,
        subMenuEdit,
        subMenuWindow
    ]
}

function buildDefaultTemplate(window: BrowserWindow) {
    const templateDefault = [
        {
            label: '&File',
            submenu: [
                {
                    label: '&Open',
                    accelerator: 'Ctrl+O',
                },
                {
                    label: '&Close',
                    accelerator: 'Ctrl+W',
                    click: () => {
                        window.close()
                    },
                },
            ],
        },
    ]

    return templateDefault
}
