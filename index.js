const email = document.querySelector('#email')
const country = document.querySelector('#country')
const postalCode = document.querySelector('#postal-code')
const password = document.querySelector('#password')
const confirmPassword = document.querySelector('#confirm-password')
const form = document.querySelector('form')

class Country {

    constructor(name, postCodePattern) {
        this.name = name
        this.postCodePattern = this.createPostCodePattern(postCodePattern)
        this.postCodeError = `Must be in format of ${postCodePattern}`
    }

    createPostCodePattern(postCodePattern) {
        let pattern = '^'
        for (const character of postCodePattern) {
            if(character === 'N') {
                pattern += '[0-9]'
            } else if (character === 'C') {
                pattern += '[a-zA-Z]'
            } else {
                pattern += character
            }
        }
        pattern += '$'
        return new RegExp(pattern, 'i')
    }
}

const countries = [
    new Country('Afghanistan', 'NNNN'),
    new Country('Andorra', 'CCNNN'),
    new Country('Azerbaijan', 'CC NNNN'),
    new Country('Brazil', 'NNNNN-NNN')
]

function getInvalidEmailMessage() {
    if(email.validity.valueMissing) {
        return 'You need to enter an email address.'
    } 
    if(email.validity.tooShort) {
        return `Email should be at least ${email.minLength} characters.`
    } 
    if(email.validity.typeMismatch) {
        return `${email.value} is not a valid email address.`
    }
    return null
}

function getInvalidCountryMessage() {
    if(country.validity.valueMissing) {
        return 'You need to enter a country.'
    }
    const foundCountries = countries
        .filter(existingCountry => existingCountry.name.toLowerCase().includes(country.value.toLowerCase()))
        .map(existingCountry => existingCountry.name)

    if(foundCountries.length > 1) {
        return `${foundCountries.join('\n')}`
    } else if(foundCountries.length === 0) {
        return `Country ${country.value} not found.`
    } else {
        // foundCountries === 1
        if(foundCountries[0].toLowerCase() !== country.value.toLowerCase()) {
            return `${foundCountries[0]}`
        } else {
            return null
        }
    }
}

function getInvalidPostCodeMessage() {
    if (postalCode.validity.valueMissing) {
        return 'You need to enter a post code.'
    } 
    if(getInvalidCountryMessage() !== null) {
        return 'You must first enter a valid country.'
    } 
    const foundCountry = countries.filter(existingCountry => existingCountry.name.toLowerCase() === country.value.toLowerCase())[0]
    const validPostalCode = foundCountry.postCodePattern.test(postalCode.value)
    if(!validPostalCode) {
        return `${foundCountry.postCodeError}`
    }
    return null
}

function getInvalidPasswordMessage() {
    if (password.validity.valueMissing) {
        return 'You need to enter a password.'
    } if (password.validity.tooShort) {
        return `Password should be at least ${password.minLength} characters.`
    } if (password.validity.patternMismatch) {
        return `${password.title}`
    }
    return null
}

function getInvalidConfirmPasswordMessage() {
    if (confirmPassword.validity.valueMissing) {
        return 'You need to confirm your password.'
    }
    if (confirmPassword.value !== password.value) {
        return 'Passwords do not match.'
    }
    if(getInvalidPasswordMessage() !== null) {
        return 'You must first enter a valid password.'
    }
    return null
}

function reportInputValidity(getInvalidFieldMessage, field) {
    const invalidFieldMessage = getInvalidFieldMessage()
    if(invalidFieldMessage === null) {
        field.setCustomValidity('')
    } else {
        field.setCustomValidity(invalidFieldMessage)
    }
    return field.reportValidity()
}

email.addEventListener('input', event => reportInputValidity(getInvalidEmailMessage, email))
country.addEventListener('input', event => reportInputValidity(getInvalidCountryMessage, country))
postalCode.addEventListener('input', event => reportInputValidity(getInvalidPostCodeMessage, postalCode))
password.addEventListener('input', event => reportInputValidity(getInvalidPasswordMessage, password))
confirmPassword.addEventListener('input', event => reportInputValidity(getInvalidConfirmPasswordMessage, confirmPassword))

form.addEventListener('submit', event => {
    event.preventDefault()
    if(!reportInputValidity(getInvalidEmailMessage, email)) {
        return;
    }
    if(!reportInputValidity(getInvalidCountryMessage, country)) {
        return;
    }
    if(!reportInputValidity(getInvalidPostCodeMessage, postalCode)) {
        return;
    }
    if(!reportInputValidity(getInvalidPasswordMessage, password)) {
        return;
    }
    if(!reportInputValidity(getInvalidConfirmPasswordMessage, confirmPassword)) {
        return;
    }
    // Everything is valid.
    alert('🙌 High Five! Great job! 🙌')
})