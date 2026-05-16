import Image from 'next/image'
import logo from '@/public/kmfi_logo.png'

export default function Logo() {
  return <Image src={logo} alt="My App Logo" width={120} height={40} priority />
}
