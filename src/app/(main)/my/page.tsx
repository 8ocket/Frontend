'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, Coins, LogOut, MoreVertical, Trash2, X } from 'lucide-react';
import { useAuthStore } from '@/entities/user/store';
import { logoutApi } from '@/entities/user/api';
import { getCookie } from '@/shared/lib/utils/cookie';
import { useCreditStore } from '@/entities/credits/store';
import { UserProfileModal } from '@/shared/ui/UserProfileModal';
import { Button } from '@/shared/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/tabs';
import { DialogRoot, DialogPortal, DialogOverlay, DialogTitle } from '@/shared/ui';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { getPaymentHistoryApi, cancelPaymentApi } from '@/entities/credits/api';
import { PaymentHistoryItem } from '@/entities/credits/model';

// ── 목업 데이터 (API 연동 시 교체) ──────────────────────────────────

const CREDIT_HISTORY = [
  { id: 'c1', date: '2026.03.24', label: 'AI 상담 이용', delta: -70, balance: 930 },
  { id: 'c2', date: '2026.03.22', label: '주간 리포트 발행', delta: -500, balance: 1000 },
  { id: 'c3', date: '2026.03.20', label: '크레딧 충전', delta: +1000, balance: 1500 },
  { id: 'c4', date: '2026.02.28', label: 'AI 상담 이용', delta: -70, balance: 500 },
  { id: 'c5', date: '2026.02.14', label: '크레딧 충전', delta: +300, balance: 570 },
];
// ─────────────────────────────────────────────────────────────────────

export default function MyPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { totalCredit } = useCreditStore();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentHistoryItem | null>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>([]);
  const [paymentLoading, setPaymentLoading] = useState(true);

  const isDefaultImage =
    !user?.profileImage || user.profileImage === '/images/icons/profile-default.png';

  const handleLogout = async () => {
    const refreshToken = getCookie('refreshToken');

    // 1. 로그아웃 API 호출 (실패해도 강제 로그아웃)
    if (refreshToken) {
      try {
        await logoutApi(refreshToken);
      } catch {
        // 무시
      }
    }

    // 2. Store 상태 초기화 (쿠키 포함)
    logout();

    // 3. 브랜드 소개 화면으로 이동
    router.replace('/about');
  };

  useEffect(() => {
    getPaymentHistoryApi()
      .then((res) => setPaymentHistory(res.content.filter((i) => i.status !== 'READY')))
      .finally(() => setPaymentLoading(false));

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-main-safe bg-secondary-100">
      <div className="layout-container px-gutter">
        <main className="mx-auto max-w-6xl pt-24 pb-20">
          <h1 className="text-prime-900 mb-6 text-2xl font-semibold tracking-[-0.36px]">
            마이페이지
          </h1>

          <div className="flex flex-col gap-4">
            {/* ── 카드 1: 내 정보 ── */}
            <section className="border-prime-100 overflow-hidden rounded-2xl border bg-white shadow-sm">
              {/* 프로필 */}
              <div className="flex items-center gap-4 px-6 py-4">
                <div className="border-cta-300 bg-secondary-100 relative size-14 shrink-0 overflow-hidden rounded-full border-2">
                  <Image
                    src={user?.profileImage ?? '/images/icons/profile-default.png'}
                    alt="프로필"
                    fill
                    className={isDefaultImage ? 'object-contain p-2' : 'object-cover'}
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="text-prime-900 truncate text-base font-semibold tracking-[-0.24px]">
                    {user?.name ?? '사용자'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setProfileModalOpen(true)}
                  className="border-prime-100 text-prime-700 hover:bg-secondary-50 shrink-0 rounded-lg border bg-white px-3 py-1.5 text-xs font-medium transition-colors"
                >
                  프로필 수정
                </button>
              </div>

              {/* 크레딧 */}
              <div className="border-prime-100 flex items-center justify-between border-t px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="bg-interactive-glass-blue-50 flex size-9 items-center justify-center rounded-xl">
                    <Coins size={16} strokeWidth={2} className="text-cta-300" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-prime-400 text-xs tracking-[-0.18px]">보유 크레딧</span>
                    <span className="text-cta-300 text-xl font-bold tracking-tight">
                      {totalCredit.toLocaleString()} 크레딧
                    </span>
                  </div>
                </div>
                <Button asChild variant="primary" size="default" className="gap-1 px-4 text-sm">
                  <Link href="/shop">
                    충전하기
                    <ChevronRight size={14} />
                  </Link>
                </Button>
              </div>
            </section>

            {/* ── 카드 2: 활동 내역 ── */}
            <section className="border-prime-100 overflow-hidden rounded-2xl border bg-white shadow-sm">
              <p className="text-prime-400 px-6 pt-5 text-xs font-medium">활동 내역</p>

              <Tabs defaultValue="payment" className="mt-3">
                <div className="px-6 pb-4">
                  <TabsList className="bg-secondary-100 h-auto w-full gap-1 rounded-xl border-0 px-1 py-1">
                    <TabsTrigger
                      value="payment"
                      className="text-prime-400 data-[state=active]:text-prime-700 flex-1 rounded-lg py-2 text-sm data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:shadow-sm sm:w-auto"
                    >
                      결제 내역
                    </TabsTrigger>
                    <TabsTrigger
                      value="credit"
                      className="text-prime-400 data-[state=active]:text-prime-700 flex-1 rounded-lg py-2 text-sm data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:shadow-sm sm:w-auto"
                    >
                      크레딧 사용 내역
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* 결제 내역 탭 */}
                <TabsContent value="payment" className="mt-0">
                  {paymentLoading ? (
                    <div className="text-prime-400 py-12 text-center text-sm">불러오는 중...</div>
                  ) : paymentHistory.length === 0 ? (
                    <EmptyHistory message="결제 내역이 없습니다." />
                  ) : (
                    <ul className="divide-prime-100 divide-y px-4 pb-2" ref={dropdownRef}>
                      {paymentHistory.map((item) => (
                        <li
                          key={item.approvedAt}
                          className="hover:bg-secondary-50 relative flex items-center justify-between rounded-xl px-3 py-4 transition-colors"
                        >
                          {/* 좌측: 상품명 + 날짜 + 사유 */}
                          <div className="flex flex-col gap-1">
                            <span
                              className={`text-sm font-medium tracking-[-0.21px] ${item.status === 'CANCELED' ? 'text-prime-400' : 'text-prime-900'}`}
                            >
                              {item.orderName}
                            </span>
                            <span className="text-prime-400 text-xs tracking-[-0.18px]">
                              {item.approvedAt
                                ? `${item.approvedAt.slice(0, 10).replace(/-/g, '.')} ${item.approvedAt.slice(11, 19)}`
                                : '-'}
                            </span>
                            {item.status === 'CANCELED' && (
                              <span className="text-prime-300 text-xs">고객 요청으로 환불 처리됨</span>
                            )}
                            {item.status === 'ABORTED' && (
                              <span className="text-prime-300 text-xs">결제 승인 중 오류가 발생했습니다</span>
                            )}
                            {item.status === 'FAILED' && (
                              <span className="text-prime-300 text-xs">결제에 실패했습니다</span>
                            )}
                          </div>

                          {/* 우측: 금액 + 상태 + 더보기 */}
                          <div className="flex items-center gap-2">
                            <div className="flex flex-col items-end gap-1">
                              <span
                                className={`text-sm font-bold tracking-[-0.21px] ${item.status === 'CANCELED' ? 'text-prime-400 line-through' : 'text-prime-900'}`}
                              >
                                {item.amount.toLocaleString()}원
                              </span>
                              {item.status === 'CANCELED' ? (
                                <span className="bg-error-100 text-error-500 rounded-md px-1.5 py-0.5 text-[10px] font-semibold">
                                  환불완료
                                </span>
                              ) : item.status === 'ABORTED' || item.status === 'FAILED' ? (
                                <span className="bg-prime-100 text-prime-400 rounded-md px-1.5 py-0.5 text-[10px] font-semibold">
                                  결제실패
                                </span>
                              ) : (
                                <span className="text-success-800 text-xs font-medium">
                                  결제완료
                                </span>
                              )}
                            </div>

                            {/* 더보기 버튼 자리 — 항상 동일 너비 확보 */}
                            <div className="relative size-7 shrink-0">
                              {item.status === 'DONE' && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setOpenDropdownId(
                                        openDropdownId === item.approvedAt ? null : item.approvedAt
                                      )
                                    }
                                    className="text-prime-400 hover:bg-secondary-100 flex size-7 items-center justify-center rounded-lg transition-colors"
                                  >
                                    <MoreVertical size={15} />
                                  </button>
                                  {openDropdownId === item.approvedAt && (
                                    <div className="border-prime-100 absolute top-full right-0 z-20 mt-1 w-36 overflow-hidden rounded-xl border bg-white shadow-sm">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setSelectedPayment(item);
                                          setOpenDropdownId(null);
                                          setRefundModalOpen(true);
                                        }}
                                        className="text-error-500 hover:bg-error-100/50 flex w-full items-center px-4 py-3 text-sm font-medium transition-colors"
                                      >
                                        환불 요청하기
                                      </button>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </TabsContent>

                {/* 크레딧 사용 내역 탭 */}
                <TabsContent value="credit" className="mt-0">
                  {CREDIT_HISTORY.length === 0 ? (
                    <EmptyHistory message="크레딧 사용 내역이 없습니다." />
                  ) : (
                    <ul className="divide-prime-100 divide-y px-4 pb-2">
                      {CREDIT_HISTORY.map((item) => (
                        <li
                          key={item.id}
                          className="hover:bg-secondary-50 flex items-center justify-between rounded-xl px-3 py-4 transition-colors"
                        >
                          <div className="flex flex-col gap-1">
                            <span className="text-prime-900 text-sm font-medium tracking-[-0.21px]">
                              {item.label}
                            </span>
                            <span className="text-prime-400 text-xs tracking-[-0.18px]">
                              {item.date}
                            </span>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span
                              className={`text-sm font-bold tracking-[-0.21px] ${item.delta > 0 ? 'text-cta-300' : 'text-prime-900'}`}
                            >
                              {item.delta > 0 ? '+' : ''}
                              {item.delta.toLocaleString()} 크레딧
                            </span>
                            <span className="text-prime-400 text-xs tracking-[-0.18px]">
                              잔액 {item.balance.toLocaleString()}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </TabsContent>
              </Tabs>
            </section>

            {/* ── 카드 3: 설정 ── */}
            <section className="border-prime-100 overflow-hidden rounded-2xl border bg-white shadow-sm">
              <p className="text-prime-400 px-6 pt-5 text-xs font-medium">설정</p>

              <MenuRow
                icon={<LogOut size={16} className="text-error-500" />}
                label="로그아웃"
                labelClassName="text-error-500"
                iconBg="bg-error-100"
                onClick={handleLogout}
              />
              {/* <div className="bg-prime-100 mx-6 h-px" /> */}
              <MenuRow
                icon={<Trash2 size={16} className="text-error-500" />}
                label="회원탈퇴"
                labelClassName="text-error-500"
                iconBg="bg-error-100"
                onClick={() => {}}
              />
            </section>
          </div>
        </main>
      </div>

      <UserProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        userName={user?.name ?? ''}
      />

      {/* 환불 안내 모달 */}
      <RefundModal
        isOpen={refundModalOpen}
        onClose={() => setRefundModalOpen(false)}
        item={selectedPayment}
        onSuccess={() => {
          setRefundModalOpen(false);
          getPaymentHistoryApi()
            .then((res) => setPaymentHistory(res.content))
            .catch(() => {});
        }}
      />
    </div>
  );
}

// ── 환불 안내 모달 ────────────────────────────────────────────────────
function RefundModal({
  isOpen,
  onClose,
  item,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  item: PaymentHistoryItem | null;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRefund = async () => {
    if (!item) return;
    setLoading(true);
    setError(null);
    try {
      await cancelPaymentApi(item.paymentId);
      onSuccess();
    } catch {
      setError('환불 요청에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogRoot open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content className="fixed top-1/2 left-1/2 z-50 w-full max-w-120 -translate-x-1/2 -translate-y-1/2 focus:outline-none">
          <DialogTitle className="sr-only">환불 안내</DialogTitle>
          <div className="border-prime-100 overflow-hidden rounded-2xl border bg-white shadow-sm">
            {/* 헤더 */}
            <div className="border-prime-100 flex items-center justify-between border-b px-7 py-5">
              <span className="text-prime-900 text-base font-semibold tracking-[-0.24px]">
                환불 신청 전 확인해 주세요
              </span>
              <button
                type="button"
                onClick={onClose}
                className="hover:bg-secondary-100 flex size-7 items-center justify-center rounded-full transition-colors"
              >
                <X size={16} className="text-prime-400" />
              </button>
            </div>

            {/* 바디 */}
            <div className="flex flex-col gap-5 px-7 py-6">
              {/* 환불 대상 항목 */}
              {item && (
                <div className="bg-secondary-100 flex items-center justify-between rounded-xl px-4 py-3.5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-prime-900 text-sm font-medium">{item.orderName}</span>
                    <span className="text-prime-400 text-xs">
                      {item.approvedAt?.slice(0, 10).replace(/-/g, '.') ?? '-'}
                    </span>
                  </div>
                  <span className="text-prime-900 text-sm font-bold">
                    {item.amount.toLocaleString()}원
                  </span>
                </div>
              )}

              {/* 환불 규정 */}
              <div className="flex flex-col gap-3">
                <p className="text-prime-400 text-xs font-semibold tracking-widest uppercase">
                  환불 규정
                </p>
                <div className="border-prime-100 flex flex-col gap-2.5 rounded-xl border p-4">
                  <PolicyItem
                    title="결제 후 7일 이내"
                    desc="크레딧을 사용하지 않은 경우 전액 환불이 가능합니다."
                  />
                  <div className="bg-prime-100 h-px" />
                  <PolicyItem
                    title="크레딧 일부 사용 시"
                    desc="사용한 크레딧을 제외한 잔여 크레딧에 대해 부분 환불이 가능합니다."
                  />
                  <div className="bg-prime-100 h-px" />
                  <PolicyItem
                    title="결제 후 7일 초과"
                    desc="환불이 불가합니다. 단, 서비스 장애로 인한 경우는 고객 지원으로 문의해 주세요."
                  />
                </div>
              </div>

              {/* 주의사항 */}
              <div className="bg-error-100/60 rounded-xl px-4 py-3.5">
                <p className="text-error-500 text-xs font-semibold">주의사항</p>
                <ul className="mt-2 flex flex-col gap-1.5">
                  {[
                    '환불 처리까지 영업일 기준 3~5일이 소요됩니다.',
                    '환불 완료 후 크레딧은 즉시 회수되며 복구되지 않습니다.',
                    '이벤트·프로모션으로 지급된 무료 크레딧은 환불 대상에서 제외됩니다.',
                  ].map((text) => (
                    <li
                      key={text}
                      className="text-error-500/80 flex items-start gap-1.5 text-xs leading-relaxed"
                    >
                      <span className="bg-error-400 mt-1 size-1 shrink-0 rounded-full" />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 에러 메시지 */}
              {error && (
                <p className="text-error-500 text-center text-xs">{error}</p>
              )}

              {/* 버튼 */}
              <div className="flex gap-2.5">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 rounded-xl"
                >
                  취소
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  semantic="red"
                  onClick={handleRefund}
                  disabled={loading}
                  className="flex-1 rounded-xl"
                >
                  {loading ? '처리 중...' : '환불 요청하기'}
                </Button>
              </div>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </DialogRoot>
  );
}

function PolicyItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-prime-900 text-xs font-semibold tracking-[-0.18px]">{title}</span>
      <span className="text-prime-500 text-xs leading-relaxed tracking-[-0.18px]">{desc}</span>
    </div>
  );
}

function EmptyHistory({ message }: { message: string }) {
  return (
    <div className="text-prime-400 flex flex-col items-center gap-2 py-12">
      <span className="text-sm">{message}</span>
    </div>
  );
}

function MenuRow({
  icon,
  label,
  labelClassName,
  iconBg = 'bg-interactive-glass-blue-50',
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  labelClassName?: string;
  iconBg?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="hover:bg-secondary-50 flex w-full items-center gap-3 px-6 py-3.5 transition-colors"
    >
      <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
        {icon}
      </div>
      <span
        className={`text-prime-900 flex-1 text-left text-sm font-medium tracking-[-0.21px] ${labelClassName ?? ''}`}
      >
        {label}
      </span>
      <ChevronRight size={16} className="text-prime-300 shrink-0" />
    </button>
  );
}
