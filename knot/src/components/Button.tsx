import Link from "next/link";

type ButtonProps = {
    children: React.ReactNode,
    href: string,
    additionalClasses?: string,
    icon?: React.ReactNode
}

const Button = ({ children, href, additionalClasses, icon }: ButtonProps) => {
    return (
        <Link href={href} className={
            `min-w-16 min-h-8 flex justify-between items-center gap-2 px-4 py-2.5
             font-nunito text-xl transition-all bg-background border border-foreground-dim
             rounded hover:bg-accent-dim hover:text-foreground ${additionalClasses}`
        }>
            {icon} {children}
        </Link>
    )
}

export default Button
