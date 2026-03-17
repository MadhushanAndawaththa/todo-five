import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { TaskForm } from './TaskForm'

describe('TaskForm', () => {
  it('renders title and description inputs with submit button', () => {
    render(<TaskForm onSubmit={vi.fn()} />)

    expect(screen.getByTestId('title-input')).toBeInTheDocument()
    expect(screen.getByTestId('description-input')).toBeInTheDocument()
    expect(screen.getByTestId('submit-button')).toBeInTheDocument()
  })

  it('disables submit button when fields are empty', () => {
    render(<TaskForm onSubmit={vi.fn()} />)

    expect(screen.getByTestId('submit-button')).toBeDisabled()
  })

  it('disables submit button when only title is filled', async () => {
    render(<TaskForm onSubmit={vi.fn()} />)
    await userEvent.type(screen.getByTestId('title-input'), 'Buy milk')

    expect(screen.getByTestId('submit-button')).toBeDisabled()
  })

  it('disables submit button when only description is filled', async () => {
    render(<TaskForm onSubmit={vi.fn()} />)
    await userEvent.type(screen.getByTestId('description-input'), 'Some description')

    expect(screen.getByTestId('submit-button')).toBeDisabled()
  })

  it('enables submit button when both fields have content', async () => {
    render(<TaskForm onSubmit={vi.fn()} />)
    await userEvent.type(screen.getByTestId('title-input'), 'Buy milk')
    await userEvent.type(screen.getByTestId('description-input'), '2% at the store')

    expect(screen.getByTestId('submit-button')).not.toBeDisabled()
  })

  it('calls onSubmit with trimmed title and description', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<TaskForm onSubmit={onSubmit} />)

    await userEvent.type(screen.getByTestId('title-input'), '  Buy milk  ')
    await userEvent.type(screen.getByTestId('description-input'), '  2% at the store  ')
    fireEvent.submit(screen.getByTestId('task-form'))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith('Buy milk', '2% at the store')
    })
  })

  it('clears inputs after successful submission', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<TaskForm onSubmit={onSubmit} />)

    await userEvent.type(screen.getByTestId('title-input'), 'Buy milk')
    await userEvent.type(screen.getByTestId('description-input'), 'Some description')
    fireEvent.submit(screen.getByTestId('task-form'))

    await waitFor(() => {
      expect(screen.getByTestId('title-input')).toHaveValue('')
      expect(screen.getByTestId('description-input')).toHaveValue('')
    })
  })

  it('shows error message when submission fails', async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error('Network error'))
    render(<TaskForm onSubmit={onSubmit} />)

    await userEvent.type(screen.getByTestId('title-input'), 'Buy milk')
    await userEvent.type(screen.getByTestId('description-input'), 'Some description')
    fireEvent.submit(screen.getByTestId('task-form'))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })
})
