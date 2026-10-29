import type { Metadata } from 'next';
export const metadata: Metadata = {title:'Light Beyond Lamps',description:'A Diwali Sankalp for a brighter community.',icons:{icon:'/baps-logo.png'}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
