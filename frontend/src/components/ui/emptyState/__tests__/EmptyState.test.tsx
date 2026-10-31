import React from 'react';
import { EmptyState } from '../EmptyState';
import { EmptyStateDriver } from './EmptyState.driver';

describe('EmptyState Component', () => {
  let driver: EmptyStateDriver;

  beforeEach(() => {
    driver = new EmptyStateDriver();
  });

  it('renders the title correctly', () => {
    driver.render(<EmptyState title="No items found" />);
    expect(driver.exists()).toBe(true);
    expect(driver.getTitleText()).toBe('No items found');
    expect(driver.getDescriptionText()).toBeUndefined();
    expect(driver.hasIcon()).toBe(false);
  });

  it('renders description and icon when provided', () => {
    driver.render(
      <EmptyState
        title="No users"
        description="Try adjusting your filters"
        icon={<svg />}
      />
    );
    expect(driver.getDescriptionText()).toBe('Try adjusting your filters');
    expect(driver.hasIcon()).toBe(true);
  });

  it('renders the action element when provided', () => {
    driver.render(
      <EmptyState
        title="Empty"
        action={<button>Click Me</button>}
      />
    );
    expect(driver.hasAction()).toBe(true);
  });
});
