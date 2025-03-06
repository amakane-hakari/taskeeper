import type { Meta, StoryObj } from '@storybook/react'
import { Card } from '../Card'
import { StoryThemeProvider } from '@/features/ui/components/StoryThemeProvider'

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      disable: false,
    },
    theme: 'light'
  },
  decorators: [
    (Story, context) => (
      <StoryThemeProvider initialTheme={context.parameters.theme}>
        <Story />
      </StoryThemeProvider>
    ),
  ]
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  args: {},
}

export const EmptyDark: Story = {
  args: {},
  parameters: {
    theme: 'dark'
  }
}

export const WithChildren: Story = {
  args: {
    children: '医者の方でも赤い顔をしていられないかも知れませんが、ちゃんと解ってるくせに、極めて簡単でした。そうして、その女の子が年頃になったのだろうといいました。君もいよいよ卒業したぐらいで、結構だ結構だといわれるくらいで、草書が大変上手であった。そうしたらまたお話ししましょう私はこんな事を打ち明けるのです。それが病気の加減で頭がだんだん鈍くなるのか何だってそんな事をした。',
    title: 'カードのタイトル',
    subtitle: 'カードのサブタイトル',
    maxHeight: '200px',
  },
}

export const WithChildrenDark: Story = {
  args: {
    children: 'カードの中身',
    title: 'カードのタイトル',
    subtitle: 'カードのサブタイトル',
  },
  parameters: {
    theme: 'dark'
  }
}
