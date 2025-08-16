import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import RequestLoanButton from "./RequestLoan";

const meta: Meta<typeof RequestLoanButton> = {
  title: "Components/RequestLoanButton",
  component: RequestLoanButton,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof RequestLoanButton>;

export const Default: Story = {
  args: {
    bookId: "123",
  },
};
