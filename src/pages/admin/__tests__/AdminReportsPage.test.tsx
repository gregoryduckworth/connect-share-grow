
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AdminReportsPage from '../AdminReportsPage'
import * as adminLogger from '@/lib/admin-logger'

// Mock the admin logger
vi.mock('@/lib/admin-logger', () => ({
  logAdminAction: vi.fn(),
}))

// Mock the data
vi.mock('@/lib/backend/data/admin-reports', () => ({
  ADMIN_REPORTS_DATA: [
    {
      id: 'rep-1',
      contentType: 'post',
      contentId: 'post-1',
      contentPreview: 'This is inappropriate content',
      reportedBy: 'user-1',
      createdAt: new Date('2024-01-01'),
      reason: 'Spam',
      status: 'pending',
      content: 'Full content here',
      communityId: 'comm-1',
    },
    {
      id: 'rep-2',
      contentType: 'reply',
      contentId: 'reply-1',
      contentPreview: 'Another bad comment',
      reportedBy: 'user-2',
      createdAt: new Date('2024-01-02'),
      reason: 'Harassment',
      status: 'resolved',
      content: 'Full reply content',
      communityId: 'comm-2',
    },
  ],
}))

describe('AdminReportsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the reports page', () => {
    render(<AdminReportsPage />)
    
    expect(screen.getByText('Manage Reports')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search reports...')).toBeInTheDocument()
  })

  it('should display reports in the table', async () => {
    render(<AdminReportsPage />)
    
    await waitFor(() => {
      expect(screen.getByText('This is inappropriate content')).toBeInTheDocument()
      expect(screen.getByText('Another bad comment')).toBeInTheDocument()
    })
  })

  it('should filter reports by search query', async () => {
    render(<AdminReportsPage />)
    
    const searchInput = screen.getByPlaceholderText('Search reports...')
    fireEvent.change(searchInput, { target: { value: 'inappropriate' } })
    
    await waitFor(() => {
      expect(screen.getByText('This is inappropriate content')).toBeInTheDocument()
      expect(screen.queryByText('Another bad comment')).not.toBeInTheDocument()
    })
  })

  it('should resolve a report', async () => {
    render(<AdminReportsPage />)
    
    await waitFor(() => {
      const resolveButtons = screen.getAllByText('Resolve')
      fireEvent.click(resolveButtons[0])
    })

    expect(adminLogger.logAdminAction).toHaveBeenCalledWith({
      action: 'report_resolved',
      details: expect.stringContaining('Resolved report rep-1'),
      targetId: 'rep-1',
      targetType: 'report',
    })
  })

  it('should open delete confirmation dialog', async () => {
    render(<AdminReportsPage />)
    
    await waitFor(() => {
      const deleteButtons = screen.getAllByText('Delete')
      fireEvent.click(deleteButtons[0])
    })

    expect(screen.getByText('Are you sure?')).toBeInTheDocument()
    expect(screen.getByText('This action cannot be undone. This will permanently delete the report.')).toBeInTheDocument()
  })

  it('should delete a report after confirmation', async () => {
    render(<AdminReportsPage />)
    
    await waitFor(() => {
      const deleteButtons = screen.getAllByText('Delete')
      fireEvent.click(deleteButtons[0])
    })

    const confirmButton = screen.getByRole('button', { name: 'Delete' })
    fireEvent.click(confirmButton)

    expect(adminLogger.logAdminAction).toHaveBeenCalledWith({
      action: 'report_deleted',
      details: expect.stringContaining('Deleted report rep-1'),
      targetId: 'rep-1',
      targetType: 'report',
    })
  })
})
