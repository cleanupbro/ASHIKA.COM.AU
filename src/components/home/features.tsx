import { Container } from "@/components/layout";

function PremiumQualityIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Crown / Diamond — representing premium luxury */}
      <path
        d="M24 6L30 18L42 14L36 30H12L6 14L18 18L24 6Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-icon-draw"
      />
      <line
        x1="12"
        y1="30"
        x2="36"
        y2="30"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line
        x1="14"
        y1="34"
        x2="34"
        y2="34"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Sparkle */}
      <circle
        cx="24"
        cy="18"
        r="2"
        fill="currentColor"
        className="animate-icon-pulse"
      />
    </svg>
  );
}

function PerfectFitIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Measuring tape / ruler with check — representing perfect fit */}
      <path
        d="M10 14V38H14V14H10Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-icon-draw"
      />
      {/* Tick marks */}
      <line
        x1="14"
        y1="18"
        x2="18"
        y2="18"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line
        x1="14"
        y1="22"
        x2="16"
        y2="22"
        stroke="currentColor"
        strokeWidth="1"
      />
      <line
        x1="14"
        y1="26"
        x2="18"
        y2="26"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line
        x1="14"
        y1="30"
        x2="16"
        y2="30"
        stroke="currentColor"
        strokeWidth="1"
      />
      <line
        x1="14"
        y1="34"
        x2="18"
        y2="34"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Checkmark */}
      <path
        d="M26 24L30 28L38 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-icon-check"
      />
    </svg>
  );
}

function HassleReturnsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Return arrow with box — representing hassle-free returns */}
      <rect
        x="14"
        y="20"
        width="20"
        height="18"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-icon-draw"
      />
      <polyline
        points="20,20 24,14 28,20"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Return arrow */}
      <path
        d="M38 12C38 12 42 16 38 20M38 20L35 17M38 20L41 17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-icon-bounce"
      />
    </svg>
  );
}

function ExpressDeliveryIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Delivery truck — representing express delivery */}
      <rect
        x="4"
        y="18"
        width="24"
        height="14"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
        className="animate-icon-draw"
      />
      <path
        d="M28 22H34L40 28V32H28V22Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Wheels */}
      <circle
        cx="14"
        cy="34"
        r="3"
        stroke="currentColor"
        strokeWidth="1.5"
        className="animate-icon-spin-slow"
      />
      <circle
        cx="34"
        cy="34"
        r="3"
        stroke="currentColor"
        strokeWidth="1.5"
        className="animate-icon-spin-slow"
      />
      {/* Speed lines */}
      <line
        x1="2"
        y1="24"
        x2="6"
        y2="24"
        stroke="currentColor"
        strokeWidth="1"
        className="animate-icon-dash"
      />
      <line
        x1="0"
        y1="28"
        x2="5"
        y2="28"
        stroke="currentColor"
        strokeWidth="1"
        className="animate-icon-dash-delay"
      />
    </svg>
  );
}

const features = [
  {
    title: "Premium Quality",
    description: "Hand-picked, luxury ethnic wear from top designers.",
    IconComponent: PremiumQualityIcon,
  },
  {
    title: "Perfect Fit Guarantee",
    description: "Custom fitting options to ensure you look your best.",
    IconComponent: PerfectFitIcon,
  },
  {
    title: "Hassle-Free Returns",
    description: "Easy returns with pre-paid shipping labels included.",
    IconComponent: HassleReturnsIcon,
  },
  {
    title: "Express Delivery",
    description: "Fast shipping across Australia for your last-minute events.",
    IconComponent: ExpressDeliveryIcon,
  },
];

export function Features() {
  return (
    <section className="py-24 bg-brand-offwhite border-t border-gray-100">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="text-center group cursor-default"
            >
              <div className="feature-icon-container">
                <feature.IconComponent className="w-7 h-7 text-brand-black/70 group-hover:text-brand-black transition-colors duration-500" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-brand-black mb-3">
                {feature.title}
              </h3>
              <p className="text-[11px] font-bold text-gray-400 leading-relaxed uppercase tracking-wide">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
