import { render, screen } from '@testing-library/react';
import DocumentStatusBadge from '../dashboard/DocumentStatusBadge';

describe('DocumentStatusBadge', () => {
  it('renders PENDING with amber styling', () => {
    render(<DocumentStatusBadge status="PENDING" />);

    const badge = screen.getByText('Pending');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('badge-yellow');
  });

  it('renders VERIFIED with green styling', () => {
    render(<DocumentStatusBadge status="VERIFIED" />);

    const badge = screen.getByText('Verified');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('badge-green');
  });

  it('renders REJECTED with red styling', () => {
    render(<DocumentStatusBadge status="REJECTED" />);

    const badge = screen.getByText('Rejected');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('badge-red');
  });

  it('shows a rejection-reason tooltip for REJECTED documents', () => {
    render(<DocumentStatusBadge status="REJECTED" rejectionReason="Signature does not match manifest" />);

    expect(screen.getByRole('tooltip')).toHaveTextContent('Signature does not match manifest');
  });

  it('links the badge to the tooltip via aria-describedby for accessibility', () => {
    render(<DocumentStatusBadge status="REJECTED" rejectionReason="Expired certificate" />);

    const badge = screen.getByText('Rejected');
    const tooltip = screen.getByRole('tooltip');
    expect(badge.getAttribute('aria-describedby')).toBe(tooltip.id);
  });

  it('makes the badge keyboard-focusable when a tooltip is present', () => {
    render(<DocumentStatusBadge status="REJECTED" rejectionReason="Illegible scan" />);

    expect(screen.getByText('Rejected')).toHaveAttribute('tabIndex', '0');
  });

  it('does not render a tooltip for REJECTED without a rejectionReason', () => {
    render(<DocumentStatusBadge status="REJECTED" />);

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    expect(screen.getByText('Rejected')).not.toHaveAttribute('tabIndex');
  });

  it('never renders a tooltip for non-REJECTED statuses, even if a reason is passed', () => {
    render(<DocumentStatusBadge status="VERIFIED" rejectionReason="should be ignored" />);

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('applies a custom className to the wrapper', () => {
    const { container } = render(<DocumentStatusBadge status="PENDING" className="ml-2" />);

    expect(container.firstElementChild).toHaveClass('ml-2');
  });
});
