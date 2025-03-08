import { Sidebar } from '@/components/sidebar';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { legal } from '@repo/cms';
import { Body } from '@repo/cms/components/body';
import { Feed } from '@repo/cms/components/feed';
import { TableOfContents } from '@repo/cms/components/toc';
import { createMetadata } from '@repo/seo/metadata';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Balancer from 'react-wrap-balancer';

type LegalPageProperties = {
  readonly params: Promise<{
    slug: string;
  }>;
};

// Define the structure of the image
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

// Define the structure of the data returned by legal.postQuery
interface LegalData {
  legalPages: {
    item: Post | null;
  };
}

export const generateMetadata = async ({
  params,
}: LegalPageProperties): Promise<Metadata> => {
  const { slug } = await params;
  const post = await legal.getPost(slug);

  if (!post) {
    return {};
  }

  return createMetadata({
    title: post._title,
    description: post.description,
  });
};

export const generateStaticParams = async (): Promise<{ slug: string }[]> => {
  const posts = await legal.getPosts();

  return posts.map(({ _slug }) => ({ slug: _slug }));
};

const LegalPage = async ({ params }: LegalPageProperties) => {
  const { slug } = await params;

  return (
    <Feed queries={[legal.postQuery(slug)]}>
      {/* biome-ignore lint/suspicious/useAwait: "Server Actions must be async" */}
      {async ([data] : [LegalData]) => {
        'use server';

        const page = data.legalPages.item;

        if (!page) {
          notFound();
        }

        return (
          <div className="container max-w-5xl py-16">
            <Link
              className="mb-4 inline-flex items-center gap-1 text-muted-foreground text-sm focus:underline focus:outline-none"
              href="/"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Home
            </Link>
            <h1 className="scroll-m-20 font-extrabold text-4xl tracking-tight lg:text-5xl">
              <Balancer>{page._title}</Balancer>
            </h1>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <Balancer>{page.description}</Balancer>
            </p>
            <div className="mt-16 flex flex-col items-start gap-8 sm:flex-row">
              <div className="sm:flex-1">
                <div className="prose prose-neutral dark:prose-invert">
                  <Body content={page.body.json.content} />
                </div>
              </div>
              <div className="sticky top-24 hidden shrink-0 md:block">
                <Sidebar
                  toc={<TableOfContents data={page.body.json.toc} />}
                  readingTime={`${page.body.readingTime} min read`}
                  date={new Date()}
                />
              </div>
            </div>
          </div>
        );
      }}
    </Feed>
  );
};

export default LegalPage;
