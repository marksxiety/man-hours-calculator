export type Appearance = 'light' | 'dark' | 'system'

export type ResolvedAppearance = 'light' | 'dark'

export interface Theme {
    appearance: Appearance
    icon: string
}
