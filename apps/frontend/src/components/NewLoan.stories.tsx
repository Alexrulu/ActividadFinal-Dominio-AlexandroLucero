import type { Meta, StoryObj } from "@storybook/react";
import NewLoan from "./NewLoan";

const meta: Meta<typeof NewLoan> = {
  title: "Components/NewLoan",
  component: NewLoan,
};

export default meta;
type Story = StoryObj<typeof NewLoan>;

export const Default: Story = {};
