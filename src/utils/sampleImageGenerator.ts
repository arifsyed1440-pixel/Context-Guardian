/**
 * Generates client-side realistic chat screenshots on an HTML5 canvas.
 * Used for reliable hackathon demo presentations without requiring external assets.
 */
export interface SampleChatPreset {
  id: string;
  sender: string;
  role: string;
  channel: string;
  time: string;
  avatarBg: string;
  text: string;
  title: string;
  tag: string;
}

export const DEMO_PRESETS: SampleChatPreset[] = [
  {
    id: 'sample-rahul',
    sender: 'Rahul',
    role: 'Product Lead',
    channel: '#project-reviews',
    time: '4:15 PM',
    avatarBg: '#3b82f6',
    text: "Rahul: Hey, for tomorrow's project review, please bring the latest prototype. Also update the architecture slides before 5 PM.",
    title: 'Slack - Rahul (Canonical Review Request)',
    tag: 'Canonical Demo'
  },
  {
    id: 'sample-priya',
    sender: 'Priya',
    role: 'Design Systems',
    channel: '#mobile-handover',
    time: '2:30 PM',
    avatarBg: '#8b5cf6',
    text: "Priya: For the mobile design handover, please verify the onboarding Figma components and export the SVG icon kit by Friday.",
    title: 'Teams - Priya (Design Handover)',
    tag: 'Design Sync'
  },
  {
    id: 'sample-alex',
    sender: 'Alex',
    role: 'DevOps & Backend',
    channel: '#incident-response',
    time: '11:45 AM',
    avatarBg: '#f43f5e',
    text: "Alex: We need to fix the memory leak in production sync before tonight's 8 PM release. Review the crash logs on Sentry.",
    title: 'Incident - Alex (Release Urgent)',
    tag: 'Urgent Fix'
  }
];

export function generateScreenshotDataUrl(preset: SampleChatPreset): string {
  const canvas = document.createElement('canvas');
  canvas.width = 680;
  canvas.height = 320;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background gradient (Dark Slack/Discord style)
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 320);
  bgGrad.addColorStop(0, '#131722');
  bgGrad.addColorStop(1, '#0c0f17');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Top window header bar
  ctx.fillStyle = '#1c202d';
  ctx.fillRect(0, 0, canvas.width, 42);

  // Window dots
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(20, 21, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(36, 21, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(52, 21, 5, 0, Math.PI * 2);
  ctx.fill();

  // Channel title
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 13px Inter, -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillText(preset.channel, 75, 25);

  // Chat message container card
  ctx.fillStyle = '#181c28';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(24, 60, canvas.width - 48, 230, 12);
  ctx.fill();
  ctx.stroke();

  // Avatar circle
  ctx.fillStyle = preset.avatarBg;
  ctx.beginPath();
  ctx.arc(56, 100, 20, 0, Math.PI * 2);
  ctx.fill();

  // Avatar text letter
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px Inter, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(preset.sender.charAt(0), 56, 100);

  // Sender Name & Role
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 15px Inter, -apple-system, sans-serif';
  ctx.fillText(preset.sender, 90, 96);

  ctx.fillStyle = '#64748b';
  ctx.font = '12px Inter, -apple-system, sans-serif';
  ctx.fillText(`${preset.role} • ${preset.time}`, 90 + ctx.measureText(preset.sender).width + 12, 96);

  // Message body with clean text wrapping
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '15px Inter, -apple-system, sans-serif';
  const maxWidth = canvas.width - 130;
  const words = preset.text.split(' ');
  let line = '';
  let y = 135;
  const lineHeight = 24;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, 90, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, 90, y);

  // Watermark
  ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
  ctx.font = '10px monospace';
  ctx.fillText('[Context Guardian OCR Ingestion Target]', 90, 260);

  return canvas.toDataURL('image/png');
}
