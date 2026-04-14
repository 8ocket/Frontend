'use client';

import Link from 'next/link';
import { Home, RefreshCcw, ShieldAlert } from 'lucide-react';
import { useEffect } from 'react';

import { ErrorState } from '@/shared/ui/ErrorState';
import { getErrorStatus } from '@/shared/lib/utils/error';

type AppErrorProps = {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
};

export default function GlobalErrorPage({ error, reset }: AppErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const status = getErrorStatus(error);
  const is506 = status === 506;

  if (is506) {
    return (
      <ErrorState
        eyebrow="Service Error"
        code="506"
        title="서비스 이용에 불편을 드려 죄송합니다."
        description={[
          '현재 서버 내부의 설정 충돌로 인해 요청하신 정보를 처리하는 과정에서 기술적 오류가 발생했습니다.',
          '이는 사용자님의 기기 문제가 아니며, 기술팀이 인지하여 복구 중에 있습니다.',
        ]}
        accentIcon={ShieldAlert}
        actions={[
          {
            label: '다시 시도하기',
            onClick: reset,
            icon: RefreshCcw,
          },
          {
            label: '메인 페이지로 이동',
            href: '/',
            variant: 'secondary',
            icon: Home,
          },
        ]}
        helpTitle="수행 가능한 작업"
        helpItems={[
          <p key="refresh">
            <span className="font-semibold">다시 시도하기:</span> 일시적인 네트워크 간섭일 수
            있으므로 잠시 후 다시 시도해 보세요.
          </p>,
          <p key="retry">
            <span className="font-semibold">잠시 후 재접속:</span> 시스템 최적화 작업이 끝난 후
            다시 시도해 주시기 바랍니다.
          </p>,
          <p key="report">
            <span className="font-semibold">오류 보고하기:</span> 문제가 계속된다면{' '}
            <Link
              href="/support"
              className="text-cta-700 hover:text-cta-800 font-semibold underline underline-offset-4 transition-colors"
            >
              문의하기
            </Link>
            를 통해 알려주세요.
          </p>,
        ]}
        infoTitle="시스템 무결성 보호를 위한 정보"
        infoItems={[
          {
            label: '오류 유형',
            value: 'Content Negotiation Configuration Error (506)',
          },
          {
            label: '참조 ID',
            value: error.digest ? `#${error.digest}` : '#CURA-2026-ERR-506-001',
            description: '상담 시 이 번호를 알려주시면 더 빠르게 처리할 수 있습니다.',
          },
        ]}
      />
    );
  }

  return (
    <ErrorState
      eyebrow="Unexpected Error"
      code={status ? String(status) : '500'}
      title="예상하지 못한 오류가 발생했어요."
      description={[
        '일시적인 문제일 수 있으니 잠시 후 다시 시도해 주세요.',
        '문제가 계속된다면 문의하기를 통해 알려주시면 빠르게 확인하겠습니다.',
      ]}
      accentIcon={ShieldAlert}
      actions={[
        {
          label: '다시 시도하기',
          onClick: reset,
          icon: RefreshCcw,
        },
        {
          label: '메인 페이지로 이동',
          href: '/',
          variant: 'secondary',
          icon: Home,
        },
      ]}
      helpTitle="도움이 필요하신가요?"
      helpItems={[
        <p key="retry">
          <span className="font-semibold">다시 시도하기:</span> 네트워크 상태를 확인한 뒤 한 번
          더 요청해 보세요.
        </p>,
        <p key="support">
          <span className="font-semibold">문의하기:</span> 같은 문제가 반복된다면{' '}
          <Link
            href="/support"
            className="text-cta-700 hover:text-cta-800 font-semibold underline underline-offset-4 transition-colors"
          >
            문의하기
          </Link>
          를 통해 상황을 알려주세요.
        </p>,
      ]}
      infoTitle="오류 정보"
      infoItems={[
        {
          label: '오류 코드',
          value: status ? String(status) : '500',
        },
        {
          label: '참조 ID',
          value: error.digest ? `#${error.digest}` : 'Unavailable',
        },
      ]}
    />
  );
}
