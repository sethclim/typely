import { createFileRoute, Link } from '@tanstack/react-router'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

export const Route = createFileRoute('/pricing')({
  component: RouteComponent,
})

const plans = [
  {
    name: "Free",
    price: "$0",
    features: ["100 Free Compiles", "Local First Data"],
    to: "/app"
  },
  {
    name: "Tokens",
    price: "$30",
    features: ["10,000 compiles", "Local First Data", "Cloud Sync"],
    popular: true,
  },
  {
    name: "Subscription",
    price: "$100/year",
    features: ["Unlimited Compiles", "Local First Data", "Cloud Sync"],
  },
];

const PricingCard = ({ plan } : any) => (
  <div
    className={`
      flex flex-col p-6 rounded-xl
      bg-dark/20
      border border-white/30
      shadow-lg
      ${plan.popular ? "border-blue-300 shadow-2xl bg-primary/60" : ""}
    `}
  >
    <h2 className="text-xl font-semibold mb-4 text-mywhite">{plan.name}</h2>
    <p className="text-4xl font-bold mb-4 text-mywhite">{plan.price}</p>
    <ul className="mb-6 space-y-2 flex-1 text-mywhite">
      {plan.features.map((f : any, i : number) => (
        <li key={i}>✔ {f}</li>
      ))}
    </ul>
    <Link to={plan.to} className={`bg-dark hover:brightness-130 ${plan.popular ? "bg-primary brightness-80 " : ""} text-white py-2 rounded transition`}>
      Get Started
    </Link>
  </div>
);
  
const PricingCards = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 grid gap-8 md:grid-cols-3">
      {plans.map((plan, i) => (
        <PricingCard key={i} plan={plan} />
      ))}
    </div>
  );
};

function RouteComponent() {
  return (
    <>
      <Header />
        <div className='grow flex flex-col justify-center bg-darkest'>
          <header className="text-center py-12">
            <h1 className="text-4xl font-bold mb-2 text-mywhite">Our Pricing Plans</h1>
          </header>
          <div>
            <PricingCards />
          </div>
        </div>
      <Footer />
    </>
  )
}
