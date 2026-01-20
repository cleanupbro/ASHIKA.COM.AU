import {
  Hero,
  TrustBadges,
  CategoriesGrid,
  HowItWorks,
  FeaturedProducts,
  Testimonials,
  Newsletter,
} from '@/components/home';

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBadges />
      <CategoriesGrid />
      <FeaturedProducts />
      <HowItWorks />
      <Testimonials />
      <Newsletter />
    </>
  );
}
