import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import Header from "./Header";

const HeaderWrapper = ({
  token,
  userId,
}: {
  token?: string;
  userId?: string;
}) => {
  const useToken = () => ({ token, userId });

  // @ts-ignore
  return <Header useToken={useToken} />;
};

const meta: Meta<typeof Header> = {
  title: "Components/Header",
  component: Header,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Header>;

export const LoggedAdmin: Story = {
  render: () => <HeaderWrapper token="123" userId="admin1" />,
};

export const LoggedUser: Story = {
  render: () => <HeaderWrapper token="456" userId="user123" />,
};

export const NotLogged: Story = {
  render: () => <HeaderWrapper />,
};
