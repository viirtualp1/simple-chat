import { z } from 'zod'

export enum SortFilterType {
  RECENT = 'recent',
  NEW = 'new',
}

export const FilterSchema = z.object({
  search: z.string().optional(),
  sort: z.enum(['recent', 'new']).optional(),
})

export type Filter = z.infer<typeof FilterSchema>
