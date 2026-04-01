import type { FC } from 'react'
import { useDocumentTitle } from '@/hooks/use-document-title'

const HomePage: FC = () => {
  useDocumentTitle('pages.home')

  return (
    <div>
      <h1>Home Page</h1>
    </div>
  )
}

export default HomePage
