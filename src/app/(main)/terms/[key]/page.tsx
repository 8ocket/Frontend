import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { notFound } from 'next/navigation';
import { TERMS_LIST, TERMS_CONTENT, AgreementKey } from '@/shared/constants/terms';

type Props = { params: Promise<{ key: AgreementKey }> };

export default async function TermsPage({ params }: Props) {
  const { key } = await params;
  const meta = TERMS_LIST.find((t) => t.key === key);
  if (!meta) notFound();

  return (
    <div className="min-h-main-safe layout-container px-gutter">
      <main className="mx-auto max-w-6xl pt-20 pb-32 sm:pt-28">
        <div className="mb-14 sm:mb-20">
          <h1 className="text-prime-900 mb-3 text-[28px] leading-tight font-bold tracking-tight sm:text-[36px]">
            {meta.label}
          </h1>
        </div>
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{TERMS_CONTENT[key]}</ReactMarkdown>
        </div>
      </main>
    </div>
  );
}
