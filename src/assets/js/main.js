import * as v from 'valibot'
import { FormSchema } from "./_schema";

/** @type {HTMLFormElement} */
const form = document.querySelector('form')
/** @type {string[]} */
const formFields = [...form.elements].map(el => el.name).filter(name => name !== '')

/**
 * Binds instant and afterward validations to a field
 *
 * @param {HTMLElement} el
 * @param {v.SchemaWithPipe} schema
 * @param {Function} validateFn
 */
function bindLiveValidation(el, schema, validateFn = validate) {
  let touched = false

  el.addEventListener('change', event => {
    touched = true
    if (el.type === 'checkbox') {
      validateFn(event.target, schema, { live: true })
    }
  })

  if (el.type !== 'checkbox') {
    el.addEventListener('keyup', event => {
      validateFn(event.target, schema, { removeOnly: true })
    })

    el.addEventListener('blur', event => {
      if (!touched) return
      validateFn(event.target, schema, { live: true })
    })
  }
}

/**
 * Validates a field against a schema
 *
 * @param {HTMLElement} el
 * @param {v.SchemaWithPipe} schema
 * @param {object} opts
 */
function validate(el, schema, opts) {
  const input = el.type === 'checkbox' ? el.checked : el.value
  const { success, issues } = v.safeParse(schema, input)
  const errorMessage = issues?.[0].message
  updateFieldDOM(el, success, errorMessage, opts)
}

/**
 * Updates the DOM based on the validity of a field.
 *
 * @param {HTMLElement} el          - The input element being validated
 * @param {boolean} isValid         - Whether the input element is valid
 * @param {string} errorMessage     - The text to display on the error live region
 * @param {object} opts
 * @param {boolean} opts.live       - Controls the aria-live attribute of the error live region
 * @param {boolean} opts.removeOnly - Only update the DOM when removing error indicators
 */
function updateFieldDOM(el, isValid, errorMessage, opts) {
  const removeOnly = opts?.removeOnly
  const isLive = opts?.live
  const elField = el.closest('.field')
  const elError = elField.querySelector('.error')

  if (isValid) {
    el.removeAttribute('aria-invalid')
    elError.textContent = ''
  } else if (!removeOnly) {
    el.setAttribute('aria-invalid', 'true')
    elError.setAttribute('aria-live', isLive ? 'assertive' : 'off')
    elError.textContent = errorMessage
  }
}

// Bind instant and afterward validations to form fields
formFields.forEach(field => {
  bindLiveValidation(form.elements[field], FormSchema.entries[field])
})

// Opt out of Contraint Validation API since we provide our own logic
form.setAttribute('novalidate', "")

// Submit validation
form.addEventListener('submit', event => {
  event.preventDefault()

  let formData = {}
  formFields.forEach(field => {
    formData[field] = form.elements[field].value
  })

  const result = v.safeParse(FormSchema, formData, { abortPipeEarly: true })

  if (result.issues) {
    result.issues.forEach(issue => {
      const el = form.elements[issue.path[0].key]

      // TODO: if there are multiple errors, remove the `live` option
      // and instead announce the number of fields with error on a
      // visually hidden live region
      updateFieldDOM(el, false, issue.message, { live: true })
    })
  } else {
    // Success!
  }
})
