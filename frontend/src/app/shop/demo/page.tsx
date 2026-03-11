'use client';

import { useState } from 'react';

import { StatusModal } from '@/components/ui/status-modal';
import { PurchaseConfirmDialog } from '@/components/shop/PurchaseConfirmDialog';
import type { CreditProduct } from '@/types/credit';

// ── 데모용 mock 상품 ────────────────────────────────────────────
const MOCK_PRODUCT: CreditProduct = {
  id: '02',
  name: '중형 상품',
  credits: 1000,
  price: 9900,
  priceFormatted: '9,900',
  paymentType: '건당 결제',
  discount: '소형 상품보다 10% 혜택',
  benefits: [
    '추가 상담권 14번 구매 가능(980크레딧)',
    '디자인 5종 해금(1000크레딧)',
    '주간 리포트 2번 발행(1000크레딧)',
    '월간 리포트 1번 발행(800크레딧)',
  ],
};

type ModalKey =
  | 'full-flow'
  | 'refund-policy'
  | 'processing'
  | 'success'
  | 'error'
  | 'product-updated'
  | null;

const MODAL_LIST: { key: ModalKey; label: string; semantic: string }[] = [
  { key: 'full-flow', label: '전체 구매 플로우', semantic: '📋 환불정책 → 확인 → 결제' },
  { key: 'refund-policy', label: '환불 정책 확인', semantic: '🔴 Red + Checkbox (MODAL 16)' },
  { key: 'processing', label: '결제 진행중', semantic: '🔵 Blue + Spinner (MODAL 3)' },
  { key: 'success', label: '결제 완료', semantic: '🟢 Green (MODAL 01)' },
  { key: 'error', label: '결제 중단', semantic: '🔴 Red (MODAL 2)' },
  { key: 'product-updated', label: '상품 정보 갱신', semantic: '🟡 Yellow (MODAL 4)' },
];

export default function ShopModalDemoPage() {
  const [active, setActive] = useState<ModalKey>(null);
  const close = () => setActive(null);

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-prime-900 mb-2 text-3xl font-bold">🛒 Shop Modal 데모</h1>
      <p className="text-prime-600 mb-8">버튼을 눌러 각 구매 모달 단계를 테스트해 보세요.</p>

      <div className="grid grid-cols-2 gap-4">
        {MODAL_LIST.map(({ key, label, semantic }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActive(key)}
            className="bg-secondary-100 hover:border-cta-300 hover:bg-cta-100 flex flex-col gap-1 rounded-xl border-2 border-neutral-300 p-4 text-left transition-colors"
          >
            <span className="text-prime-900 text-base font-semibold">{label}</span>
            <span className="text-tertiary-400 text-sm">{semantic}</span>
          </button>
        ))}
      </div>

      {/* ── 전체 구매 플로우 (환불정책 → 확인 → 결제) ── */}
      <PurchaseConfirmDialog
        isOpen={active === 'full-flow'}
        onClose={close}
        product={MOCK_PRODUCT}
        onViewHistory={() => {
          close();
          alert('결제내역 보기 → /credit 라우팅');
        }}
        onGoHome={() => {
          close();
          alert('홈 화면에 가기 → / 라우팅');
        }}
        onContactSupport={() => {
          close();
          alert('고객지원 확인하기 클릭');
        }}
      />

      {/* ── 개별 단계 테스트 모달들 ── */}

      {/* MODAL 16: 환불 정책 확인 (Red + Checkbox) */}
      <StatusModal
        isOpen={active === 'refund-policy'}
        onClose={close}
        semantic="refund"
        title="환불 정책을 확인해주세요"
        description={
          <>
            구매 후 7일 안에 &lsquo;<u>사용하지 않은 크레딧</u>&rsquo;에 대해서는 환불이 가능하지만,
            기간이 지난 경우 환불 대상에서 제외됨을 알려드립니다.
          </>
        }
        creditAmount={MOCK_PRODUCT.credits}
        showAgreement
        agreementLabel="위 내용을 확인 했습니다."
        actions={[
          {
            label: '취소하기',
            variant: 'secondary',
            semantic: 'red',
            onClick: () => {
              close();
              alert('취소하기 클릭');
            },
          },
          {
            label: '구매하기',
            variant: 'primary',
            onClick: () => {
              close();
              alert('구매하기 클릭');
            },
          },
        ]}
      />

      {/* MODAL 3: 결제 진행중 (Blue + Spinner) */}
      <StatusModal
        isOpen={active === 'processing'}
        onClose={close}
        semantic="progress"
        title="결제가 진행중입니다"
        description="결제 정보를 안전하게 확인 중에 있습니다. 잠시만 기다려주시면 됩니다."
        creditAmount={MOCK_PRODUCT.credits}
      />

      {/* MODAL 01: 결제 완료 (Green) */}
      <StatusModal
        isOpen={active === 'success'}
        onClose={close}
        semantic="safe"
        title="결제가 완료되었습니다"
        description="제대로 구매가 되었는지 확인해 주시고, 문제가 있을 시 고객센터로 문의를 부탁드리겠습니다."
        creditAmount={MOCK_PRODUCT.credits}
        actions={[
          {
            label: '결제내역 보기',
            variant: 'secondary',
            onClick: () => {
              close();
              alert('결제내역 보기 클릭');
            },
          },
          {
            label: '홈 화면에 가기',
            variant: 'primary',
            onClick: () => {
              close();
              alert('홈 화면에 가기 클릭');
            },
          },
        ]}
      />

      {/* MODAL 2: 결제 중단 (Red) */}
      <StatusModal
        isOpen={active === 'error'}
        onClose={close}
        semantic="warning"
        title="결제가 중단되었습니다"
        description={
          <>
            알 수 없는 원인으로 인하여 거래가 중단되었습니다. 인터넷 연결을 먼저 확인해
            보시겠습니까?
            <br />
            지속적 문제 발생 시, 고객지원에 문의 바랍니다.
          </>
        }
        creditAmount={MOCK_PRODUCT.credits}
        actions={[
          {
            label: '고객지원 확인하기',
            variant: 'secondary',
            semantic: 'red',
            onClick: () => {
              close();
              alert('고객지원 확인하기 클릭');
            },
          },
          {
            label: '돌아가기',
            variant: 'primary',
            onClick: () => {
              close();
              alert('돌아가기 클릭');
            },
          },
        ]}
      />

      {/* MODAL 4: 상품 정보 갱신 (Yellow) */}
      <StatusModal
        isOpen={active === 'product-updated'}
        onClose={close}
        semantic="information"
        title="상품 정보가 갱신되었습니다"
        description={
          <>
            구매 과정에서 상품 정보가 새로 갱신되었습니다.
            <br />
            다시 거래를 진행해 주시면 감사드리겠습니다.
          </>
        }
        actions={[
          {
            label: '다시 시작하기',
            variant: 'secondary',
            semantic: 'yellow',
            onClick: () => {
              close();
              alert('다시 시작하기 클릭');
            },
          },
        ]}
      />
    </div>
  );
}
