import { useEffect } from 'react';
import { FormEvent, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { CheckCircle2, Mail, Send, User, FileText, Loader2 } from 'lucide-react';
import { adminApi } from '@/services/adminApi';

export default function ContactPage() {
  useEffect(() => {
    document.title = 'Contact Us';
  }, []);

  const formRef = useRef<HTMLFormElement>(null);
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [ticketId, setTicketId] = useState<string>('');

  // EmailJS env config
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setStatus('idle');
    setTicketId('');

    if (!formRef.current) {
      setStatus('error');
      return;
    }

    // Extract form values
    const formDataObj = new FormData(formRef.current);
    const name = String(formDataObj.get('name') ?? '').trim();
    const email = String(formDataObj.get('email') ?? '').trim();
    const subject = String(formDataObj.get('subject') ?? '').trim();
    const message = String(formDataObj.get('message') ?? '').trim();

    if (!name || !email || !subject || !message) {
      setStatus('error');
      return;
    }

    try {
      setIsSending(true);

      // Run both Support API and EmailJS in parallel
      const promises: Promise<unknown>[] = [];

      // 1. Support API — creates a ticket in the backend
      const supportPromise = adminApi.sendSupportMessage({
        name,
        email,
        subject,
        message,
      });
      promises.push(supportPromise);

      // 2. EmailJS — sends email notification (if configured)
      if (serviceId && templateId && publicKey && formRef.current) {
        promises.push(
          emailjs.sendForm(serviceId, templateId, formRef.current, { publicKey })
        );
      }

      const results = await Promise.allSettled(promises);

      // Check support API result for ticket ID
      const supportResult = results[0];
      if (supportResult.status === 'fulfilled') {
        const apiRes = supportResult.value as { success: boolean; ticket?: { ticketId?: string } };
        if (apiRes?.ticket?.ticketId) {
          setTicketId(apiRes.ticket.ticketId);
        }
      }

      // If at least one succeeded, show success
      const anySuccess = results.some((r) => r.status === 'fulfilled');
      if (anySuccess) {
        setStatus('success');
        formRef.current?.reset();
      } else {
        console.error('All submission methods failed:', results);
        setStatus('error');
      }
    } catch (error) {
      console.error('Submission Error:', error);
      setStatus('error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-black py-20 sm:py-24 lg:py-28">
      {/* Background subtle glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00629b]/[0.05] blur-[120px]" />

      {/* Main container */}
      <div className="relative z-10 mx-auto max-w-3xl px-5 sm:px-8">
        {/* Heading */}
        <div className="mb-10 text-center sm:mb-12">
          <h2 className="text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl md:text-6xl">
            Contact <span className="text-brand-blue-dark">Us</span>
          </h2>
        </div>

        {/* Contact Form */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="
            rounded-2xl
            border
            border-white/[0.08]
            bg-black
            p-5
            shadow-[0_20px_70px_rgba(0,0,0,0.35)]
            sm:rounded-3xl
            sm:p-8
            lg:p-10
          "
        >
          {/* Name */}
          <div className="mb-5">
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-white/80">
              Name
            </label>

            <div className="relative">
              <User
                size={18}
                className="
                  pointer-events-none
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-white/30
                "
              />

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                required
                autoComplete="name"
                className="
                  w-full
                  rounded-xl
                  border
                  border-white/10
                  bg-black/40
                  py-3.5
                  pl-11
                  pr-4
                  text-sm
                  text-white
                  outline-none
                  transition
                  placeholder:text-white/25
                  focus:border-[#00629b]
                  focus:ring-1
                  focus:ring-[#00629b]
                "
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-5">
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-white/80">
              Email
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="
                  pointer-events-none
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-white/30
                "
              />

              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="
                  w-full
                  rounded-xl
                  border
                  border-white/10
                  bg-black/40
                  py-3.5
                  pl-11
                  pr-4
                  text-sm
                  text-white
                  outline-none
                  transition
                  placeholder:text-white/25
                  focus:border-[#00629b]
                  focus:ring-1
                  focus:ring-[#00629b]
                "
              />
            </div>
          </div>

          {/* Subject */}
          <div className="mb-5">
            <label htmlFor="subject" className="mb-2 block text-sm font-medium text-white/80">
              Subject
            </label>

            <div className="relative">
              <FileText
                size={18}
                className="
                  pointer-events-none
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-white/30
                "
              />

              <input
                id="subject"
                name="subject"
                type="text"
                placeholder="What would you like to discuss?"
                required
                className="
                  w-full
                  rounded-xl
                  border
                  border-white/10
                  bg-black/40
                  py-3.5
                  pl-11
                  pr-4
                  text-sm
                  text-white
                  outline-none
                  transition
                  placeholder:text-white/25
                  focus:border-[#00629b]
                  focus:ring-1
                  focus:ring-[#00629b]
                "
              />
            </div>
          </div>

          {/* Message */}
          <div className="mb-6">
            <label htmlFor="message" className="mb-2 block text-sm font-medium text-white/80">
              Message
            </label>

            <textarea
              id="message"
              name="message"
              rows={6}
              placeholder="Write your message here..."
              required
              className="
                w-full
                resize-none
                rounded-xl
                border
                border-white/10
                bg-black/40
                px-4
                py-3.5
                text-sm
                leading-6
                text-white
                outline-none
                transition
                placeholder:text-white/25
                focus:border-[#00629b]
                focus:ring-1
                focus:ring-[#00629b]
              "
            />
          </div>

          {/* Success Message */}
          {status === 'success' && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-green-400/20 bg-green-400/5 px-4 py-3">
              <CheckCircle2 size={19} className="mt-0.5 shrink-0 text-green-400" />

              <div className="text-sm leading-5 text-green-300">
                <p>Your message has been sent successfully. We will get back to you soon.</p>
                {ticketId && (
                  <p className="mt-1 text-xs text-green-400/80">
                    Your ticket ID: <span className="font-mono font-semibold text-green-300">{ticketId}</span>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Error Message */}
          {status === 'error' && (
            <div className="mb-5 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3">
              <p className="text-sm leading-5 text-red-300">
                Something went wrong while sending your message. Please try again.
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSending}
            className="
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-yellow-400
              px-6
              py-3.5
              text-sm
              font-bold
              text-black
              shadow-[0_8px_25px_rgba(250,204,21,0.1)]
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-yellow-300
              hover:shadow-[0_12px_30px_rgba(250,204,21,0.2)]
              disabled:cursor-not-allowed
              disabled:opacity-50
              disabled:hover:translate-y-0
            "
          >
            {isSending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Send Message
                <Send size={16} strokeWidth={2.5} />
              </>
            )}
          </button>

          {/* Small privacy note */}
          <p className="mt-4 text-center text-[11px] leading-5 text-white/25">
            Your information is used only to respond to your enquiry.
          </p>
        </form>
      </div>
    </section>
  );
}
