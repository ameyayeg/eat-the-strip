import styles from './Contact.module.css'

// Netlify Forms: the form name, the hidden form-name input and the field
// names (name, email, message, dish, connection) feed the submissions export.
// Don't rename them.
const CONNECTIONS = ['Customer', 'Friend or family', 'Owner or staff', 'Other']

// Clearer wording than the browser's default messages for the email field.
const showEmailMessage = (event) => {
  const input = event.target
  input.setCustomValidity('')
  if (input.validity.valueMissing) {
    input.setCustomValidity('Please enter your email so we can reply.')
  } else if (input.validity.typeMismatch) {
    input.setCustomValidity(
      'Please enter a valid email address, like name@example.com.'
    )
  }
}

const clearEmailMessage = (event) => event.target.setCustomValidity('')

// The browser already checks the form when Send is clicked. This also stops
// submits started from JavaScript (requestSubmit or a submit event) when a
// field is missing or invalid, and shows the message.
const checkBeforeSending = (event) => {
  const form = event.currentTarget
  if (!form.checkValidity()) {
    event.preventDefault()
    form.reportValidity()
  }
}

const Contact = () => {
  return (
    <form
      name="contact"
      method="POST"
      data-netlify="true"
      action="/success"
      className={styles.form}
      onSubmit={checkBeforeSending}
    >
      <input type="hidden" name="form-name" value="contact" />

      <div className={styles.field}>
        <label htmlFor="yourname">Name (optional)</label>
        <input type="text" name="name" id="yourname" autoComplete="name" />
      </div>

      <div className={styles.field}>
        <label htmlFor="youremail">Email</label>
        <input
          type="email"
          name="email"
          id="youremail"
          autoComplete="email"
          required
          onInvalid={showEmailMessage}
          onInput={clearEmailMessage}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="yourmessage">
          Your message. If you're suggesting a spot, tell us its name, where it
          is and why you love it
        </label>
        <textarea name="message" id="yourmessage" rows="6" required />
      </div>

      <fieldset className={styles.group}>
        <legend className={styles.helper}>
          Suggesting a spot? These help a lot.
        </legend>

        <div className={styles.field}>
          <label htmlFor="dish">Dish you'd recommend (optional)</label>
          <input type="text" name="dish" id="dish" />
        </div>

        <div className={styles.field}>
          <label htmlFor="connection">
            How are you connected to the place? (optional)
          </label>
          <select name="connection" id="connection" defaultValue="">
            <option value="">Choose one</option>
            {CONNECTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </fieldset>

      <button type="submit" className={styles.button}>
        Send
      </button>
    </form>
  )
}

export default Contact
