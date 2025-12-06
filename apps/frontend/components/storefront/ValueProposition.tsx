import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';

export default function ValueProposition() {
  const benefits = [
    'Carefully curated collection',
    'Latest fashion trends',
    'Competitive pricing',
    'Secure payment options',
    'Fast & reliable delivery',
    'Customer satisfaction guaranteed'
  ];

  return (
    <Section background="white" spacing="lg">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Side - Premium Gradient Design */}
          <div className="relative aspect-square lg:aspect-[4/5] rounded-3xl overflow-hidden animate-fade-in">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />

            {/* Floating Gradient Orbs */}
            <div className="absolute top-1/4 left-1/4 w-[60%] h-[60%] rounded-full blur-[80px] opacity-60 bg-gradient-to-br from-primary to-purple-600 animate-float" />
            <div className="absolute bottom-1/4 right-1/4 w-[50%] h-[50%] rounded-full blur-[60px] opacity-50 bg-gradient-to-br from-pink-500 to-purple-500 animate-float-slow" />

            {/* Grid Pattern */}
            <div
              className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                backgroundSize: '30px 30px'
              }}
            />

            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center">
              <span className="inline-block px-4 py-1.5 text-xs font-medium tracking-widest uppercase text-white/70 border border-white/20 rounded-full mb-6">
                Our Promise
              </span>
              <h3 className="text-3xl md:text-4xl font-bold mb-4 text-shadow-lg">
                <span className="text-gradient-premium">Premium Quality</span>
              </h3>
              <p className="text-white/70 max-w-xs text-lg">
                Every piece is crafted with care and attention to detail
              </p>
            </div>
          </div>

          {/* Content Side */}
          <div className="space-y-8 animate-slide-up">
            <div>
              <span className="inline-block text-sm font-semibold tracking-wider uppercase text-primary mb-3">
                Why Choose Us
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                Why Shop <span className="text-gradient-premium">With Us?</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                We're committed to bringing you the best shopping experience with quality products, excellent service, and unbeatable value.
              </p>
            </div>

            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li
                  key={index}
                  className="flex items-center space-x-4 group animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/25 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium text-lg group-hover:text-gray-900 transition-colors duration-300">{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <p className="text-sm text-gray-500 italic flex items-center gap-2">
                <span className="w-8 h-px bg-gradient-to-r from-primary to-transparent" />
                Join thousands of satisfied customers who trust us for their fashion needs.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

