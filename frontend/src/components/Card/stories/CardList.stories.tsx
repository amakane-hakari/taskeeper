import type { Meta, StoryObj } from '@storybook/react'
import CardList from '../CardList'
import { StoryThemeProvider } from '@/features/ui/components/StoryThemeProvider'
import 'sanitize.css'
import { Card } from '../Card'

const meta = {
  title: 'Components/CardList',
  component: CardList,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      disable: true,
    },
    theme: 'light',
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1280px',
            height: '800px',
          },
        },
      },
      defaultViewport: 'desktop',
    },
  },
  decorators: [
    (Story, context) => (
      <StoryThemeProvider initialTheme={context.parameters.theme}>
        <Story />
      </StoryThemeProvider>
    ),
  ]
} satisfies Meta<typeof CardList>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  args: {
    children: (
      <>
        <Card title="Card 1" subtitle="Subtitle 1">
          医者の方でも赤い顔をしていられないかも知れませんが、ちゃんと解ってるくせに、極めて簡単でした。そうして、その女の子が年頃になったのだろうといいました。君もいよいよ卒業したぐらいで、結構だ結構だといわれるくらいで、草書が大変上手であった。そうしたらまたお話ししましょう私はこんな事を打ち明けるのです。それが病気の加減で頭がだんだん鈍くなるのか何だってそんな事をした。
        </Card>
        <Card title="Card 2" subtitle="Subtitle 2" />
        <Card title="Card 3" subtitle="Subtitle 3" />
        <Card title="Card 4" subtitle="Subtitle 4" />
        <Card title="Card 5" subtitle="Subtitle 5" />
        <Card title="Card 6" subtitle="Subtitle 6" />
        <Card title="Card 7" subtitle="Subtitle 7" />
      </>
    ),
  },
};

export const EmptyDark: Story = {
  args: {
    children: (
      <>
        <Card title="Card 1" subtitle="Subtitle 1" />
        <Card title="Card 2" subtitle="Subtitle 2" />
        <Card title="Card 3" subtitle="Subtitle 3" />
        <Card title="Card 4" subtitle="Subtitle 4" />
        <Card title="Card 5" subtitle="Subtitle 5" />
        <Card title="Card 6" subtitle="Subtitle 6" />
        <Card title="Card 7" subtitle="Subtitle 7" />
      </>
    )
  },
  parameters: {
    theme: 'dark'
  }
}
