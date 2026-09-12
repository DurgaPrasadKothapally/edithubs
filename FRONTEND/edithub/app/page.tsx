import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedSection } from '@/components/home/FeaturedSection';
import { getFeaturedTutorials } from '@/lib/tutorials';
import { getFeaturedResources } from '@/lib/resources';

export const revalidate = 60; // ISR — revalidate every 60s

export default async function HomePage() {
  const [tutorials, resources] = await Promise.all([
    getFeaturedTutorials(6),
    getFeaturedResources(6),
  ]);

  return (
    <>
      <HeroSection />
      <FeaturedSection tutorials={tutorials} resources={resources} />
    </>
  );
}
