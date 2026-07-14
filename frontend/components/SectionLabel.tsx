type SectionLabelProps = {
  index: string;
  children: React.ReactNode;
};

export function SectionLabel({ index, children }: SectionLabelProps) {
  return (
    <p className="flex items-baseline gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-[#7AF0BA]">
      <span className="text-[#858DA1]">{index}</span>
      <span className="block h-px w-12 bg-[#1F2333]" />
      <span>{children}</span>
    </p>
  );
}
