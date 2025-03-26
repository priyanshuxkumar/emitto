import * as React from "react";
import {
  Html,
  Heading,
  Container,
  Body,
  Head,
  Text,
} from "@react-email/components";
import { EmailTemplateProps } from "../types";

export const EmailTemplate = ({
  recipientFirstname,
  recipientLastname,
  subject,
  message,
}: EmailTemplateProps) => {
  return (
    <Html>
      <Head />
      <Body
        style={{
          fontFamily: "Arial, sans-serif",
          padding: "20px",
          lineHeight: "1.6",
        }}
      >
        <Container>
          <Heading>
            Hello {recipientFirstname} {recipientLastname},
          </Heading>
          <Heading as="h2">{subject}</Heading>
          <Text>{message}</Text>
          <Text>Best Regards,</Text>
          <Text>
            <strong>Your Company</strong>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};
