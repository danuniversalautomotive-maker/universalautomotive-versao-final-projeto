export default function base64ToBuffer(base64: string): Buffer {
  const matches = base64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
  const data = matches ? matches[2] : base64;
  return Buffer.from(data, 'base64');
}