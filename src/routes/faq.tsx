import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/faq')({
  component: RouteComponent,
})

import { useState } from "react";
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

const faqs = [
  {
    question: "What is your refund policy?",
    answer: "We offer a full refund within 30 days of purchase, no questions asked.",
  },
  {
    question: "Can I upgrade my plan later?",
    answer: "Yes! You can upgrade or downgrade your plan at any time from your account settings.",
  },
  {
    question: "Do you offer support?",
    answer: "Absolutely! Our support team is available 24/7 via chat and email.",
  },
  {
    question: "Is there a free trial?",
    answer: "Yes, we offer a 14-day free trial with full access to all features.",
  },
];

const FAQItem = ({ faq } : any) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-grey py-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left flex justify-between items-center text-lg font-medium text-white"
      >
        {faq.question}
        <span className="ml-2">{open ? "−" : "+"}</span>
      </button>
      {open && <p className="mt-2 text-mywhite">{faq.answer}</p>}
    </div>
  );
};

const FAQPage = () => {
  return (
    <div className=" h-full grow p-8 pt-60">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-2">Frequently Asked Questions</h1>
        <p className="text-gray-300">Find answers to the most common questions below.</p>
      </header>

      <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg">
        {faqs.map((faq, i) => (
          <FAQItem key={i} faq={faq} />
        ))}
      </div>
    </div>
  );
};


function RouteComponent() {
  return (
    <>
      <div className='grow flex flex-col justify-center bg-gradient-to-tr from-darkest via-purple-900 to-purple-700'>
      <Header bg="bg-darkest/10" />
        <FAQPage />
      <Footer bg="bg-darkest/10"  />
      </div>
    </>
  )
}
