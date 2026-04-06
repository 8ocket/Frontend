import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { notFound } from 'next/navigation';
import { TERMS_LIST, TERMS_CONTENT, AgreementKey } from '@/shared/constants/terms';

type Props = { params: { key: AgreementKey } };

export default function TermsPage({ params }: Props) {
  const meta = TERMS_LIST.find((t) => t.key === params.key);
  if (!meta) notFound();

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="mb-8 text-[20px] font-semibold">{meta.label}</h1>
      <div className="prose prose-sm max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{TERMS_CONTENT[params.key]}</ReactMarkdown>
      </div>
    </main>
  );
}
