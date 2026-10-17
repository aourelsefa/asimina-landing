import { definePlugin } from 'sanity'
import { SimpleStudioLayout } from '../components/SimpleStudioLayout'
import { SimpleStudioNavbar } from '../components/SimpleStudioNavbar'
import { SimpleStudioToolMenu } from '../components/SimpleStudioToolMenu'
import { isEditorUser } from '../lib/isEditorUser'

function actionName(item: unknown): string {
  if (item && typeof item === 'object' && 'action' in item) {
    return String((item as { action?: string }).action)
  }
  return ''
}

export const simpleStudio = definePlugin({
  name: 'simple-studio',
  document: {
    newDocumentOptions: (prev, { currentUser }) => {
      if (!isEditorUser(currentUser)) return prev
      return prev.filter((option) => {
        const templateId =
          option && typeof option === 'object' && 'templateId' in option
            ? String((option as { templateId?: string }).templateId)
            : ''
        return templateId === 'blogPost'
      })
    },
    actions: (prev, { currentUser, schemaType }) => {
      if (!isEditorUser(currentUser)) return prev

      const blocked = new Set(['duplicate'])
      if (schemaType !== 'blogPost') {
        blocked.add('delete')
      }

      return prev.filter((item) => !blocked.has(actionName(item)))
    },
  },
  studio: {
    components: {
      layout: SimpleStudioLayout,
      navbar: SimpleStudioNavbar,
      toolMenu: SimpleStudioToolMenu,
    },
  },
})
