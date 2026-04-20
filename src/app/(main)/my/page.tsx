'use client';

import { useState, useEffect } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/shared/ui/popover';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ProfileEditDrawer } from '@/components/my/ProfileEditDrawer';
import { ChevronRight, Coins, LogOut, MoreVertical, Trash2, X } from 'lucide-react';
import { useAuthStore } from '@/entities/user/store';
import { logoutApi, getMyProfileApi, withdrawUserApi } from '@/entities/user/api';
import { getCookie } from '@/shared/lib/utils/cookie';
import { useCreditStore } from '@/entities/credits/store';
import { Button } from '@/shared/ui/button';
import { ProfileAvatar } from '@/shared/ui/profile-avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/tabs';
import { DialogRoot, DialogPortal, DialogOverlay, DialogTitle } from '@/shared/ui';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { getPaymentHistoryApi, cancelPaymentApi, getMyCreditApi } from '@/entities/credits/api';
import { PaymentHistoryItem } from '@/entities/credits/model';
import { useToast } from '@/shared/ui/toast';
import { OCCUPATION_LABEL, AGE_LABEL, GENDER_LABEL } from '@/entities/user/model';

function toKSTString(dateStr: string, includeTime = true) {
  // timezone 정보가 없는 LocalDateTime은 UTC로 처리 (배포 서버 기준)
  const normalized = /[Z+\-]\d{2}:\d{2}$|Z$/.test(dateStr) ? dateStr : `${dateStr}Z`;
  const date = new Date(normalized);
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...(includeTime && { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
  });
  const parts = Object.fromEntries(fmt.formatToParts(date).map((p) => [p.type, p.value]));
  return includeTime
    ? `${parts.year}.${parts.month}.${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`
    : `${parts.year}.${parts.month}.${parts.day}`;
}

const TRANSACTION_LABEL: Record<string, string> = {
  SIGNUP_BONUS: '회원가입 보너스',
  ATTENDANCE_CHECK: '출석체크 보너스',
  SAVE_SESSION: '상담 저장 보너스',
  WATCH_AD: '광고 시청 보너스',
  SURVEY: '설문 조사 보너스',
  AI_WEEKLY_REPORT: 'AI 주간 리포트',
  AI_MONTHLY_REPORT: 'AI 월간 리포트',
  EXTRA_SESSION: 'AI 상담 이용',
  CHARGE: '크레딧 충전',
  REFUND: '크레딧 환불',
};

export default function MyPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, logout } = useAuthStore();
  const { totalCredit, setTotalCredit } = useCreditStore();
  const { toast } = useToast();
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentHistoryItem | null>(null);

  const {
    data: paymentHistory = [],
    isPending: paymentLoading,
    isError: paymentError,
  } = useQuery({
    queryKey: ['paymentHistory'],
    queryFn: () => getPaymentHistoryApi(),
    select: (res) =>
      res.content
        .filter((i) => i.status !== 'READY')
        .sort((a, b) => {
          if (!a.approvedAt && !b.approvedAt) return 0;
          if (!a.approvedAt) return 1;
          if (!b.approvedAt) return -1;
          return new Date(b.approvedAt).getTime() - new Date(a.approvedAt).getTime();
        }),
  });

  const {
    data: creditData,
    isPending: creditLoading,
    isError: creditError,
  } = useQuery({
    queryKey: ['myCredit'],
    queryFn: getMyCreditApi,
  });
  const creditTransactions = (creditData?.transactions ?? [])
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const { data: profileData } = useQuery({
    queryKey: ['myProfile'],
    queryFn: getMyProfileApi,
  });
  const profileOccupation = profileData?.occupation ?? null;
  const profileAge = profileData?.age ?? null;
  const profileGender = profileData?.gender ?? null;

  useEffect(() => {
    if (creditData) {
      setTotalCredit(creditData.totalCredit);
    }
  }, [creditData, setTotalCredit]);

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

    // 3. 로그인 화면으로 이동
    router.replace('/login');
  };

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
                  <ProfileAvatar src={user?.profileImage} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="text-prime-900 truncate text-base font-semibold tracking-[-0.24px]">
                    {user?.name ?? '사용자'}
                  </span>
                  {/* 직업 / 나이 / 성별 읽기 전용 */}
                  <div className="text-prime-400 flex flex-wrap items-center gap-x-1 gap-y-0.5 text-xs tracking-[-0.18px]">
                    {[
                      profileOccupation && OCCUPATION_LABEL[profileOccupation],
                      profileAge && AGE_LABEL[profileAge],
                      profileGender && GENDER_LABEL[profileGender],
                    ]
                      .filter(Boolean)
                      .map((label, i, arr) => (
                        <span key={label as string} className="flex items-center gap-1">
                          {label}
                          {i < arr.length - 1 && <span className="text-prime-200">·</span>}
                        </span>
                      ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditDrawerOpen(true)}
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

            {/* ── 카드 4: 활동 내역 ── */}
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
                  ) : paymentError ? (
                    <div className="text-prime-400 py-12 text-center text-sm">
                      결제 내역을 불러오지 못했습니다.
                    </div>
                  ) : paymentHistory.length === 0 ? (
                    <EmptyHistory message="결제 내역이 없습니다." />
                  ) : (
                    <div className="group relative">
                      <ul className="divide-prime-100 max-h-80 divide-y overflow-y-auto px-4 pb-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-transparent group-hover:[&::-webkit-scrollbar-thumb]:bg-prime-200">
                      {paymentHistory.map((item, idx) => {
                        const itemKey =
                          item.paymentId ??
                          `${item.orderName}-${item.amount}-${item.approvedAt ?? 'pending'}-${idx}`;
                        const canRefund = item.status === 'DONE' && !!item.paymentId;

                        return (
                          <li
                            key={itemKey}
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
                                {item.approvedAt ? toKSTString(item.approvedAt) : '-'}
                              </span>
                              {item.status === 'CANCELED' && (
                                <span className="text-prime-300 text-xs">
                                  고객 요청으로 환불 처리됨
                                </span>
                              )}
                              {item.status === 'ABORTED' && (
                                <span className="text-prime-300 text-xs">
                                  결제 승인 중 오류가 발생했습니다
                                </span>
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
                                <PaymentStatusBadge status={item.status} />
                              </div>

                              {/* 더보기 버튼 자리 — 항상 동일 너비 확보 */}
                              <div className="size-7 shrink-0">
                                {canRefund && (
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <button
                                        type="button"
                                        className="text-prime-400 hover:bg-secondary-100 flex size-7 items-center justify-center rounded-lg transition-colors"
                                      >
                                        <MoreVertical size={15} />
                                      </button>
                                    </PopoverTrigger>
                                    <PopoverContent align="end" sideOffset={6} className="w-36 overflow-hidden p-0">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setSelectedPayment(item);
                                          setRefundModalOpen(true);
                                        }}
                                        className="text-error-500 hover:bg-error-100/50 flex w-full items-center px-4 py-3 text-sm font-medium transition-colors"
                                      >
                                        환불 요청하기
                                      </button>
                                    </PopoverContent>
                                  </Popover>
                                )}
                              </div>
                            </div>
                          </li>
                        );
                      })}
                      </ul>
                      <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-10 rounded-b-xl bg-linear-to-t from-white to-transparent" />
                    </div>
                  )}
                </TabsContent>

                {/* 크레딧 사용 내역 탭 */}
                <TabsContent value="credit" className="mt-0">
                  {creditLoading ? (
                    <div className="text-prime-400 py-12 text-center text-sm">불러오는 중...</div>
                  ) : creditError ? (
                    <div className="text-prime-400 py-12 text-center text-sm">
                      크레딧 내역을 불러오지 못했습니다.
                    </div>
                  ) : creditTransactions.length === 0 ? (
                    <EmptyHistory message="크레딧 사용 내역이 없습니다." />
                  ) : (
                    <div className="group relative">
                      <ul className="divide-prime-100 max-h-80 divide-y overflow-y-auto px-4 pb-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-transparent group-hover:[&::-webkit-scrollbar-thumb]:bg-prime-200">
                        {creditTransactions.map((item, idx) => {
                          const balance = creditTransactions
                            .slice(0, idx)
                            .reduce((acc, t) => acc - t.amount, creditData?.totalCredit ?? 0);
                          return (
                            <li
                              key={idx}
                              className="hover:bg-secondary-50 flex items-center justify-between rounded-xl px-3 py-4 transition-colors"
                            >
                              <div className="flex flex-col gap-1">
                                <span className="text-prime-900 text-sm font-medium tracking-[-0.21px]">
                                  {TRANSACTION_LABEL[item.transactionType] ?? item.transactionType}
                                </span>
                                <span className="text-prime-400 text-xs tracking-[-0.18px]">
                                  {toKSTString(item.createdAt)}
                                </span>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                <span
                                  className={`text-sm font-bold tracking-[-0.21px] ${item.amount > 0 ? 'text-cta-500' : 'text-rose-400'}`}
                                >
                                  {item.amount > 0 ? '+' : ''}
                                  {item.amount.toLocaleString()} 크레딧
                                </span>
                                <span className="text-prime-300 text-xs tracking-[-0.18px]">
                                  잔액 {balance.toLocaleString()} 크레딧
                                </span>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                      <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-10 rounded-b-xl bg-linear-to-t from-white to-transparent" />
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </section>

            {/* ── 카드 3: 설정 ── */}
            <section className="border-prime-100 overflow-hidden rounded-2xl border bg-white shadow-sm">
              <p className="text-prime-400 px-6 pt-5 text-xs font-medium">설정</p>

              <MenuRow
                icon={<LogOut size={16} className="text-prime-400" />}
                label="로그아웃"
                labelClassName="text-prime-700"
                iconBg="bg-prime-100"
                onClick={handleLogout}
              />
              {/* <div className="bg-prime-100 mx-6 h-px" /> */}
              <MenuRow
                icon={<Trash2 size={16} className="text-error-500" />}
                label="회원탈퇴"
                labelClassName="text-error-500"
                iconBg="bg-error-100"
                onClick={() => setDeleteAccountModalOpen(true)}
              />
            </section>
          </div>
        </main>
      </div>

      {/* 환불 안내 모달 */}
      <RefundModal
        isOpen={refundModalOpen}
        onClose={() => setRefundModalOpen(false)}
        item={selectedPayment}
        onSuccess={() => {
          setRefundModalOpen(false);
          toast('환불 요청이 완료되었습니다.', 'success');
          queryClient.invalidateQueries({ queryKey: ['paymentHistory'] });
          queryClient.invalidateQueries({ queryKey: ['myCredit'] });
          getMyCreditApi()
            .then((res) => setTotalCredit(res.totalCredit))
            .catch(() => toast('크레딧 갱신에 실패했습니다.', 'error'));
        }}
      />

      {/* 프로필 수정 Drawer */}
      <ProfileEditDrawer
        isOpen={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        onSaved={() => queryClient.invalidateQueries({ queryKey: ['myProfile'] })}
      />

      {/* 회원탈퇴 확인 모달 */}
      <DeleteAccountModal
        isOpen={deleteAccountModalOpen}
        onClose={() => setDeleteAccountModalOpen(false)}
      />
    </div>
  );
}

// ── 환불 안내 모달 ────────────────────────────────────────────────────
function PaymentStatusBadge({ status }: { status: string }) {
  if (status === 'CANCELED') {
    return (
      <span className="bg-error-100 text-error-500 rounded-md px-1.5 py-0.5 text-[10px] font-semibold">
        환불완료
      </span>
    );
  }
  if (status === 'ABORTED' || status === 'FAILED') {
    return (
      <span className="bg-prime-100 text-prime-400 rounded-md px-1.5 py-0.5 text-[10px] font-semibold">
        결제실패
      </span>
    );
  }
  return <span className="text-success-800 text-xs font-medium">결제완료</span>;
}

function RefundModal({
  isOpen,
  onClose,
  item,
  onSuccess,
}: {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly item: PaymentHistoryItem | null;
  readonly onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRefund = async () => {
    if (!item?.paymentId) return;
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
                      {item.approvedAt ? toKSTString(item.approvedAt, false) : '-'}
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
              {error && <p className="text-error-500 text-center text-xs">{error}</p>}

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

function PolicyItem({ title, desc }: { readonly title: string; readonly desc: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-prime-900 text-xs font-semibold tracking-[-0.18px]">{title}</span>
      <span className="text-prime-500 text-xs leading-relaxed tracking-[-0.18px]">{desc}</span>
    </div>
  );
}

function EmptyHistory({ message }: { readonly message: string }) {
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
  readonly icon: React.ReactNode;
  readonly label: string;
  readonly labelClassName?: string;
  readonly iconBg?: string;
  readonly onClick: () => void;
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

// ── 회원탈퇴 확인 모달 ─────────────────────────────────────────────
function DeleteAccountModal({
  isOpen,
  onClose,
}: {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}) {
  const [confirmText, setConfirmText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const { logout } = useAuthStore();
  const router = useRouter();
  const { toast } = useToast();
  const isConfirmed = confirmText === '회원탈퇴';

  const handleLeave = () => {
    logout();
    router.replace('/login');
  };

  return (
    <DialogRoot open={isOpen} onOpenChange={(open) => { if (!open && !isDone) onClose(); }}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content className="fixed top-1/2 left-1/2 z-50 w-full max-w-105 -translate-x-1/2 -translate-y-1/2 focus:outline-none">
          <DialogTitle className="sr-only">회원탈퇴</DialogTitle>
          <div className="border-prime-100 overflow-hidden rounded-2xl border bg-white shadow-sm">

            {isDone ? (
              /* 완료 화면 */
              <div className="flex flex-col items-center gap-6 px-7 py-10">
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="bg-secondary-100 flex size-14 items-center justify-center rounded-full">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17L4 12" stroke="#8A9BA8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="text-prime-900 text-base font-semibold">탈퇴가 완료되었습니다</p>
                  <p className="text-prime-400 text-sm leading-relaxed">
                    그동안 MindLog를 이용해 주셔서 감사합니다.<br />
                    언제든지 다시 찾아오세요.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleLeave}
                  className="w-full rounded-xl"
                >
                  확인
                </Button>
              </div>
            ) : (
              <>
                {/* 헤더 */}
                <div className="border-prime-100 flex items-center justify-between border-b px-7 py-5">
                  <span className="text-prime-900 text-base font-semibold tracking-[-0.24px]">
                    정말 탈퇴하시겠어요?
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
                  <div className="bg-error-100/60 rounded-xl px-4 py-3.5">
                    <p className="text-error-500 text-xs font-semibold">탈퇴 시 주의사항</p>
                    <ul className="mt-2 flex flex-col gap-1.5">
                      {[
                        '모든 상담 기록과 리포트가 영구적으로 삭제됩니다.',
                        '보유 중인 크레딧은 모두 소멸되며 복구할 수 없습니다.',
                        '동일 계정으로 재가입하더라도 이전 데이터는 복원되지 않습니다.',
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

                  <div className="flex flex-col gap-2">
                    <label className="text-prime-700 text-sm font-medium">
                      확인을 위해 <span className="text-error-500 font-bold">&quot;회원탈퇴&quot;</span>
                      를 입력해 주세요
                    </label>
                    <input
                      type="text"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      placeholder="회원탈퇴"
                      className="border-prime-200 bg-secondary-50 text-prime-900 placeholder:text-prime-300 focus:border-error-500 h-11 w-full rounded-xl border px-4 text-sm transition-colors focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-2.5">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={onClose}
                      className="flex-1 rounded-xl"
                    >
                      취소
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      semantic="red"
                      disabled={!isConfirmed || isLoading}
                      onClick={async () => {
                        setIsLoading(true);
                        try {
                          await withdrawUserApi();
                          setIsDone(true);
                        } catch {
                          toast('회원탈퇴에 실패했습니다. 다시 시도해주세요.', 'error');
                        } finally {
                          setIsLoading(false);
                        }
                      }}
                      className="flex-1 rounded-xl"
                    >
                      {isLoading ? '처리 중...' : '탈퇴하기'}
                    </Button>
                  </div>
                </div>
              </>
            )}

          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </DialogRoot>
  );
}
