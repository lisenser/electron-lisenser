document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form')
    const link = document.querySelector('a')
    const errorP = document.querySelector('#error')
    const submitButton = document.querySelector<HTMLButtonElement>('form button[type=submit')
    if (!submitButton || !form || !link || !errorP) {
        return
    }

    errorP.textContent = ''

    form.onsubmit = async (e) => {
        e.preventDefault()
        const input = document.querySelector<HTMLInputElement>('input[name=otp]')
        if (!input) {
            return
        }

        errorP.textContent = ''

        const otpCode = input.value.trim()
        if (!otpCode) {
            errorP.textContent = 'Please enter a valid 4 digit Passcode'

            return
        }

        submitButton.disabled = true
        const success = await window.bridge.resetLicense(otpCode)
        submitButton.disabled = false
        if (!success) {
            errorP.textContent = 'Passcode verification failed.'

            return
        }

        // if passcode verification succeeded, we close the window
        window.close()
    }

    link.onclick = async () => {
        const previousText = link.textContent
        link.textContent = 'Resending ...'
        await window.bridge.resendOtp()
        link.textContent = previousText
    }
})
