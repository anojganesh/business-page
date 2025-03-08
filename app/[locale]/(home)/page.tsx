import { showBetaFeature } from '@repo/feature-flags';
import { getDictionary } from '@repo/internationalization';
import { createMetadata } from '@repo/seo/metadata';
import type { Metadata } from 'next';
import { Cases } from './components/cases';
import { CTA } from './components/cta';
import { FAQ } from './components/faq';
import { Features } from './components/features';
import { Hero } from './components/hero';
import { Stats } from './components/stats';
import { Testimonials } from './components/testimonials';

type HomeProps = {
  params: Promise<{
    locale: string;
  }>;
};

interface ImageData {
  url: string;
  width: number;
  height: number;
  alt?: string;
}

// Define the structure of the body
interface BodyData {
  json: {
    content: any; // Adjust this type if you know the exact structure
    toc: any; // Adjust this type if you know the exact structure
  };
  readingTime: number;
}

// Define the structure of the post
interface Post {
  _slug: string;
  _title: string;
  description: string;
  date: string;
  image: ImageData;
  body: BodyData;
  authors: Array<{ _title: string }>;
}

// Define the structure of the data returned by blog.postsQuery
interface BlogData {
  blog: {
    posts: {
      items: Post[];
    };
  };
}

export const generateMetadata = async ({
  params,
}: HomeProps): Promise<Metadata> => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return createMetadata(dictionary.web.home.meta);
};

const Home = async ({ params }: HomeProps) => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  const betaFeature = await showBetaFeature();

  return (
    <>
      {betaFeature && (
        <div className="w-full bg-black py-2 text-center text-white">
          Beta feature now available
        </div>
      )}
      <Hero dictionary={dictionary} />
      <Cases dictionary={dictionary} />
      <Features dictionary={dictionary} />
      <Stats dictionary={dictionary} />
      <Testimonials dictionary={dictionary} />
      <FAQ dictionary={dictionary} />
      <CTA dictionary={dictionary} />
    </>
  );
};

export default Home;
