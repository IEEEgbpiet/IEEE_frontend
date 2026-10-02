import Hero from './components/Hero';
import Whoarewe from './components/whoweare';
import Stats from './components/stats';
import Whowedo from './components/whatwedo';
import UpcomingEvents from './components/UpcomingEvents';
import Gallery from './components/Gallery';
import JoinIeee from './components/join.CTA';
import FAQ from './components/FAQ';

export default function HomePage() {
  return (
    <div>
      <Hero />
      <Whoarewe />
      <Stats />
      <Whowedo />
      <UpcomingEvents />
      <Gallery />
      <FAQ/>
      <JoinIeee />
    </div>
  );
}
