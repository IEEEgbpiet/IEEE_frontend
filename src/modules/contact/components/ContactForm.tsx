import { useState, type FormEvent } from 'react';
import { contactDetails } from '@/data/contact/details';
import { validateContactMessage, type ContactMessage } from '@/lib/contact';

const emptyMessage: ContactMessage = { name: '', email: '', subject: '', message: '' };
export function ContactForm() {
  const [message, setMessage] = useState(emptyMessage);
  const [status, setStatus] = useState<string>();
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(
      validateContactMessage(message)
        ? `Thank you. Please email your inquiry to ${contactDetails.email}.`
        : 'Please complete every field with a valid email address.',
    );
  }
  return (
    <form className="form" onSubmit={submit}>
      <label>
        Name
        <input
          value={message.name}
          onChange={(e) => setMessage({ ...message, name: e.target.value })}
        />
      </label>
      <label>
        Email
        <input
          type="email"
          value={message.email}
          onChange={(e) => setMessage({ ...message, email: e.target.value })}
        />
      </label>
      <label>
        Subject
        <input
          value={message.subject}
          onChange={(e) => setMessage({ ...message, subject: e.target.value })}
        />
      </label>
      <label>
        Message
        <textarea
          rows={5}
          value={message.message}
          onChange={(e) => setMessage({ ...message, message: e.target.value })}
        />
      </label>
      <button className="button" type="submit">
        Prepare inquiry
      </button>
      {status && <p role="status">{status}</p>}
    </form>
  );
}
