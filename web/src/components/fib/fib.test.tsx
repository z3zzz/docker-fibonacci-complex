import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Fib from './fib';
import { mockServer } from './api-mock';

describe('Fib Component', () => {
  beforeAll(() => mockServer.listen());
  afterAll(() => mockServer.close());

  it('should render without error', async () => {
    render(
      <BrowserRouter>
        <Fib />
      </BrowserRouter>
    );

    await screen.findAllByText(/fibonacci/);

    const element1 = screen.getByText(/Go to other page/i);
    const element2 = screen.getByText(/Indexes you have seen/i);
    const element3 = screen.getByText(/Caculated Values/i);

    expect(element1).toBeInTheDocument();
    expect(element2).toBeInTheDocument();
    expect(element3).toBeInTheDocument();
  });

  it('should render fetched datas', async () => {
    render(
      <BrowserRouter>
        <Fib />
      </BrowserRouter>
    );

    await screen.findAllByText(/fibonacci/);

    const element1 = screen.getByText(/2, 4, 5/i);
    const element2 = screen.getByText(/For index 5 the fibonacci number is 8/i);

    expect(element1).toBeInTheDocument();
    expect(element2).toBeInTheDocument();
  });

  it('should send post request with input number when button is clicked, and fetch new datas, then re-render', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <Fib />
      </BrowserRouter>
    );

    await screen.findAllByText(/fibonacci/);

    const input = screen.getByRole(/textbox/);
    const button = screen.getByRole(/button/);

    await user.type(input, '6');
    await user.click(button);

    await screen.findAllByText(/6/);

    const element1 = screen.getByText(/2, 4, 5, 6/i);
    const element2 = screen.getByText(
      /For index 6 the fibonacci number is 13/i
    );

    expect(element1).toBeInTheDocument();
    expect(element2).toBeInTheDocument();
  });
});
