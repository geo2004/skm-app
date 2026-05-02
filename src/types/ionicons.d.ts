// Type declarations for Ionicons web components (React 19 / react-jsx)
import "react"

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "ion-icon": React.HTMLAttributes<HTMLElement> & {
        name?: string
        size?: string
        color?: string
      }
    }
  }
}
