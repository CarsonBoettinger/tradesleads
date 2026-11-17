import Image from "next/image";

export function Mark({ className = "size-12" }: { className?: string }) {
  return (
    <Image
      src="/brand/kalvez-icon.png"
      alt=""
      width={48}
      height={48}
      className={className}
      aria-hidden
    />
  );
}

export function Logo({ tone = "cocoa" }: { tone?: "cocoa" | "cream" }) {
  const src =
    tone === "cream"
      ? "/brand/kalvez-logo-white.png"
      : "/brand/kalvez-logo.png";

  return (
    <Image
      src={src}
      alt="Kalvez"
      width={158}
      height={47}
      className="h-10 w-auto sm:h-11"
      priority={tone === "cocoa"}
    />
  );
}
