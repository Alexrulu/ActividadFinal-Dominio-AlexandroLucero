import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import CloseSession from "./CloseSession";

const meta: Meta<typeof CloseSession> = {
  title: "Components/CloseSession",
  component: CloseSession,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CloseSession>;

export const Default: Story = {};
