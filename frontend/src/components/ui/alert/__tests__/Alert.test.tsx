import React from 'react';
import { render } from '@testing-library/react';
import { Alert } from '../Alert';
import { AlertDriver } from './Alert.driver';

describe('Alert Component', () => {
  it('renders successfully with a title', () => {
    render(<Alert title="System Update" />);
    const driver = new AlertDriver();
    
    expect(driver.exists()).toBe(true);
    expect(driver.getTitle()).toBe('System Update');
  });

  it('renders children content correctly', () => {
    render(
      <Alert title="Success">
        Your changes have been saved.
      </Alert>
    );
    const driver = new AlertDriver();
    
    expect(driver.getContent()).toBe('Your changes have been saved.');
  });

  it('triggers onClose when close button is clicked', () => {
    const handleClose = jest.fn();
    render(<Alert title="Close me" onClose={handleClose} />);
    
    const driver = new AlertDriver();
    driver.clickClose();
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
