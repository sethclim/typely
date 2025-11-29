import { createFileRoute } from '@tanstack/react-router'
import { LoggedOut } from '../components/LoggedOut'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='bg-black p-60 h-full w-full'>
        <LoggedOut />
    </div>
  )
}
