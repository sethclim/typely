
import { createFileRoute } from '@tanstack/react-router'
import { ThemeEditor } from '../../components/ThemeEditor'


export const Route = createFileRoute('/_app/theme-editor/$themeId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { themeId } = Route.useParams()
  return <ThemeEditor themeId={themeId} />
}