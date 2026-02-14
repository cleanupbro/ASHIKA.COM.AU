import {
  Hero,
  Borrowhood,
  CategoriesGrid,
  FeaturedProducts,
  Testimonials,
  Newsletter,
} from '@/components/home';

export default function Home() {
  return (
    <>
      <Hero />
      <Borrowhood />
      <CategoriesGrid />
      <FeaturedProducts />
      <Testimonials />
      <Newsletter />
    </>
  );
}
