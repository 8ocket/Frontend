'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, ChevronRight, Coins, LogOut, MoreVertical, Trash2, X } from 'lucide-react';
import { useAuthStore } from '@/entities/user/store';
import { useCreditStore } from '@/entities/credits/store';
import { UserProfileModal } from '@/shared/ui/UserProfileModal';
import { Switch } from '@/shared/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/tabs';
import { DialogRoot, DialogPortal, DialogOverlay, DialogTitle } from '@/shared/ui';
import * as DialogPrimitive from '@radix-ui/react-dialog';

// ── 목업 데이터 (API 연동 시 교체) ──────────────────────────────────
const PAYMENT_HISTORY = [
  { id: 'p1', date: '2026.03.20', label: '크레딧 중형 상품', amount: 9900, status: '결제완료' },
  { id: 'p2', date: '2026.02.14', label: '크레딧 소형 상품', amount: 3300, status: '결제완료' },
  { id: 'p3', date: '2026.01.05', label: '크레딧 대형 상품', amount: 27000, status: '환불완료' },
];

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
  const { paidCredit, freeCredit } = useCreditStore();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<(typeof PAYMENT_HISTORY)[0] | null>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  const isDefaultImage =
    !user?.profileImage || user.profileImage === '/images/icons/profile-default.svg';

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-secondary-100">
      <div className="layout-container px-8">
        <main className="mx-auto max-w-6xl pb-20 pt-24">

          <h1 className="mb-6 text-2xl font-semibold tracking-[-0.36px] text-prime-900">
            마이페이지
          </h1>

          <div className="flex flex-col gap-4">

            {/* ── 카드 1: 내 정보 ── */}
            <section className="overflow-hidden rounded-2xl border border-prime-100 bg-white shadow-md">

              {/* 프로필 */}
              <div className="flex items-center gap-4 px-6 py-4">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-full border-2 border-cta-300 bg-secondary-100">
                  <Image
                    src={user?.profileImage ?? '/images/icons/profile-default.svg'}
                    alt="프로필"
                    fill
                    className={isDefaultImage ? 'object-contain p-2' : 'object-cover'}
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate text-base font-semibold tracking-[-0.24px] text-prime-900">
                    {user?.name ?? '사용자'}
                  </span>
                  <span className="truncate text-sm tracking-[-0.21px] text-prime-500">
                    {user?.email ?? ''}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setProfileModalOpen(true)}
                  className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-prime-700 transition-colors hover:bg-slate-50"
                >
                  프로필 수정
                </button>
              </div>

              {/* 크레딧 */}
              <div className="flex items-center justify-between border-t border-slate-50 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50">
                    <Coins size={16} strokeWidth={2} className="text-main-blue" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs tracking-[-0.18px] text-slate-400">보유 크레딧</span>
                    <span className="text-xl font-bold tracking-tight text-main-blue">
                      {(paidCredit + freeCredit).toLocaleString()} 크레딧
                    </span>
                  </div>
                </div>
                <Link
                  href="/shop"
                  className="flex items-center gap-1 rounded-lg bg-cta-300 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-80"
                >
                  충전하기
                  <ChevronRight size={14} />
                </Link>
              </div>
            </section>

            {/* ── 카드 2: 활동 내역 ── */}
            <section className="overflow-hidden rounded-2xl border border-prime-100 bg-white shadow-md">
              <p className="px-6 pt-5 text-xs font-medium text-slate-400">활동 내역</p>

              <Tabs defaultValue="payment" className="mt-3">
                <div className="px-6 pb-4">
                  <TabsList className="h-auto w-full gap-1 rounded-xl border-0 bg-slate-100/80 px-1 py-1">
                    <TabsTrigger
                      value="payment"
                      className="flex-1 rounded-lg py-2 text-sm text-slate-400 data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-main-blue data-[state=active]:shadow-sm sm:w-auto"
                    >
                      결제 내역
                    </TabsTrigger>
                    <TabsTrigger
                      value="credit"
                      className="flex-1 rounded-lg py-2 text-sm text-slate-400 data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-main-blue data-[state=active]:shadow-sm sm:w-auto"
                    >
                      크레딧 사용 내역
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* 결제 내역 탭 */}
                <TabsContent value="payment" className="mt-0">
                  {PAYMENT_HISTORY.length === 0 ? (
                    <EmptyHistory message="결제 내역이 없습니다." />
                  ) : (
                    <ul className="divide-y divide-slate-50 px-4 pb-2" ref={dropdownRef}>
                      {PAYMENT_HISTORY.map((item) => (
                        <li key={item.id} className="relative flex items-center justify-between rounded-xl px-3 py-4 transition-colors hover:bg-slate-50">
                          {/* 좌측: 상품명 + 날짜 */}
                          <div className="flex flex-col gap-1">
                            <span className={`text-sm font-medium tracking-[-0.21px] ${item.status === '환불완료' ? 'text-slate-400' : 'text-prime-900'}`}>
                              {item.label}
                            </span>
                            <span className="text-xs tracking-[-0.18px] text-slate-400">{item.date}</span>
                          </div>

                          {/* 우측: 금액 + 상태 + 더보기 */}
                          <div className="flex items-center gap-2">
                            <div className="flex flex-col items-end gap-1">
                              <span className={`text-sm font-bold tracking-[-0.21px] ${item.status === '환불완료' ? 'text-slate-400 line-through' : 'text-prime-900'}`}>
                                {item.amount.toLocaleString()}원
                              </span>
                              {item.status === '환불완료' ? (
                                <span className="rounded-md bg-error-100 px-1.5 py-0.5 text-[10px] font-semibold text-error-500">
                                  환불완료
                                </span>
                              ) : (
                                <span className="text-xs font-medium text-emerald-500">결제완료</span>
                              )}
                            </div>

                            {/* 더보기 버튼 자리 — 항상 동일 너비 확보 */}
                            <div className="relative size-7 shrink-0">
                              {item.status === '결제완료' && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => setOpenDropdownId(openDropdownId === item.id ? null : item.id)}
                                    className="flex size-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100"
                                  >
                                    <MoreVertical size={15} />
                                  </button>
                                  {openDropdownId === item.id && (
                                    <div className="absolute right-0 top-full z-20 mt-1 w-36 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-lg">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setSelectedPayment(item);
                                          setOpenDropdownId(null);
                                          setRefundModalOpen(true);
                                        }}
                                        className="flex w-full items-center px-4 py-3 text-sm font-medium text-error-500 transition-colors hover:bg-error-100/50"
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
                    <ul className="divide-y divide-slate-50 px-4 pb-2">
                      {CREDIT_HISTORY.map((item) => (
                        <li key={item.id} className="flex items-center justify-between rounded-xl px-3 py-4 transition-colors hover:bg-slate-50">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium tracking-[-0.21px] text-prime-900">{item.label}</span>
                            <span className="text-xs tracking-[-0.18px] text-slate-400">{item.date}</span>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className={`text-sm font-bold tracking-[-0.21px] ${item.delta > 0 ? 'text-main-blue' : 'text-prime-900'}`}>
                              {item.delta > 0 ? '+' : ''}{item.delta.toLocaleString()} 크레딧
                            </span>
                            <span className="text-xs tracking-[-0.18px] text-slate-400">잔액 {item.balance.toLocaleString()}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </TabsContent>
              </Tabs>
            </section>

            {/* ── 카드 3: 설정 ── */}
            <section className="overflow-hidden rounded-2xl border border-prime-100 bg-white shadow-md">
              <p className="px-6 pt-5 text-xs font-medium text-slate-400">설정</p>

              <div className="flex items-center justify-between px-6 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50">
                    <Bell size={16} className="text-main-blue" />
                  </div>
                  <span className="text-sm font-medium tracking-[-0.21px] text-prime-900">알림</span>
                </div>
                <Switch checked={notificationEnabled} onCheckedChange={setNotificationEnabled} />
              </div>

              <div className="mx-6 h-px bg-slate-50" />

              <MenuRow
                icon={<LogOut size={16} className="text-error-500" />}
                label="로그아웃"
                labelClassName="text-error-500"
                iconBg="bg-red-50"
                onClick={handleLogout}
              />
              <div className="mx-6 h-px bg-slate-50" />
              <MenuRow
                icon={<Trash2 size={16} className="text-error-500" />}
                label="회원탈퇴"
                labelClassName="text-error-500"
                iconBg="bg-red-50"
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
      />
    </div>
  );
}

// ── 환불 안내 모달 ────────────────────────────────────────────────────
function RefundModal({
  isOpen,
  onClose,
  item,
}: {
  isOpen: boolean;
  onClose: () => void;
  item: (typeof PAYMENT_HISTORY)[0] | null;
}) {
  return (
    <DialogRoot open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 -translate-y-1/2 focus:outline-none">
          <DialogTitle className="sr-only">환불 안내</DialogTitle>
          <div className="overflow-hidden rounded-2xl border border-white/60 bg-white shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)]">

            {/* 헤더 */}
            <div className="flex items-center justify-between border-b border-slate-100 px-7 py-5">
              <span className="text-base font-semibold tracking-[-0.24px] text-prime-900">
                환불 신청 전 확인해 주세요
              </span>
              <button
                type="button"
                onClick={onClose}
                className="flex size-7 items-center justify-center rounded-full transition-colors hover:bg-slate-100"
              >
                <X size={16} className="text-slate-400" />
              </button>
            </div>

            {/* 바디 */}
            <div className="flex flex-col gap-5 px-7 py-6">

              {/* 환불 대상 항목 */}
              {item && (
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3.5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-prime-900">{item.label}</span>
                    <span className="text-xs text-slate-400">{item.date}</span>
                  </div>
                  <span className="text-sm font-bold text-prime-900">{item.amount.toLocaleString()}원</span>
                </div>
              )}

              {/* 환불 규정 */}
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">환불 규정</p>
                <div className="flex flex-col gap-2.5 rounded-xl border border-slate-100 p-4">
                  <PolicyItem
                    title="결제 후 7일 이내"
                    desc="크레딧을 사용하지 않은 경우 전액 환불이 가능합니다."
                  />
                  <div className="h-px bg-slate-50" />
                  <PolicyItem
                    title="크레딧 일부 사용 시"
                    desc="사용한 크레딧을 제외한 잔여 크레딧에 대해 부분 환불이 가능합니다."
                  />
                  <div className="h-px bg-slate-50" />
                  <PolicyItem
                    title="결제 후 7일 초과"
                    desc="환불이 불가합니다. 단, 서비스 장애로 인한 경우는 고객 지원으로 문의해 주세요."
                  />
                </div>
              </div>

              {/* 주의사항 */}
              <div className="rounded-xl bg-error-100/60 px-4 py-3.5">
                <p className="text-xs font-semibold text-error-500">주의사항</p>
                <ul className="mt-2 flex flex-col gap-1.5">
                  {[
                    '환불 처리까지 영업일 기준 3~5일이 소요됩니다.',
                    '환불 완료 후 크레딧은 즉시 회수되며 복구되지 않습니다.',
                    '이벤트·프로모션으로 지급된 무료 크레딧은 환불 대상에서 제외됩니다.',
                  ].map((text) => (
                    <li key={text} className="flex items-start gap-1.5 text-xs leading-relaxed text-error-500/80">
                      <span className="mt-1 size-1 shrink-0 rounded-full bg-error-400" />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 버튼 */}
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl bg-error-500 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  환불 요청하기
                </button>
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
      <span className="text-xs font-semibold tracking-[-0.18px] text-prime-900">{title}</span>
      <span className="text-xs leading-relaxed tracking-[-0.18px] text-prime-500">{desc}</span>
    </div>
  );
}

function EmptyHistory({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-12 text-slate-400">
      <span className="text-sm">{message}</span>
    </div>
  );
}

function MenuRow({
  icon,
  label,
  labelClassName,
  iconBg = 'bg-blue-50',
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
      className="flex w-full items-center gap-3 px-6 py-3.5 transition-colors hover:bg-slate-50"
    >
      <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
        {icon}
      </div>
      <span className={`flex-1 text-left text-sm font-medium tracking-[-0.21px] text-prime-900 ${labelClassName ?? ''}`}>
        {label}
      </span>
      <ChevronRight size={16} className="shrink-0 text-slate-300" />
    </button>
  );
}
