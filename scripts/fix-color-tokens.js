#!/usr/bin/env node
/**
 * UI 색상 토큰 일괄 변환 스크립트
 *
 * 1단계: style 객체 내 hex 색상 → CSS 변수 (var(--color-*))
 * 2단계: style={{ color: 'var(...)' }} 단독 사용 → className="text-*"
 */

const fs = require('fs');
const path = require('path');

// ─── 색상 매핑 테이블 ──────────────────────────────────────────────────────────
const COLOR_MAP = [
  { hex: '#1a222e', token: 'prime-900' },
  { hex: '#2c3a4f', token: 'prime-800' },
  { hex: '#3f526f', token: 'prime-700' },
  { hex: '#3f527e', token: 'prime-700' }, // 디자인 오차, prime-700 매핑
  { hex: '#516a90', token: 'prime-600' },
  { hex: '#6983aa', token: 'prime-500' },
  { hex: '#697aa9', token: 'prime-500' }, // 디자인 오차, prime-500 매핑
  { hex: '#8a9ba8', token: 'tertiary-400' },
  { hex: '#abb9cf', token: 'prime-300' },
  { hex: '#b1c7dd', token: 'secondary-300' },
  { hex: '#d4e0ed', token: 'secondary-200' },
  { hex: '#82c9ff', token: 'cta-300' },
  { hex: '#0b63f3', token: 'info-600' },
  { hex: '#10b981', token: 'success-700' },
  { hex: '#bd1010', token: 'error-600' },
  { hex: '#c57f08', token: 'warning-600' },
  { hex: '#945f06', token: 'warning-700' },
  { hex: '#334155', token: 'neutral-800' },
];

const cssVar = (token) => `var(--color-${token})`;

// ─── TSX 파일 수집 ─────────────────────────────────────────────────────────────
function collectTsxFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules') {
      results.push(...collectTsxFiles(fullPath));
    } else if (entry.isFile() && /\.(tsx|ts)$/.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

// ─── 1단계: CSS style 속성 내 hex → CSS 변수 ──────────────────────────────────
// color: '#HEX', borderColor: '#HEX', background: '#HEX' 등 대응
const STYLE_PROPS = 'color|borderColor|background|backgroundColor|stroke|fill';

function replaceHexInStyleProps(content) {
  let result = content;
  for (const { hex, token } of COLOR_MAP) {
    const hexBody = hex.slice(1); // # 제거
    // style 객체 프로퍼티: color: '#HEX' 또는 color: "#HEX"
    const regex = new RegExp(
      `((?:${STYLE_PROPS})\\s*:\\s*)['"]#${hexBody}['"]`,
      'gi'
    );
    result = result.replace(regex, `$1'${cssVar(token)}'`);
  }
  return result;
}

// ─── 2단계: 단독 style={{ color: 'var(...)' }} → className="text-*" ───────────
// JSX에서 style 속성이 color만 가진 경우 Tailwind 클래스로 전환
function replaceStandaloneColorStyle(content) {
  let result = content;

  for (const { token } of COLOR_MAP) {
    const varValue = cssVar(token);
    const tailwindClass = `text-${token}`;

    // 패턴 1: style={{ color: 'var(...)' }} 단독 → style 제거 후 className 추가
    // className이 이미 있는 경우: className="..." style={{ color: '...' }}
    const withClassNameRegex = new RegExp(
      `(className=")([^"]*)"\\s+style=\\{\\{\\s*color:\\s*'${escapeRegex(varValue)}'\\s*\\}\\}`,
      'g'
    );
    result = result.replace(withClassNameRegex, (_, prefix, existing) => {
      return `${prefix}${existing} ${tailwindClass}"`;
    });

    // 패턴 2: style={{ color: '...' }} 단독이고 className이 없는 경우
    const withoutClassNameRegex = new RegExp(
      `style=\\{\\{\\s*color:\\s*'${escapeRegex(varValue)}'\\s*\\}\\}`,
      'g'
    );
    result = result.replace(withoutClassNameRegex, `className="${tailwindClass}"`);
  }

  return result;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ─── 실행 ──────────────────────────────────────────────────────────────────────
const srcDir = path.resolve(__dirname, '../src');
const files = collectTsxFiles(srcDir);

let modifiedCount = 0;
let replacementCount = 0;

for (const file of files) {
  const original = fs.readFileSync(file, 'utf8');

  let content = replaceHexInStyleProps(original);
  content = replaceStandaloneColorStyle(content);

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    const relPath = path.relative(srcDir, file);
    const before = (original.match(/#[0-9a-fA-F]{6}/g) || []).length;
    const after = (content.match(/#[0-9a-fA-F]{6}/g) || []).length;
    const fixed = before - after;
    replacementCount += fixed;
    console.log(`  ✓ ${relPath} (${fixed}개 교체)`);
    modifiedCount++;
  }
}

console.log(`\n총 ${modifiedCount}개 파일, ${replacementCount}개 색상 토큰화 완료`);
