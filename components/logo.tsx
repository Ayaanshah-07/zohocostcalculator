import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  className?: string
  size?: "small" | "medium" | "large"
  href?: string
  customLogoUrl?: string
}

export function Logo({ className = "", size = "medium", href, customLogoUrl }: LogoProps) {
  // Define sizes for different variants
  const sizes = {
    small: { width: 120, height: 36 },
    medium: { width: 180, height: 54 },
    large: { width: 240, height: 72 },
  }

  const { width, height } = sizes[size]

  const logoContent = (
    <Image
      src={customLogoUrl || "G12-AI-05.png"}
      alt="G12 Logo"
      width={width}
      height={height}
      priority
    />
  )

  return (
    <div className={`flex items-center ${className}`}>
      {href ? (
        <Link href={href} className="hover:opacity-80 transition-opacity">
          {logoContent}
        </Link>
      ) : (
        logoContent
      )}
    </div>
  )
}
