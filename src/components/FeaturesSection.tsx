import { ArrowRight, TrendingUp, Coins, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: TrendingUp,
    badge: 'Lowest transactions fees < 0.3%',
    title: 'Trade all crypto in one place',
    description: 'BTC, ETH, SOL, XRP, and 350+ cryptocurrencies',
    color: 'bg-blue-500/10 text-blue-600',
    link: '/trade/BTC',
  },
  {
    icon: Coins,
    badge: '7 days interest-free',
    title: 'Cryptocurrency loans',
    description: 'Borrow crypto with low interest. Max 15 days loan period.',
    color: 'bg-green-500/10 text-green-600',
    link: '/loan',
  },
  {
    icon: Zap,
    badge: 'Simple and stable',
    title: 'Smart trading',
    description: 'One click to create your earning plan',
    color: 'bg-primary/10 text-primary',
    link: '/trade/BTC',
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card group cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6" />
              </div>
              
              <p className="text-xs text-muted-foreground mb-2">{feature.badge}</p>
              
              <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
              
              <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>
              
              <Link 
                to={feature.link}
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all duration-200"
              >
                Get started
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
