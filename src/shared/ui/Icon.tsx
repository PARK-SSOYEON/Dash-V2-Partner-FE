import {type IconName, IconRegistry} from "./icons/IconRegistry.ts";

type IconProps = {
    name: IconName
    size?: number
}

export const Icon: React.FC<IconProps> = ({ name, size = 24 }) => {
    const Component = IconRegistry[name] as React.ComponentType<React.SVGProps<SVGSVGElement>>
    if (!Component) return null
    return <Component width={size} height={size} />
}
