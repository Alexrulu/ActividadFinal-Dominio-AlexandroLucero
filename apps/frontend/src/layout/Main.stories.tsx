import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import Main from "./Main";

// Componente wrapper para simular distintos estados
const MainWrapper = ({
  token,
  userId,
  books = [],
  loan = null,
}: {
  token?: string;
  userId?: string;
  books?: any[];
  loan?: any;
}) => {
  // Mocks de hooks
  const useToken = () => ({ token, userId });
  const useBooks = () => ({ books });
  const useLoans = () => ({
    loan,
    refreshLoan: () => console.log("refreshLoan called"),
    loading: false,
  });

  // @ts-ignore: reemplazamos los hooks internos por mocks
  return <Main useToken={useToken} useBooks={useBooks} useLoans={useLoans} />;
};

const meta: Meta<typeof Main> = {
  title: "Pages/Main",
  component: Main,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Main>;

// Historias
export const NoLoan: Story = {
  render: () =>
    <MainWrapper 
      token="123" 
      userId="user1" 
      books={[{ id: "b1", title: "Libro A", author: "Autor A", thumbnail: "https://via.placeholder.com/100" }]} 
      loan={null} 
    />,
};

export const ActiveLoan: Story = {
  render: () =>
    <MainWrapper 
      token="123" 
      userId="user1" 
      books={[{ id: "b1", title: "Libro A", author: "Autor A", thumbnail: "https://via.placeholder.com/100" }]} 
      loan={{
        id: "loan1",
        bookId: "b1",
        from: new Date().toISOString(),
        to: new Date(Date.now() + 7*24*60*60*1000).toISOString(),
        approved: true,
        returned: false,
        returnRequested: false,
      }} 
    />,
};

export const LoanRequested: Story = {
  render: () =>
    <MainWrapper 
      token="123" 
      userId="user1" 
      books={[{ id: "b1", title: "Libro A", author: "Autor A", thumbnail: "https://via.placeholder.com/100" }]} 
      loan={{
        id: "loan1",
        bookId: "b1",
        from: new Date().toISOString(),
        to: new Date(Date.now() + 7*24*60*60*1000).toISOString(),
        approved: true,
        returned: false,
        returnRequested: true,
      }} 
    />,
};
