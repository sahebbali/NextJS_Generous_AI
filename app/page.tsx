import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function Home() {
  return (
   <div>
    <h2 className='text-green-500 '>Hello how are you</h2>
    <Button size="sm" variant="destructive" >Click me</Button>
   </div>
  )
}
