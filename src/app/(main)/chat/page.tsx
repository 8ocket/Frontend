'use client';

import { useCreditStore } from '@/entities/credits/store';
import { useAuthStore } from '@/entities/user/store';
import type { ChatBubbleProps } from '@/widgets/chat-main-area';
import type { ChatSessionGroup } from '@/widgets/chat-sidebar';
import { useRouter, useSearchParams } from 'next/navigation';
import { useChatNavigationStore } from '@/shared/lib/chatNavigationStore';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  ChatAlertModal,
  ChatCreditModal,
  ChatMainArea,
  ChatNewSessionModal,
  ChatSidebar,
  ChatUnfinishedSessionModal,
} from '@/components/chat';
import type { EmotionCardData } from '@/entities/emotion';
import type {
  ActiveSessionResponse,
  FinalizeCompleteEvent,
  SessionDetailResponse,
  SessionListItem,
} from '@/entities/session';
import {
  deleteSessionApi,
  finalizeSessionStream,
  getActiveSessionApi,
  getSessionDetailApi,
  getSessionsApi,
} from '@/entities/session/api';
import { finalizeToEmotionCardData } from '@/entities/session/utils';
import { uploadSummaryCardImageApi, getSummaryListApi } from '@/entities/summary';
import { getCookie } from '@/shared/lib/utils/cookie';
import { useToast } from '@/shared/ui/toast';
import { EmotionCardBack, EmotionCardFront } from '@/widgets/emotion-card';
import { Menu } from 'lucide-react';

// ── 모달 상태 타입 ──────────────────────────────────────────────
export type ChatModalType =
  | 'credit-shortage'
  | 'new-session'
  | 'unfinished-session'
  | 'end-confirm'
  // | 'satisfaction'  // TODO: 만족도 조사 — 우선순위 보류
  | null;

function ChatPageContent() {
  const router = useRouter();
  const [activeModal, setActiveModal] = useState<ChatModalType>(null);
  const openModal = useCallback((type: ChatModalType) => setActiveModal(type), []);
  const closeModal = useCallback(() => setActiveModal(null), []);
  const { totalCredit } = useCreditStore();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const remainingCredits = totalCredit;

  const searchParams = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>(undefined);
  const [unfinishedSession, setUnfinishedSession] = useState<ActiveSessionResponse | null>(null);
  const [sessionList, setSessionList] = useState<SessionListItem[]>([]);
  /** 현재 채팅 세션 활성 여부 — false면 입력창 비활성화 */
  const [isSessionActive, setIsSessionActive] = useState(false);
  /** 채팅창에 외부에서 append할 메시지 */
  const [appendMessage, setAppendMessage] = useState<ChatBubbleProps | null>(null);
  const [sessionDetail, setSessionDetail] = useState<SessionDetailResponse | null>(null);
  /** 완료된 세션의 마음기록카드 이미지 URL (summary 목록에서 조회) */
  const [sessionCardImageUrl, setSessionCardImageUrl] = useState<string | null>(null);
  /** finalize 완료 데이터 */
  const [finalizeResult, setFinalizeResult] = useState<FinalizeCompleteEvent | null>(null);
  /** finalize 스트림 취소용 — 언마운트 시 abort */
  const finalizeAbortRef = useRef<AbortController | null>(null);
  /** 감정 카드 이미지 캡처용 (오로라: card_back_image) */
  const captureCardRef = useRef<HTMLDivElement>(null);
  /** 감정 카드 텍스트+오로라 캡처용 (card_front_image) */
  const captureBackCardRef = useRef<HTMLDivElement>(null);
  const [capturePayload, setCapturePayload] = useState<{
    data: EmotionCardData;
    summaryId: string;
  } | null>(null);
  /** 60분 미입력 자동 종료 타이머 */
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      finalizeAbortRef.current?.abort();
    };
  }, []);

  // finalize 완료 후 감정 카드 앞/뒷면 캡처 → PATCH /image 업로드
  useEffect(() => {
    if (!capturePayload) return;
    const { summaryId } = capturePayload;

    const timer = setTimeout(async () => {
      if (!captureBackCardRef.current || !captureCardRef.current) return;
      try {
        const { toBlob } = await import('html-to-image');

        // 두 카드 면의 img 태그가 완전히 로드될 때까지 대기
        const allImgs = [
          ...captureBackCardRef.current.querySelectorAll('img'),
          ...captureCardRef.current.querySelectorAll('img'),
        ];
        await Promise.all(
          allImgs.map((img) =>
            img.complete
              ? Promise.resolve()
              : new Promise((r) => {
                  img.onload = r;
                  img.onerror = r;
                })
          )
        );
        // html-to-image는 <img>로 로드된 외부 SVG를 캔버스에 그리지 못함
        // → 캡처 전 SVG img를 Canvas로 PNG 데이터 URL로 변환 후 src를 임시 교체
        const svgImgs = allImgs.filter((img) => img.src.endsWith('.svg'));
        const originalSrcs = svgImgs.map((img) => img.src);
        await Promise.all(
          svgImgs.map(async (img) => {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth || img.width;
            canvas.height = img.naturalHeight || img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            img.src = canvas.toDataURL('image/png');
            // 새 src(data URL) 로드 완료 대기
            await new Promise((r) => {
              img.onload = r;
              img.onerror = r;
            });
          })
        );

        // card_front_image: 텍스트+오로라 후면 (EmotionCardBack) — captureBackCardRef
        const frontBlob = await toBlob(captureBackCardRef.current, { pixelRatio: 2 });

        // card_back_image: 오로라 전면 (EmotionCardFront) — captureCardRef
        const backBlob = await toBlob(captureCardRef.current, { pixelRatio: 2 });

        // 캡처 완료 후 SVG img src 원복
        svgImgs.forEach((img, i) => {
          img.src = originalSrcs[i];
        });

        if (!frontBlob || !backBlob) {
          console.error('[capture] blob 생성 실패 | front:', !!frontBlob, 'back:', !!backBlob);
          return;
        }

        // 캡처 완료 즉시 다운로드 버튼 표시 — 업로드 완료 기다리지 않음
        const localImageUrl = URL.createObjectURL(frontBlob);
        setAppendMessage((prev) => (prev ? { ...prev, cardImageUrl: localImageUrl } : prev));

        // 서버 업로드는 백그라운드에서 진행
        const frontFile = new File([frontBlob], 'card-front.png', { type: 'image/png' });
        const backFile = new File([backBlob], 'card-back.png', { type: 'image/png' });
        await uploadSummaryCardImageApi(summaryId, frontFile, backFile);
      } catch (e) {
        console.error('[capture] 감정 카드 이미지 캡처 및 업로드 실패', e);
      } finally {
        setCapturePayload(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [capturePayload]);

  // 채팅 페이지에서는 body 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // 60분 미입력 자동 종료 타이머 — 세션 활성 상태에서만 동작
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = setTimeout(
      () => {
        setIsSessionActive(false);
        finalizeAbortRef.current?.abort();
      },
      60 * 60 * 1000
    );
  }, []);

  useEffect(() => {
    if (isSessionActive) {
      resetInactivityTimer();
    } else {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    }
    return () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [isSessionActive, resetInactivityTimer]);

  // activeSessionId 변경 시 세션 상세 조회 (새 세션 생성 시에만 — 이어가기/사이드바는 핸들러에서 pre-fetch)
  useEffect(() => {
    if (!activeSessionId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSessionDetail(null);
      return;
    }
    // 이미 해당 세션 detail이 로드된 경우 중복 fetch 방지
    if (sessionDetail?.session_id === activeSessionId) return;
    getSessionDetailApi(activeSessionId)
      .then(setSessionDetail)
      .catch(() => setSessionDetail(null));
  }, [activeSessionId]); // eslint-disable-line react-hooks/exhaustive-deps

  // 세션 전환 시 카드 URL 초기화 (사이드바 선택은 handleSelectSession에서 prefetch)
  useEffect(() => {
    if (!sessionDetail?.has_summary) {
      setSessionCardImageUrl(null);
    } else if (sessionDetail.card_image_url) {
      setSessionCardImageUrl(sessionDetail.card_image_url);
    }
    // has_summary이지만 card_image_url이 없는 경우는 handleSelectSession에서 이미 fetch함
  }, [sessionDetail]);

  // 세션 상세 → ChatBubbleProps[] 변환 (API는 최신→과거 순, 표시는 과거→최신)
  const activeMessages = useMemo((): ChatBubbleProps[] => {
    if (!sessionDetail) return [];
    const messages: ChatBubbleProps[] = [...sessionDetail.messages].reverse().map((m) => ({
      variant: m.role === 'ASSISTANT' ? 'ai' : 'user',
      senderName: m.role === 'ASSISTANT' ? '나봄이' : (user?.name ?? '나'),
      content: m.content,
      avatarSrc: m.role === 'ASSISTANT' ? '/images/personas/nabomi-44.png' : undefined,
      userAvatarSrc: m.role === 'USER' ? (user?.profileImage ?? undefined) : undefined,
    }));

    if (sessionDetail.has_summary && sessionCardImageUrl) {
      messages.push({
        variant: 'ai',
        senderName: '나봄이',
        avatarSrc: '/images/personas/nabomi-44.png',
        cardImageUrl: sessionCardImageUrl,
      });
    }

    return messages;
  }, [sessionDetail, user, sessionCardImageUrl]);

  const activeAiName = '나봄이';
  const activeAiAvatarSrc = '/images/personas/nabomi-44.png';

  // API 세션 목록 → 사이드바용 그룹 데이터로 변환
  const sessionGroups = useMemo((): ChatSessionGroup[] => {
    const groupMap = new Map<string, ChatSessionGroup>();
    for (const s of sessionList) {
      const date = new Date(s.startedAt).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      if (!groupMap.has(date)) groupMap.set(date, { date, sessions: [] });
      groupMap.get(date)!.sessions.push({
        id: s.sessionId,
        title: s.title || '제목 없음',
        avatarSrc: '/images/personas/nabomi-21.png',
      });
    }
    return Array.from(groupMap.values());
  }, [sessionList]);

  // ── ?session= 쿼리로 세션 자동 선택 ──────────────────────────────
  useEffect(() => {
    const sessionId = searchParams.get('session');
    if (sessionId) {
      handleSelectSession(sessionId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── 진입 시 미완료 세션 확인 + 세션 목록 조회 ──────────────────
  useEffect(() => {
    let isMounted = true;
    Promise.all([getActiveSessionApi().catch(() => null), getSessionsApi().catch(() => null)]).then(
      ([activeSession, sessionData]) => {
        if (!isMounted) return;
        const sessions = sessionData?.sessions ?? [];
        setSessionList(sessions);

        if (activeSession) {
          setUnfinishedSession(activeSession);
          openModal('unfinished-session');
        } else if (sessions.length === 0) {
          openModal('new-session');
        }
      }
    );
    return () => {
      isMounted = false;
    };
  }, [openModal]);

  // ── 핸들러 ───────────────────────────────────────────────────────

  /** 세션 삭제 */
  const handleDeleteSession = async (id: string) => {
    try {
      await deleteSessionApi(id);
      setSessionList((prev) => prev.filter((s) => s.sessionId !== id));
      if (activeSessionId === id) {
        setActiveSessionId(undefined);
        setSessionDetail(null);
      }
      toast('대화가 삭제되었어요.', 'success');
    } catch {
      toast('대화 삭제에 실패했어요.', 'error');
    }
  };

  /** 사이드바 [새로운 상담] 버튼 → 세션 초기화, 입력창 활성화 */
  const handleNewCounsel = () => {
    setSidebarOpen(false);
    closeModal();

    // 오늘 이미 세션이 있으면 추가 상담(70 크레딧 차감) → 크레딧 사전 체크
    const today = new Date().toDateString();
    const hasTodaySession = sessionList.some((s) => new Date(s.startedAt).toDateString() === today);
    if (hasTodaySession && totalCredit < 70) {
      openModal('credit-shortage');
      return;
    }

    setActiveSessionId(undefined); // 새 세션 준비 (첫 메시지 전송 시 생성)
    setIsSessionActive(true);
  };

  /** 비활성 입력창/전송 버튼 탭 → [새로운 상담] 안내 모달 (블러 없음) */
  const handleDisabledInputClick = () => {
    openModal('new-session');
  };

  /** [마무리 안된 상담] → 진행한다: 기존 세션 이어가기 */
  const handleUnfinishedResume = async () => {
    closeModal();
    setIsSessionActive(true);
    if (unfinishedSession) {
      // detail 먼저 fetch → sessionDetail 세팅 후 activeSessionId 세팅 (React 18 배칭)
      const detail = await getSessionDetailApi(unfinishedSession.session_id).catch(() => null);
      setSessionDetail(detail);
      setActiveSessionId(unfinishedSession.session_id);
    }
  };

  /** 사이드바 세션 선택: detail + 카드 URL 먼저 fetch 후 세션 전환 */
  const handleSelectSession = async (id: string) => {
    const detail = await getSessionDetailApi(id).catch(() => null);

    // 카드 URL 미리 fetch — ChatMainArea의 sessionId 변경 감지 시점에 activeMessages에 카드가 포함되도록
    let cardUrl: string | null = null;
    if (detail?.has_summary) {
      if (detail.card_image_url) {
        cardUrl = detail.card_image_url;
      } else {
        cardUrl = await getSummaryListApi(0, 50)
          .then(({ content }) => {
            const match = content.find((s) => s.sessionId === id);
            // frontImageUrl 우선, 없으면 backImageUrl(AI 파이널라이즈 때 항상 저장됨)로 폴백
            return match?.frontImageUrl || match?.backImageUrl || null;
          })
          .catch(() => null);
      }
    }

    // React 18 자동 배칭 — 세 setter가 단일 렌더로 묶임
    setSessionCardImageUrl(cardUrl);
    setSessionDetail(detail);
    setActiveSessionId(id);
    setSidebarOpen(false);
  };

  /** [마무리 안된 상담] → 무시하기: 모달 닫고 입력창 비활성 유지 */
  const handleUnfinishedIgnore = () => {
    closeModal();
    // 입력창은 비활성 유지 → 사이드바 [새로운 상담] 버튼으로 세션 시작 유도
  };

  const handleEndChat = () => openModal('end-confirm');

  /** 종료 확인 → finalize SSE 호출 → 감정 카드 버블 */
  const handleEndConfirmed = async () => {
    closeModal();
    setIsSessionActive(false);
    setAppendMessage({
      variant: 'ai',
      senderName: '나봄이',
      avatarSrc: activeAiAvatarSrc,
      content: '마음 기록을 생성 중입니다.',
    });

    if (!activeSessionId) return;

    // TODO: 만족도 조사 — 우선순위 보류
    // if ((sessionList.length + 1) % 5 === 0) {
    //   openModal('satisfaction');
    // }

    const token = getCookie('accessToken') ?? '';
    if (!token) {
      router.push('/login');
      return;
    }

    const controller = new AbortController();
    finalizeAbortRef.current = controller;

    // onDone 클로저에서 state 참조가 stale해질 수 있으므로 로컬 변수로 캡처
    let capturedResult: typeof finalizeResult = null;
    const capturedSessionId = activeSessionId;

    try {
      await finalizeSessionStream(
        capturedSessionId,
        token,
        () => {}, // status 이벤트 — 고정 메시지 유지
        (data) => {
          setFinalizeResult(data);
          capturedResult = data;
        },
        () => {
          // 만족도 팝업이 열려 있으면 닫기
          closeModal();
          // 텍스트 버블 대신 감정 카드 버블 표시
          if (capturedResult) {
            const cardData = finalizeToEmotionCardData(capturedResult, capturedSessionId);
            setAppendMessage({
              variant: 'ai',
              senderName: '나봄이',
              avatarSrc: activeAiAvatarSrc,
              emotionCardData: cardData,
            });
            setCapturePayload({ data: cardData, summaryId: capturedResult.summary_id });
          }
        },
        controller.signal,
        (errorMessage) => {
          closeModal();
          console.error('Finalize SSE error:', errorMessage);
          setAppendMessage({
            variant: 'ai',
            senderName: '나봄이',
            avatarSrc: activeAiAvatarSrc,
            content: '마음 기록 생성 중 오류가 발생했습니다.',
          });
        }
      );
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      closeModal();
      const code = err instanceof Error ? err.message : '';
      const message =
        code === 'SESSION_ALREADY_SAVED'
          ? '이미 저장된 상담입니다.'
          : code === 'SESSION_TOO_SHORT'
            ? '상담이 너무 짧아 기록을 생성할 수 없습니다.'
            : code === 'SESSION_NOT_FOUND'
              ? '세션을 찾을 수 없습니다.'
              : '마음 기록 생성에 실패했습니다.';
      setAppendMessage({
        variant: 'ai',
        senderName: '나봄이',
        avatarSrc: activeAiAvatarSrc,
        content: message,
      });
    }
  };

  return (
    <div className="layout-container bg-bg-light relative flex h-[calc(100dvh-4rem)] min-h-0 overflow-hidden md:h-[calc(100dvh-5rem)]">
      {/* 모바일 사이드바 오버레이 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-[55] bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 사이드바 — 모바일: 슬라이드 오버레이, 데스크톱: 고정 */}
      <div
        className={`fixed inset-y-0 left-0 z-[60] w-[min(320px,85vw)] transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:z-auto lg:w-80.75 lg:translate-x-0 lg:transition-none`}
      >
        <ChatSidebar
          onNewCounsel={handleNewCounsel}
          activeSessionId={activeSessionId}
          onSelectSession={handleSelectSession}
          onDeleteSession={handleDeleteSession}
          sessionGroups={sessionGroups}
        />
      </div>

      {/* 메인 채팅 영역 */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden border-r border-black/5">
        {/* 모바일 상담 목록 트리거 (lg 미만에서만 표시) */}
        <div className="border-prime-100 sticky top-0 z-10 flex items-center gap-3 border-b bg-white px-4 py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="hover:bg-prime-50 text-prime-700 flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
          >
            <Menu className="size-4" />
            상담 목록
          </button>
        </div>
        <ChatMainArea
          onEndChat={handleEndChat}
          onCreditShortage={() => openModal('credit-shortage')}
          onUnfinishedSession={() => openModal('unfinished-session')}
          initialMessages={activeMessages}
          isSessionActive={isSessionActive}
          onDisabledInputClick={handleDisabledInputClick}
          appendMessage={appendMessage}
          sessionId={activeSessionId}
          onSessionCreated={(id) => {
            setActiveSessionId(id);
            setSessionList((prev) => [
              { sessionId: id, title: '', status: 'ACTIVE', startedAt: new Date().toISOString() },
              ...prev,
            ]);
          }}
          aiName={activeAiName}
          aiAvatarSrc={activeAiAvatarSrc}
          onUserMessage={resetInactivityTimer}
          userName={user?.name}
          userAvatarSrc={user?.profileImage}
        />
      </div>

      {/* 크레딧 부족 모달 */}
      <ChatCreditModal
        isOpen={activeModal === 'credit-shortage'}
        onClose={closeModal}
        remainingCredits={remainingCredits}
        onEnd={closeModal}
        onPurchase={() => {
          closeModal();
          router.push('/shop');
        }}
      />

      {/* 새로운 상담 안내 모달 — 블러 없음 */}
      <ChatNewSessionModal
        isOpen={activeModal === 'new-session'}
        onClose={closeModal}
        onConfirm={closeModal}
        overlayBlur={false}
      />

      {/* 미완결 상담 모달 — 블러 있음 */}
      <ChatUnfinishedSessionModal
        isOpen={activeModal === 'unfinished-session'}
        onClose={closeModal}
        sessionTitle={unfinishedSession?.title ?? ''}
        sessionDate={
          unfinishedSession
            ? new Date(unfinishedSession.started_at)
                .toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })
                .replace(/\. /g, '. ')
            : ''
        }
        onIgnore={handleUnfinishedIgnore}
        onResume={handleUnfinishedResume}
        overlayBlur
      />

      {/* 상담 종료 확인 모달 */}
      <ChatAlertModal
        isOpen={activeModal === 'end-confirm'}
        onClose={closeModal}
        onWait={closeModal}
        onEnd={handleEndConfirmed}
      />

      {/* TODO: 만족도 조사 — 우선순위 보류 */}
      {/* <ChatSatisfactionModal
        isOpen={activeModal === 'satisfaction'}
        onClose={closeModal}
        onYes={closeModal}
        onNo={closeModal}
      /> */}

      {/* 감정 카드 이미지 캡처용 — 화면 밖에 숨겨서 렌더링 */}
      {/* 주의: 캡처 대상 div 자체에 position:fixed + left:-9999px 쓰면 html-to-image의
           SVG foreignObject 렌더링 시 fixed 기준점이 foreignObject가 되어 내용이 캡처 영역 밖으로 나가 빈 이미지가 됨.
           → 부모 div로 화면 밖에 숨기고, 캡처 div는 position 없는 plain 블록으로 유지 */}
      {capturePayload && (
        <div
          style={{
            position: 'fixed',
            left: '-9999px',
            top: 0,
            pointerEvents: 'none',
            zIndex: -1,
          }}
        >
          {/* card_back_image — 오로라 전면 */}
          <div
            ref={captureCardRef}
            style={{
              width: 400,
              height: 686,
            }}
          >
            <EmotionCardFront
              layers={capturePayload.data.layers}
              emotionLabel={(
                capturePayload.data.layers.find((l) => l.role === 'primary')?.type ?? 'emotion'
              ).toUpperCase()}
              width={400}
              height={686}
            />
          </div>
          {/* card_front_image — 텍스트+오로라 후면 */}
          <div
            ref={captureBackCardRef}
            style={{
              width: 422,
              height: 723,
            }}
          >
            <EmotionCardBack
              data={capturePayload.data}
              layers={capturePayload.data.layers}
              emotionLabel={(
                capturePayload.data.layers.find((l) => l.role === 'primary')?.type ?? 'emotion'
              ).toUpperCase()}
              width={422}
              height={723}
              animated={false}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ChatPage() {
  const visitKey = useChatNavigationStore((s) => s.visitKey);
  return (
    <Suspense>
      <ChatPageContent key={visitKey} />
    </Suspense>
  );
}