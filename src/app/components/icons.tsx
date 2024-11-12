export type iconName = 'arrow-up' | 'arrow-right' | 'menu' | 'close' | 'contact'

interface IconProps {
  name: iconName
  className?: string
  size?: number
  color?: string
}

export default function Icon({ name, className, size = 25, color = 'white' }: IconProps) {
  switch(name) {
    case 'arrow-up':
      return (
        <svg x="0px" y="0px" width={size} height={size} viewBox="0 0 20 20">
          <path fill="#ffffff" d="M18.008,7.667L16.606,9,11,3.627V20H9V3.627L3.392,9l-1.4-1.336L10-.012Z"></path>
        </svg>
      )
    case 'arrow-right':
      return (
        <svg className="rotate-90" x="0px" y="0px" width={size} height={size} viewBox="0 0 20 20">
          <path fill="#ffffff" d="M18.008,7.667L16.606,9,11,3.627V20H9V3.627L3.392,9l-1.4-1.336L10-.012Z"></path>
        </svg>
      )
    case 'menu':
      return (
        <>
          <i
            className="top-0.5 absolute block w-6 h-1 left-0 transition-all duration-200 ease-linear translate3d-0"
            style={{ backgroundColor: color }}
          />
          <i
            className="top-2.5 absolute block w-6 h-1 left-0 transition-all duration-200 ease-linear translate3d-0"
            style={{ backgroundColor: color }}
          />
          <i
            className="bottom-0.5 absolute block w-6 h-1 left-0 transition-all duration-200 ease-linear translate3d-0"
            style={{ backgroundColor: color }}
          />
        </>
      )
    case 'close':
      return (
        <>
          <i
            className="top-[-1px] left-0.5 rotate-45 origin-[0_100%] absolute block w-7 h-1 transition-all duration-200 ease-linear"
            style={{ backgroundColor: color }}
          />
          <i
            className="bottom-0 left-0.5 -rotate-45 origin-[0_0] absolute block w-7 h-1 transition-all duration-200 ease-linear"
            style={{ backgroundColor: color }}
          />
        </>
      )
    case 'contact':
      return (
        <svg className={className} x="0px" y="0px" width="20px" height="20px" viewBox="0 0 20 20" enableBackground="new 0 0 20 20">
          <path fill="#ffffff" d="M16,17H4a2,2,0,0,1-2-2V5A2,2,0,0,1,4,3H16a2,2,0,0,1,2,2V15A2,2,0,0,1,16,17Zm0-2V7.619l-6,4.242L4,7.619V15H16ZM4,5V5.705l6,3.429,6-3.429V5H4Z"></path>
        </svg>
      )
    default:
      return <span />
  }
}