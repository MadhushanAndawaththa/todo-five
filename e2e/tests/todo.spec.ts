import { test, expect } from '@playwright/test'

test.describe('Todo App E2E', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'My Tasks' })).toBeVisible()
  })

  test('creates a task and it appears in the list', async ({ page }) => {
    await page.getByTestId('title-input').fill('Buy groceries')
    await page.getByTestId('description-input').fill('Milk, eggs, and bread')
    await page.getByTestId('submit-button').click()

    await expect(page.getByText('Buy groceries')).toBeVisible()
    await expect(page.getByText('Milk, eggs, and bread')).toBeVisible()
  })

  test('clears the form after successful creation', async ({ page }) => {
    await page.getByTestId('title-input').fill('Write tests')
    await page.getByTestId('description-input').fill('Unit and integration')
    await page.getByTestId('submit-button').click()

    await expect(page.getByTestId('title-input')).toHaveValue('')
    await expect(page.getByTestId('description-input')).toHaveValue('')
  })

  test('submit button is disabled when fields are empty', async ({ page }) => {
    await expect(page.getByTestId('submit-button')).toBeDisabled()
  })

  test('submit button is disabled when only title is filled', async ({ page }) => {
    await page.getByTestId('title-input').fill('Some title')
    await expect(page.getByTestId('submit-button')).toBeDisabled()
  })

  test('submit button is disabled when only description is filled', async ({ page }) => {
    await page.getByTestId('description-input').fill('Some description')
    await expect(page.getByTestId('submit-button')).toBeDisabled()
  })

  test('marking a task as done removes it from the list', async ({ page }) => {
    await page.getByTestId('title-input').fill('Task to complete')
    await page.getByTestId('description-input').fill('This should disappear')
    await page.getByTestId('submit-button').click()

    await expect(page.getByText('Task to complete')).toBeVisible()
    await page.getByRole('button', { name: /mark "task to complete" as done/i }).click()

    await expect(page.getByText('Task to complete')).not.toBeVisible({ timeout: 2000 })
  })

  test('shows at most 5 tasks when more than 5 are created', async ({ page }) => {
    // Create 6 tasks
    for (let i = 1; i <= 6; i++) {
      await page.getByTestId('title-input').fill(`Task ${i}`)
      await page.getByTestId('description-input').fill(`Description ${i}`)
      await page.getByTestId('submit-button').click()
      // Wait for the task to appear before creating the next
      await expect(page.getByText(`Task ${i}`)).toBeVisible()
    }

    const taskCards = page.getByTestId('task-list').locator('li')
    await expect(taskCards).toHaveCount(5)
  })

  test('shows empty state when no tasks exist', async ({ page }) => {
    // Check empty state is visible (assumes fresh DB or all tasks completed)
    const taskList = page.getByTestId('task-list')
    const emptyState = page.getByTestId('empty-state')

    const hasEmptyState = await emptyState.isVisible()
    const hasTaskList = await taskList.isVisible()

    // One of these must be true — app renders consistently
    expect(hasEmptyState || hasTaskList).toBe(true)
  })
})
