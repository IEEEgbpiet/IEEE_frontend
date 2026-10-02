'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

type FAQ = {
  question: string;
  answer: string;
};

const faqs: FAQ[] = [
  {
    question: 'What is the perks of being a student member of IEEE?',
    answer:
      'Stay updated with the latest technology and gadgets As a student you will be exposed to various technical conferences Skills Cultivation in you like Leadership, team management',
  },
  {
    question: 'What is IEEE Student Chapter?',
    answer:
      'The main purpose of the IEEE is to engage exclusively in scientific and educational activities within the meaning of Section 501(c)(3) of Internal Revenue Code of 1986, as amended, directed toward the advancement of the theory and practice of allied branches of engineering and related art and sciences, which benefit the engineering profession and the public.',
  },
  {
    question: 'Aim of this IEEE?',
    answer:
      'To encourage and support students to put their creativity and intelligence into action. It helps students to bring up a lot of amazing Ideas towards cultural and technical Fields. ',
  },
  {
    question: 'What is Technical Current?',
    answer:
      'With technical Magazines like IEEE Spectrum, IEEE Potentials and IEEE The Institute Newsletter, You will be ale to stay updated with the latest advancements in your field of interest and all fields in general. ',
  },
  {
    question: 'Do we have some cultural activities in this IEEE?',
    answer:
      'IEEE basically created for encouraging students activities in every field Technical, Cultural and also building good  management Qualities. ',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section className="relative overflow-hidden bg-black px-5 py-20 text-white sm:px-8 lg:px-16">
      {/* Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-[#00629b]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-14 text-center">
          <h2 className="text-8xl font-bold tracking-tight sm:text-5xl">FAQ</h2>

          <div className="mx-auto mt-4 h-[2px] w-16 bg-[#00629b]" />

          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-white/55 sm:text-base">
            Most frequent questions and answers about IEEE
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className="group overflow-hidden rounded-sm border border-white/10 bg-[#080808]"
                style={{
                  animation: `faqFadeUp 0.6s ease-out ${index * 100}ms both`,
                }}
              >
                {/* Question */}
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={isOpen}
                  className={`
                    flex w-full items-center justify-between gap-6
                    px-6 py-6 text-left
                    transition-all duration-300
                    sm:px-8
                    ${isOpen ? 'bg-[#00629b]/10' : 'hover:bg-[#00629b]/5'}
                  `}
                >
                  <span
                    className={`
                      text-sm font-bold transition-colors duration-300
                      sm:text-base
                      ${
                        isOpen
                          ? 'text-brand-blue-dark'
                          : 'text-white group-hover:text-brand-blue-dark'
                      }
                    `}
                  >
                    {faq.question}
                  </span>

                  <ChevronRight
                    size={20}
                    strokeWidth={2}
                    className={`
                      shrink-0 text-brand-blue-dark
                      transition-transform duration-500
                      ${isOpen ? 'rotate-90' : 'rotate-0'}
                    `}
                  />
                </button>

                {/* Animated Answer */}
                <div
                  className={`
                    grid transition-[grid-template-rows,opacity]
                    duration-500 ease-in-out
                    ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}
                  `}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div className="border-t border-[#00629B]/20 px-6 pb-7 pt-5 sm:px-8">
                      <p className="max-w-3xl text-sm leading-7 text-white/65 sm:text-base">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>

                {/* IEEE Blue Bottom Line */}
                <div
                  className={`
                    h-[2px] origin-left bg-[#00629b]
                    transition-transform duration-500
                    ${isOpen ? 'scale-x-100' : 'scale-x-0'}
                  `}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes faqFadeUp {
          from {
            opacity: 0;
            transform: translateY(25px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
