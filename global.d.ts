// Ambient declarations the package needs to type-check on its own, without
// relying on the host app's next-env.d.ts (next's global.d.ts) or
// types/globals.d.ts. Kept in sync by hand — it only needs the shapes this
// package's source actually imports/uses.

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.css'

declare module '*.svg' {
  import type { FC, SVGProps } from 'react'
  const content: FC<SVGProps<SVGSVGElement>>
  export default content
}
declare module '*.png' {
  const content: any
  export default content
}

declare module '*.webp' {
  const content: any
  export default content
}
declare module '*.gif' {
  const content: any
  export default content
}
