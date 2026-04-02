import { ShieldAlert } from 'lucide-react';

const REFUND_POLICIES = [
  '크레딧 환불은 기본적으로 본 페이지에서 현금으로 구매한 크레딧 상품에 한정됩니다.',
  "매일 로그인을 통한 '접속보상'이나 회원가입 시 제공되는 '가입 기념 크레딧'은 환불의 대상에 포함되지 않습니다.",
  '본 페이지에서 현금으로 결제한 크레딧의 경우 구매 시점부터 7일 안에 환불 신청이 가능합니다. 기간이 늦춰진 경우 환불 대상에서 제외됨을 알려드립니다.',
  '환불을 신청할 시 구매 내역이 있어야 하며, 구매 시 받으셨던 크레딧을 그대로 보존하셔야 합니다. 1 크레딧이라도 사용이 된 경우 환불 진행이 불가합니다.',
  '본인 명의가 아닌 결제수단으로 본 서비스를 이용하였다면 환불에서 제외됨을 알려드립니다. 모든 거래는 본인 명의의 적법한 거래수단에 의한 거래만을 인정합니다.',
  '본인 명의가 아님에도 결제가 이루어졌다면 결제 관련 증빙 내역을 지참하시고 고객지원에 연락을 부탁드리겠습니다.',
  '타인의 명의의 거래수단으로 불법적인 거래가 이루어졌을 시 민형사법에 의한 법적 대응이 발생할 수 있습니다.',
];

export function RefundPolicyNotice() {
  return (
    <section className="border-error-200 w-full rounded-2xl border px-6 py-5">
      <div className="mb-4 flex items-center gap-2">
        <ShieldAlert size={16} className="text-error-500 shrink-0" />
        <h2 className="text-error-800 text-sm font-semibold tracking-tight">환불 정책 사전 고지</h2>
      </div>
      <ul className="flex flex-col gap-2.5">
        {REFUND_POLICIES.map((policy, idx) => (
          <li key={idx} className="text-error-600 flex gap-2 text-xs leading-relaxed">
            <span className="text-error-400 shrink-0 font-medium">{idx + 1}.</span>
            <span>{policy}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
