import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HomePage } from './HomePage'

describe('HomePage', () => {
  it('menampilkan judul TITIS', () => {
    render(<HomePage />)
    expect(screen.getByRole('heading', { name: 'TITIS' })).toBeInTheDocument()
  })
})
