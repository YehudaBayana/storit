import { FormDriver } from './Form.driver';

describe('Form Component', () => {
  let driver: FormDriver;

  beforeEach(() => {
    driver = new FormDriver();
  });

  it('calls the onSubmit handler and prevents default browser reload', () => {
    const submitSpy = jest.fn();
    driver.render({ onSubmit: submitSpy, children: <button type="submit">Submit</button> });
    
    driver.submit();
    
    expect(submitSpy).toHaveBeenCalledTimes(1);
    
    // We verify preventDefault was called by checking the event passed to the spy
    const eventArg = submitSpy.mock.calls[0][0];
    expect(eventArg.isDefaultPrevented()).toBe(true);
  });
});
