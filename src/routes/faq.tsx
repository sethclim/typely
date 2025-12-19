import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/faq')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='text-white'>Hello "/faq"!</div>
}
