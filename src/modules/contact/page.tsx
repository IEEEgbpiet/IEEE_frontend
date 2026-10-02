import { useEffect } from 'react';
import { ChangeEvent, FormEvent, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { CheckCircle2, FileText, Mail, Paperclip, Send, User, X } from 'lucide-react';

export default function ContactPage() {
  useEffect(() => {
    document.title = 'Contact Us ';
  }, []);
  // -------------------------------------------------------
  // Form reference
  // EmailJS sendForm() directly HTML form ko read karega.
  // -------------------------------------------------------
  const formRef = useRef<HTMLFormElement>(null);

  // Selected file ko UI mein show karne ke liye
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Loading state
  const [isSending, setIsSending] = useState(false);

  // Success / error message
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // -------------------------------------------------------
  // Environment variables
  // -------------------------------------------------------
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  // -------------------------------------------------------
  // File selection handler
  // -------------------------------------------------------
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    setSelectedFile(file);
    setStatus('idle');
  };

  // -------------------------------------------------------
  // Remove selected file
  // -------------------------------------------------------
  const removeFile = () => {
    setSelectedFile(null);

    // File input ko reset karna
    if (formRef.current) {
      const fileInput = formRef.current.elements.namedItem('attachment') as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = '';
      }
    }
  };

  // -------------------------------------------------------
  // Submit form
  // -------------------------------------------------------
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setStatus('idle');

    // Configuration missing hai to request mat bhejo
    if (!serviceId || !templateId || !publicKey) {
      console.error('EmailJS configuration is missing. Check your .env file.');

      setStatus('error');
      return;
    }

    if (!formRef.current) {
      setStatus('error');
      return;
    }

    try {
      setIsSending(true);

      // ---------------------------------------------------
      // EmailJS sendForm
      //
      // sendForm automatically form ke values collect karta
      // hai aur EmailJS template ko send karta hai.
      // ---------------------------------------------------
      await emailjs.sendForm(serviceId, templateId, formRef.current, {
        publicKey,
      });

      // Success
      setStatus('success');

      // Form reset
      formRef.current.reset();

      // Selected file UI reset
      setSelectedFile(null);
    } catch (error) {
      console.error('EmailJS Error:', error);

      setStatus('error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-black py-20 sm:py-24 lg:py-28">
      {/* ---------------------------------------------------
          Background subtle glow
          --------------------------------------------------- */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00629b]/[0.05] blur-[120px]" />

      {/* ---------------------------------------------------
          Main container
          --------------------------------------------------- */}
      <div className="relative z-10 mx-auto max-w-3xl px-5 sm:px-8">
        {/* =================================================
            HEADING
            ================================================= */}
        <div className="mb-10 text-center sm:mb-12">
          <h2 className="text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl md:text-6xl">
            Contact <span className="text-brand-blue-dark">Us</span>
          </h2>
        </div>

        {/* =================================================
            CONTACT FORM
            ================================================= */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          encType="multipart/form-data"
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
          {/* =================================================
              NAME
              ================================================= */}
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

          {/* =================================================
              EMAIL
              ================================================= */}
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

          {/* =================================================
              SUBJECT
              ================================================= */}
          <div className="mb-5">
            <label htmlFor="subject" className="mb-2 block text-sm font-medium text-white/80">
              Subject
            </label>

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
                px-4
                py-3.5
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

          {/* =================================================
              DESCRIPTION / MESSAGE
              ================================================= */}
          <div className="mb-5">
            <label htmlFor="message" className="mb-2 block text-sm font-medium text-white/80">
              Description
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

          {/* =================================================
              FILE UPLOAD
              ================================================= */}
          <div className="mb-6">
            <label htmlFor="attachment" className="mb-2 block text-sm font-medium text-white/80">
              Attachment
              <span className="ml-2 text-xs font-normal text-white/30">Optional</span>
            </label>

            {/* Hidden actual file input */}
            <input
              id="attachment"
              name="attachment"
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Custom upload button */}
            {!selectedFile && (
              <label
                htmlFor="attachment"
                className="
                  flex
                  cursor-pointer
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-dashed
                  border-white/15
                  bg-black/30
                  px-4
                  py-4
                  transition
                  hover:border-[#00629b]/60
                  hover:bg-[#00629b]/5
                "
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#00629b]/10 text-brand-blue-dark">
                  <Paperclip size={19} />
                </div>

                <div>
                  <p className="text-sm font-medium text-white/75">Choose a file</p>

                  <p className="mt-0.5 text-xs text-white/30">
                    PDF, DOC, DOCX, JPG, PNG or other supported files
                  </p>
                </div>
              </label>
            )}

            {/* Selected file */}
            {selectedFile && (
              <div className="flex items-center justify-between gap-3 rounded-xl border border-[#00629b]/20 bg-[#00629b]/5 px-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#00629b]/10 text-brand-blue-dark">
                    <FileText size={18} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white/80">
                      {selectedFile.name}
                    </p>

                    <p className="text-xs text-white/30">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={removeFile}
                  aria-label="Remove attachment"
                  className="
                    shrink-0
                    rounded-lg
                    p-2
                    text-white/40
                    transition
                    hover:bg-white/10
                    hover:text-red-400
                  "
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </div>

          {/* =================================================
              SUCCESS MESSAGE
              ================================================= */}
          {status === 'success' && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-green-400/20 bg-green-400/5 px-4 py-3">
              <CheckCircle2 size={19} className="mt-0.5 shrink-0 text-green-400" />

              <p className="text-sm leading-5 text-green-300">
                Your message has been sent successfully. We will get back to you soon.
              </p>
            </div>
          )}

          {/* =================================================
              ERROR MESSAGE
              ================================================= */}
          {status === 'error' && (
            <div className="mb-5 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3">
              <p className="text-sm leading-5 text-red-300">
                Something went wrong while sending your message. Please try again.
              </p>
            </div>
          )}

          {/* =================================================
              SUBMIT BUTTON
              ================================================= */}
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
                {/* Loading spinner */}
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
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
