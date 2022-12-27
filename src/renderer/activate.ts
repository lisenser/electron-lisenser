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
        const input = document.querySelector<HTMLInputElement>('input[name=key]')
        if (!input) {
            return
        }

        errorP.textContent = ''

        const key = input.value.trim()
        if (!key) {
            errorP.textContent = 'Please enter a valid Activation Key'

            return
        }

        submitButton.disabled = true
        const error = await window.bridge.activateKey(key)
        submitButton.disabled = false
        if (error) {
            errorP.textContent = error
        }
    }

    link.onclick = () => window.bridge.openBuyURL()
})
