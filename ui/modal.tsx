export default function Modal({ children }: { children: React.ReactNode }) {
  return <div className="fixed inset-0 grid place-items-center bg-black/50">{children}</div>;
}
